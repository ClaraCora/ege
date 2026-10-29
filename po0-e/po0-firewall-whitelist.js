/*
 * po0 防火墙自动加白 · Egern 原生脚本与小组件
 *
 * Egern 的脚本运行模型与 Surge 系不同：入口是 `export default async function(ctx)`，
 * 且没有 $httpClient/$persistentStore/$notification/$done 等全局，只能用 ctx.* API。
 *
 * 本脚本支持三合一运行模式：
 * 1. schedule: 定时（每 10 分钟）巡检加白
 * 2. network: 切网即时触发加白
 * 3. widget: iOS 桌面与锁定屏幕原生小组件（支持 systemSmall / systemMedium / systemLarge）
 *
 * 行为：POST https://124.221.69.228/api/firewall/<token>/add[?slot=N]，把本机当前
 *   出口 IP 加白。token 走 URL 路径；服务端对已在白名单的 IP 幂等；写满 5 个后按
 *   写入时间 FIFO 淘汰（带 slot 的行永不淘汰）。token 来自模块参数 tokens
 *   （ctx.env.tokens），可带 @槽位 后缀（pgnfw_xxx@0）钉固定坑位。
 * 加白粒度为 C 段（/24）：服务端把 whitelist 条目和 currentIp 归一化成
 *   x.x.x.0/24 回显，同段换 IP 不产生新写入；匹配用 sameC24() 兼容混杂格式。
 */

const API_BASE = "https://124.221.69.228/api/firewall/"; // + <token> + "/add"
const STORE_PREFIX = "po0_fw_";
const WIDGET_CACHE_KEY = "po0_fw_widget_cache";
const HIST_WINDOW_MS = 24 * 3600 * 1000; // 📶 标记的记账窗口

// tokens 分隔符兼容 , | ; 、 空白与换行；自动去除首尾引号；每段可带 @槽位 后缀
function parseTokens(raw) {
  return String(raw || "")
    .split(/[,|;、\s\n\r]+/)
    .map(function (s) {
      return s.replace(/^['"]+|['"]+$/g, "").trim();
    })
    .filter(function (s) {
      return s.indexOf("pgnfw_") === 0;
    })
    .map(function (s) {
      const at = s.indexOf("@");
      if (at === -1) return { token: s, slot: null };
      const n = parseInt(s.slice(at + 1), 10);
      return { token: s.slice(0, at), slot: isNaN(n) ? null : n };
    });
}

// WiFi 有 ssid 视为非蜂窝；否则若有蜂窝载波/制式则视为蜂窝（仅用于 📶 标记）
function onCellular(ctx) {
  try {
    const d = ctx.device || {};
    const onWifi = !!(d.wifi && d.wifi.ssid);
    const hasCell = !!(d.cellular && (d.cellular.carrier || d.cellular.radio));
    return !onWifi && hasCell;
  } catch (e) {
    return false;
  }
}

function readHistory(ctx, key) {
  let h;
  try {
    h = ctx.storage.getJSON(key) || [];
  } catch (e) {
    h = [];
  }
  if (!Array.isArray(h)) h = [];
  const cutoff = Date.now() - HIST_WINDOW_MS;
  return h.filter(function (e) {
    return e && e.ts > cutoff;
  });
}

function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

// po0 API 偶发瞬时异常：返回裸 400（body 仅 "Error"）/ 5xx，几秒后同一
// token 即成功。请求幂等，重试安全。规范 JSON 错误（如 token 无效）不重试。
const HTTP_RETRY = 3;
const HTTP_RETRY_DELAY_MS = 1500;

function isRetryableServerError(status, text) {
  if (!status) return false;
  if (status >= 500) return true;
  if (status >= 200 && status < 300) return false;
  if (status === 403) return false; // 槽位冲突，重试无意义
  try {
    JSON.parse(text);
    return false; // 规范 JSON 错误 = 确定性失败
  } catch (e) {
    return true; // 非 JSON body（如裸 "Error"）= 服务端瞬时异常
  }
}

// ⚠️ Egern 的 ctx.http 在非 2xx 响应时会直接 throw（如
// "HTTP error! status: 403, body: ..."），不会把 resp 交回来。
// 必须从 error message 里把 status/body 解析出来，走统一处理，
// 否则 403 槽位冲突分支永远走不到，只会弹裸的 HTTP error。
async function httpPostOnce(ctx, url) {
  let text = "";
  let status = 0;
  try {
    const resp = await ctx.http.post(url, {
      headers: { "Content-Type": "application/json" },
      body: "",
      timeout: 15000,
    });
    status = resp.status;
    try {
      text = await resp.text();
    } catch (e) {}
  } catch (e) {
    if (e && e.status) {
      status = e.status;
    }
    const msg = String((e && e.message) || e);
    const m = msg.match(/status(?:\s*code)?[:\s]+(\d{3})(?:[,\s]+body[:\s]*([\s\S]*))?/i);
    if (m) {
      if (!status) status = parseInt(m[1], 10);
      text = m[2] !== undefined ? m[2] : "";
    } else if (!status) {
      // 真网络层失败（超时/握手失败/被拦截），没有 HTTP status
      return { netError: msg || "网络请求失败（超时 / 握手失败 / 被拦截）" };
    }
  }
  return { status: status, text: text };
}

async function apiCall(ctx, token, slot) {
  let url = API_BASE + encodeURIComponent(token) + "/add";
  if (slot !== null && slot !== undefined && slot !== "") {
    url += "?slot=" + encodeURIComponent(slot);
  }
  let r = null;
  for (let attempt = 1; attempt <= HTTP_RETRY; attempt++) {
    r = await httpPostOnce(ctx, url);
    if (!r.netError && !isRetryableServerError(r.status, r.text)) break;
    if (attempt < HTTP_RETRY) await sleep(HTTP_RETRY_DELAY_MS * attempt);
  }
  if (r.netError) return { error: r.netError + "（已重试 " + HTTP_RETRY + " 次）" };
  const status = r.status;
  const text = r.text;
  let data = null;
  try {
    data = JSON.parse(text);
  } catch (e) {}

  // 带槽位写入且本机 IP 已占用别的槽位 → 服务端 403 冲突，需去 UI 删旧槽位
  if (status === 403) {
    return {
      error: "槽位冲突：本机 IP 已在其它槽位，请先去控制台删除旧槽位",
      conflict: true,
      currentIp: data && data.currentIp,
    };
  }

  // 服务端返回非 2xx 状态码或业务报错
  if (status && (status < 200 || status >= 300)) {
    const errMsg = (data && (data.message || data.msg)) || String(text).slice(0, 80) || "无响应体";
    return {
      error: "服务端 " + status + ": " + errMsg,
      status: status,
      currentIp: data && data.currentIp,
    };
  }

  if (!data) {
    return { error: "响应解析失败: " + String(text).slice(0, 80) };
  }

  // 服务端按 C 段（/24）加白，whitelist 与 currentIp 都可能是 x.x.x.0/24
  // whitelist 元素为 {ip, slot} 对象：记下 ip→slot 再摊平成 IP 数组
  const raw = Array.isArray(data.whitelist) ? data.whitelist : [];
  data.slotOf = {};
  raw.forEach(function (e) {
    if (e && typeof e === "object" && e.slot !== null && e.slot !== undefined) {
      data.slotOf[e.ip] = e.slot;
    }
  });
  data.whitelist = raw.map(function (e) {
    return e && typeof e === "object" ? e.ip : e;
  });
  data.limit = data.limit || 5;
  data.applied =
    data.enabled === true &&
    data.whitelist.some(function (ip) {
      return sameC24(ip, data.currentIp);
    });
  return data;
}

// 任一侧为 /24 段时按前三段比较，两侧均为精确 IP 时要求全等
function sameC24(a, b) {
  if (!a || !b) return false;
  a = String(a).trim();
  b = String(b).trim();
  if (a === b) return true;
  if (a.slice(-3) !== "/24" && b.slice(-3) !== "/24") return false;
  const pa = a.replace("/24", "").split(".");
  const pb = b.replace("/24", "").split(".");
  return (
    pa.length === 4 && pb.length === 4 && pa[0] === pb[0] && pa[1] === pb[1] && pa[2] === pb[2]
  );
}

async function ensure(ctx, item, index, cellular) {
  const kvState = STORE_PREFIX + index;
  const kvHist = STORE_PREFIX + "hist_" + index;
  const st = await apiCall(ctx, item.token, item.slot);
  if (st.applied) {
    const hist = readHistory(ctx, kvHist);
    const last = hist.length ? hist[hist.length - 1] : null;
    if (!last || last.ip !== st.currentIp) {
      hist.push({ ip: st.currentIp, src: cellular ? "cell" : "fixed", ts: Date.now() });
      try {
        ctx.storage.setJSON(kvHist, hist.slice(-10));
      } catch (e) {}
    }
  }
  return { kvState: kvState, kvHist: kvHist, slot: item.slot, st: st };
}

// 每 token 一行：不含 token，只含白名单/坑位信息；钉住的槽位标 📌，蜂窝加的 IP 标 📶
function describe(ctx, index, c) {
  const st = c.st;
  const pin = c.slot !== null && c.slot !== undefined && c.slot !== "" ? " 📌" + c.slot : "";
  const head = "#" + (index + 1) + pin + " ";
  if (st.error) return head + "❌ " + st.error;
  if (st.enabled === false) return head + "⚠️ 防火墙未启用";
  if (!st.applied) return head + "❌ 加白未生效 " + ((st.whitelist && st.whitelist.length) || 0) + "/" + (st.limit || 5);

  const hist = readHistory(ctx, c.kvHist);
  const cellIps = {};
  hist.forEach(function (e) {
    if (e.src === "cell") cellIps[e.ip] = true;
  });
  const slotOf = st.slotOf || {};
  const ips = st.whitelist
    .map(function (ip) {
      const slotTag = slotOf[ip] !== undefined ? " 📌" + slotOf[ip] : "";
      return ip + slotTag + (cellIps[ip] ? " 📶" : "") + (sameC24(ip, st.currentIp) ? " ←" : "");
    })
    .join("\n    ");
  return head + "✅ " + st.whitelist.length + "/" + (st.limit || 5) + "\n    " + ips;
}

function pad2(n) {
  return n < 10 ? "0" + n : "" + n;
}

function formatTime(d) {
  const date = d ? new Date(d) : new Date();
  return pad2(date.getHours()) + ":" + pad2(date.getMinutes());
}

function getTokens(ctx) {
  let raw = "";
  if (ctx && ctx.env && ctx.env.tokens) {
    raw = ctx.env.tokens;
  }
  if (raw === "{{{tokens}}}") {
    raw = "";
  }
  return parseTokens(raw);
}

function saveWidgetCache(ctx, data) {
  try {
    if (ctx && ctx.storage) {
      ctx.storage.setJSON(WIDGET_CACHE_KEY, data);
    }
  } catch (e) {}
}

function readWidgetCache(ctx) {
  try {
    if (ctx && ctx.storage) {
      return ctx.storage.getJSON(WIDGET_CACHE_KEY);
    }
  } catch (e) {
    return null;
  }
}

/* ==================== 小组件构建器 (Widget DSL) ==================== */

function renderUnconfiguredWidget(family) {
  return {
    type: "widget",
    padding: 14,
    backgroundColor: { light: "#F2F2F7", dark: "#1C1C1E" },
    children: [
      {
        type: "stack",
        direction: "column",
        alignItems: "start",
        gap: 6,
        children: [
          {
            type: "stack",
            direction: "row",
            alignItems: "center",
            gap: 6,
            children: [
              {
                type: "image",
                src: "sf-symbol:exclamationmark.triangle.fill",
                color: "#FF9500",
                width: 18,
                height: 18,
              },
              {
                type: "text",
                text: "po0 防火墙",
                font: { size: "headline", weight: "bold" },
                textColor: { light: "#1C1C1E", dark: "#FFFFFF" },
              },
            ],
          },
          { type: "spacer" },
          {
            type: "text",
            text: "未配置 Token",
            font: { size: "subheadline", weight: "semibold" },
            textColor: { light: "#1C1C1E", dark: "#FFFFFF" },
          },
          {
            type: "text",
            text: "请在 Egern 模块设置中填入 po0 防火墙 token",
            font: { size: "caption2" },
            textColor: "#8E8E93",
          },
        ],
      },
    ],
  };
}

function renderErrorWidget(family, msg) {
  return {
    type: "widget",
    padding: 14,
    backgroundColor: { light: "#F2F2F7", dark: "#1C1C1E" },
    children: [
      {
        type: "stack",
        direction: "column",
        alignItems: "start",
        gap: 6,
        children: [
          {
            type: "stack",
            direction: "row",
            alignItems: "center",
            gap: 6,
            children: [
              {
                type: "image",
                src: "sf-symbol:xmark.octagon.fill",
                color: "#FF3B30",
                width: 18,
                height: 18,
              },
              {
                type: "text",
                text: "po0 加白异常",
                font: { size: "headline", weight: "bold" },
                textColor: { light: "#1C1C1E", dark: "#FFFFFF" },
              },
            ],
          },
          { type: "spacer" },
          {
            type: "text",
            text: String(msg || "请求失败").slice(0, 60),
            font: { size: "caption1" },
            textColor: "#FF3B30",
          },
        ],
      },
    ],
  };
}

function buildSmallWidget(state) {
  const allOk = state.allOk;
  const firstMachine = state.results && state.results[0] && state.results[0].st;
  const limit = (firstMachine && firstMachine.limit) || 5;
  const wlCount = (firstMachine && firstMachine.whitelist && firstMachine.whitelist.length) || 0;

  return {
    type: "widget",
    padding: 14,
    backgroundColor: { light: "#F2F2F7", dark: "#1C1C1E" },
    url: "https://console.po0.io",
    children: [
      {
        type: "stack",
        direction: "column",
        alignItems: "start",
        gap: 8,
        children: [
          // 顶行：图标 + 标题 + 刷新与状态
          {
            type: "stack",
            direction: "row",
            alignItems: "center",
            gap: 6,
            children: [
              {
                type: "image",
                src: allOk ? "sf-symbol:checkmark.shield.fill" : "sf-symbol:exclamationmark.shield.fill",
                color: allOk ? "#34C759" : "#FF3B30",
                width: 18,
                height: 18,
              },
              {
                type: "text",
                text: "po0 加白",
                font: { size: "subheadline", weight: "bold" },
                textColor: { light: "#1C1C1E", dark: "#FFFFFF" },
              },
              { type: "spacer" },
              {
                type: "text",
                text: allOk ? "已加白" : "未生效",
                font: { size: "caption2", weight: "bold" },
                textColor: allOk ? "#34C759" : "#FF3B30",
              },
            ],
          },
          // 中间卡片：出口 IP 与状态
          {
            type: "stack",
            direction: "column",
            backgroundColor: { light: "#FFFFFF", dark: "#2C2C2E" },
            padding: [6, 8, 6, 8],
            borderRadius: 8,
            gap: 2,
            children: [
              {
                type: "stack",
                direction: "row",
                alignItems: "center",
                gap: 4,
                children: [
                  {
                    type: "image",
                    src: state.cellular ? "sf-symbol:antenna.radiowaves.left.and.right" : "sf-symbol:wifi",
                    color: "#8E8E93",
                    width: 11,
                    height: 11,
                  },
                  {
                    type: "text",
                    text: state.cellular ? "蜂窝网络" : "Wi-Fi 出口",
                    font: { size: "caption2" },
                    textColor: "#8E8E93",
                  },
                  { type: "spacer" },
                  {
                    type: "text",
                    text: state.okCount + "/" + state.totalCount + " 台",
                    font: { size: "caption2", weight: "semibold" },
                    textColor: allOk ? "#34C759" : "#FF9500",
                  },
                ],
              },
              {
                type: "text",
                text: state.exitIp || "--",
                font: { size: "footnote", weight: "bold", family: "Menlo" },
                textColor: { light: "#000000", dark: "#FFFFFF" },
              },
            ],
          },
          { type: "spacer" },
          // 底行：槽位数量与更新时间
          {
            type: "stack",
            direction: "row",
            alignItems: "center",
            children: [
              {
                type: "text",
                text: "槽位 " + wlCount + "/" + limit,
                font: { size: "caption1", weight: "medium" },
                textColor: { light: "#3C3C43", dark: "#EBEBF5" },
              },
              { type: "spacer" },
              {
                type: "text",
                text: "更新于 " + formatTime(state.ts),
                font: { size: "caption2" },
                textColor: "#8E8E93",
              },
            ],
          },
        ],
      },
    ],
  };
}

function buildMediumWidget(ctx, state) {
  const allOk = state.allOk;
  const firstMachine = state.results && state.results[0] && state.results[0].st;
  const limit = (firstMachine && firstMachine.limit) || 5;
  const rawWl = (firstMachine && firstMachine.whitelist) || [];
  const slotOf = (firstMachine && firstMachine.slotOf) || {};
  const displayItems = rawWl.slice(0, 4);

  const rightListChildren = [
    {
      type: "stack",
      direction: "row",
      alignItems: "center",
      children: [
        {
          type: "text",
          text: "白名单列表",
          font: { size: "caption2", weight: "bold" },
          textColor: "#8E8E93",
        },
        { type: "spacer" },
        {
          type: "text",
          text: rawWl.length + "/" + limit + " 坑位",
          font: { size: "caption2" },
          textColor: "#8E8E93",
        },
      ],
    },
  ];

  if (displayItems.length === 0) {
    rightListChildren.push({
      type: "text",
      text: firstMachine && firstMachine.error ? firstMachine.error : "暂无白名单记录",
      font: { size: "caption2" },
      textColor: firstMachine && firstMachine.error ? "#FF3B30" : "#8E8E93",
    });
  } else {
    displayItems.forEach(function (ip) {
      const isPinned = slotOf[ip] !== undefined;
      const isCurrent = sameC24(ip, state.exitIp);
      rightListChildren.push({
        type: "stack",
        direction: "row",
        alignItems: "center",
        gap: 4,
        children: [
          {
            type: "text",
            text: isPinned ? "📌" + slotOf[ip] : "•",
            font: { size: "caption2", weight: "bold" },
            textColor: isPinned ? "#FF9500" : "#8E8E93",
          },
          {
            type: "text",
            text: ip,
            font: { size: "caption2", family: "Menlo" },
            textColor: { light: "#1C1C1E", dark: "#FFFFFF" },
          },
          { type: "spacer" },
          {
            type: "text",
            text: isCurrent ? "本机" : "",
            font: { size: "caption2", weight: "bold" },
            textColor: "#34C759",
          },
        ],
      });
    });
  }

  return {
    type: "widget",
    padding: 12,
    backgroundColor: { light: "#F2F2F7", dark: "#1C1C1E" },
    url: "https://console.po0.io",
    children: [
      {
        type: "stack",
        direction: "row",
        alignItems: "center",
        gap: 12,
        children: [
          // 左侧：概览与当前 IP 信息 (固定宽度 125)
          {
            type: "stack",
            direction: "column",
            alignItems: "start",
            width: 125,
            gap: 4,
            children: [
              {
                type: "stack",
                direction: "row",
                alignItems: "center",
                gap: 5,
                children: [
                  {
                    type: "image",
                    src: allOk ? "sf-symbol:checkmark.shield.fill" : "sf-symbol:exclamationmark.shield.fill",
                    color: allOk ? "#34C759" : "#FF3B30",
                    width: 16,
                    height: 16,
                  },
                  {
                    type: "text",
                    text: "po0 防火墙",
                    font: { size: "subheadline", weight: "bold" },
                    textColor: { light: "#1C1C1E", dark: "#FFFFFF" },
                  },
                ],
              },
              { type: "spacer" },
              {
                type: "text",
                text: allOk ? "✅ 已加白" : "❌ 未生效",
                font: { size: "caption1", weight: "semibold" },
                textColor: allOk ? "#34C759" : "#FF3B30",
              },
              {
                type: "text",
                text: state.exitIp || "--",
                font: { size: "footnote", weight: "bold", family: "Menlo" },
                textColor: { light: "#000000", dark: "#FFFFFF" },
              },
              {
                type: "stack",
                direction: "row",
                alignItems: "center",
                gap: 4,
                children: [
                  {
                    type: "image",
                    src: state.cellular ? "sf-symbol:antenna.radiowaves.left.and.right" : "sf-symbol:wifi",
                    color: "#8E8E93",
                    width: 11,
                    height: 11,
                  },
                  {
                    type: "text",
                    text: state.cellular ? "蜂窝出口" : "局域网出口",
                    font: { size: "caption2" },
                    textColor: "#8E8E93",
                  },
                ],
              },
              { type: "spacer" },
              {
                type: "stack",
                direction: "row",
                alignItems: "center",
                children: [
                  {
                    type: "text",
                    text: state.okCount + "/" + state.totalCount + " 台",
                    font: { size: "caption2" },
                    textColor: "#8E8E93",
                  },
                  { type: "spacer" },
                  {
                    type: "text",
                    text: formatTime(state.ts),
                    font: { size: "caption2" },
                    textColor: "#8E8E93",
                  },
                ],
              },
            ],
          },
          // 右侧：白名单列表卡片 (包含右上角刷新按钮)
          {
            type: "stack",
            direction: "column",
            flex: 1,
            backgroundColor: { light: "#FFFFFF", dark: "#2C2C2E" },
            padding: [8, 10, 8, 10],
            borderRadius: 10,
            gap: 4,
            children: rightListChildren,
          },
        ],
      },
    ],
  };
}

function buildLargeWidget(ctx, state) {
  const allOk = state.allOk;
  const machineCards = [];

  state.results.forEach(function (r, idx) {
    const st = r.st;
    const pin = r.slot !== null && r.slot !== undefined ? " 📌" + r.slot : "";
    const titleText = "机器 #" + (idx + 1) + pin;
    const statusText = st.error
      ? "❌ " + st.error
      : st.applied
      ? "✅ 已加白 (" + (st.whitelist ? st.whitelist.length : 0) + "/" + (st.limit || 5) + ")"
      : "❌ 未生效";

    const rows = [
      {
        type: "stack",
        direction: "row",
        alignItems: "center",
        children: [
          {
            type: "text",
            text: titleText,
            font: { size: "caption1", weight: "bold" },
            textColor: { light: "#1C1C1E", dark: "#FFFFFF" },
          },
          { type: "spacer" },
          {
            type: "text",
            text: statusText,
            font: { size: "caption2", weight: "semibold" },
            textColor: st.applied ? "#34C759" : "#FF3B30",
          },
        ],
      },
    ];

    if (st.whitelist && st.whitelist.length > 0) {
      st.whitelist.forEach(function (ip) {
        const isPinned = st.slotOf && st.slotOf[ip] !== undefined;
        const isCurrent = sameC24(ip, state.exitIp);
        rows.push({
          type: "stack",
          direction: "row",
          alignItems: "center",
          gap: 4,
          children: [
            {
              type: "text",
              text: isPinned ? "📌" + st.slotOf[ip] : "•",
              font: { size: "caption2", weight: "bold" },
              textColor: isPinned ? "#FF9500" : "#8E8E93",
            },
            {
              type: "text",
              text: ip,
              font: { size: "caption2", family: "Menlo" },
              textColor: { light: "#1C1C1E", dark: "#FFFFFF" },
            },
            { type: "spacer" },
            {
              type: "text",
              text: isCurrent ? "本机出口" : "",
              font: { size: "caption2", weight: "semibold" },
              textColor: "#34C759",
            },
          ],
        });
      });
    }

    machineCards.push({
      type: "stack",
      direction: "column",
      backgroundColor: { light: "#FFFFFF", dark: "#2C2C2E" },
      padding: [8, 10, 8, 10],
      borderRadius: 10,
      gap: 3,
      children: rows,
    });
  });

  return {
    type: "widget",
    padding: 14,
    backgroundColor: { light: "#F2F2F7", dark: "#1C1C1E" },
    url: "https://console.po0.io",
    children: [
      {
        type: "stack",
        direction: "column",
        gap: 8,
        children: [
          // 顶部横条
          {
            type: "stack",
            direction: "row",
            alignItems: "center",
            children: [
              {
                type: "image",
                src: allOk ? "sf-symbol:checkmark.shield.fill" : "sf-symbol:exclamationmark.shield.fill",
                color: allOk ? "#34C759" : "#FF3B30",
                width: 20,
                height: 20,
              },
              {
                type: "text",
                text: " po0 防火墙白名单看板",
                font: { size: "headline", weight: "bold" },
                textColor: { light: "#1C1C1E", dark: "#FFFFFF" },
              },
              { type: "spacer" },
              {
                type: "text",
                text: "更新于 " + formatTime(state.ts),
                font: { size: "caption2" },
                textColor: "#8E8E93",
              },
            ],
          },
          // 出口 IP 信息
          {
            type: "stack",
            direction: "row",
            alignItems: "center",
            gap: 6,
            children: [
              {
                type: "image",
                src: state.cellular ? "sf-symbol:antenna.radiowaves.left.and.right" : "sf-symbol:wifi",
                color: "#8E8E93",
                width: 12,
                height: 12,
              },
              {
                type: "text",
                text: "当前本机出口: " + (state.exitIp || "--"),
                font: { size: "caption1", weight: "semibold", family: "Menlo" },
                textColor: { light: "#1C1C1E", dark: "#FFFFFF" },
              },
              { type: "spacer" },
              {
                type: "text",
                text: state.okCount + "/" + state.totalCount + " 台正常",
                font: { size: "caption2", weight: "bold" },
                textColor: allOk ? "#34C759" : "#FF3B30",
              },
            ],
          },
          // 机器卡片列表
          {
            type: "stack",
            direction: "column",
            gap: 6,
            children: machineCards,
          },
        ],
      },
    ],
  };
}

async function renderWidget(ctx) {
  const family = (ctx && ctx.widgetFamily) || "systemMedium";
  const tokens = getTokens(ctx);

  if (tokens.length === 0) {
    return renderUnconfiguredWidget(family);
  }

  const cellular = onCellular(ctx);
  const cache = readWidgetCache(ctx);
  const now = Date.now();
  // 15 秒防抖（避免几秒内重复并发请求），15 秒后触发即可实时加白与查询
  const isTooFrequent = cache && now - (cache.ts || 0) < 15 * 1000;

  let state = null;
  if (isTooFrequent) {
    state = cache;
  } else {
    try {
      const results = [];
      for (let i = 0; i < tokens.length; i++) {
        results.push(await ensure(ctx, tokens[i], i, cellular));
      }
      let okCount = 0;
      let exitIp = "?";
      for (let i = 0; i < results.length; i++) {
        if (results[i].st.applied) okCount++;
        if (results[i].st.currentIp) exitIp = results[i].st.currentIp;
      }
      state = {
        ts: now,
        okCount: okCount,
        totalCount: results.length,
        exitIp: exitIp,
        cellular: cellular,
        allOk: okCount === results.length,
        results: results.map(function (r, idx) {
          return {
            index: idx,
            slot: r.slot,
            st: r.st,
            kvHist: r.kvHist,
          };
        }),
      };
      saveWidgetCache(ctx, state);
    } catch (e) {
      if (cache) {
        state = cache;
      } else {
        return renderErrorWidget(family, String((e && e.message) || e));
      }
    }
  }

  let res;
  if (family === "systemSmall") {
    res = buildSmallWidget(state);
  } else if (family === "systemLarge") {
    res = buildLargeWidget(ctx, state);
  } else {
    res = buildMediumWidget(ctx, state);
  }

  // 告知 iOS 系统与 Egern：在 10 分钟后自动执行下一次小组件时间线刷新
  res.refreshAfter = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  return res;
}

/* ==================== 后台自动加白运行逻辑 ==================== */

async function runBackground(ctx) {
  const tokens = getTokens(ctx);
  if (tokens.length === 0) {
    if (ctx && typeof ctx.notify === "function") {
      ctx.notify({
        title: "po0 防火墙加白",
        subtitle: "未配置 token",
        body: "请在 Egern 模块设置的环境变量 (Env) 中填入 pgnfw_ 开头的 token",
      });
    }
    return;
  }

  const cellular = onCellular(ctx);
  const results = [];
  for (let i = 0; i < tokens.length; i++) {
    results.push(await ensure(ctx, tokens[i], i, cellular));
  }

  let okCount = 0;
  let exitIp = "?";
  let changed = false;
  const lines = [];
  for (let i = 0; i < results.length; i++) {
    const st = results[i].st;
    if (st.applied) okCount++;
    if (st.currentIp) exitIp = st.currentIp;
    lines.push(describe(ctx, i, results[i]));

    const state = (st.currentIp || "?") + "|" + (st.applied ? "1" : "0");
    if (ctx && ctx.storage) {
      if (ctx.storage.get(results[i].kvState) !== state) {
        ctx.storage.set(results[i].kvState, state);
        changed = true;
      }
    }
  }

  const allOk = okCount === results.length;
  const title =
    "po0 加白 " + okCount + "/" + results.length + " · 出口 " + exitIp + (cellular ? " 📶" : "");

  // 写入小组件缓存，让小组件即刻呈现最新状态
  saveWidgetCache(ctx, {
    ts: Date.now(),
    okCount: okCount,
    totalCount: results.length,
    exitIp: exitIp,
    cellular: cellular,
    allOk: allOk,
    results: results.map(function (r, idx) {
      return {
        index: idx,
        slot: r.slot,
        st: r.st,
        kvHist: r.kvHist,
      };
    }),
  });

  // 关键修复：状态变化，或者存在未生效/报错时发送通知；全成功例行巡检保持安静
  if (changed || !allOk) {
    if (ctx && typeof ctx.notify === "function") {
      ctx.notify({ title: "po0 防火墙加白", subtitle: title, body: lines.join("\n") });
    }
  }
}

/* ==================== 脚本统一入口 ==================== */

export default async function (ctx) {
  try {
    if (ctx && ctx.widgetFamily) {
      return await renderWidget(ctx);
    }
    await runBackground(ctx);
    return await renderWidget(ctx);
  } catch (err) {
    const family = (ctx && ctx.widgetFamily) || "systemMedium";
    return renderErrorWidget(family, String((err && err.message) || err));
  }
}
