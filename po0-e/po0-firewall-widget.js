/*
 * po0 防火墙白名单看板 · Egern 独立原生小组件脚本
 *
 * 专用于 Egern 的 Generic 脚本和小组件（Widget DSL）。
 * 保证 100% 返回带有 type: "widget" 的合法布局对象，彻底避免 Missing required key 'type' 报错。
 * 支持 systemSmall / systemMedium / systemLarge 尺寸，右侧带【刷新】按钮，支持手动实时加白。
 */

const API_BASE = "https://124.221.69.228/api/firewall/";
const STORE_PREFIX = "po0_fw_";
const WIDGET_CACHE_KEY = "po0_fw_widget_cache";
const HIST_WINDOW_MS = 24 * 3600 * 1000;
const HTTP_RETRY = 2;
const HTTP_RETRY_DELAY_MS = 1000;

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

function onCellular(ctx) {
  try {
    const d = (ctx && ctx.device) || {};
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
    h = (ctx && ctx.storage && ctx.storage.getJSON(key)) || [];
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

function isRetryableServerError(status, text) {
  if (!status) return false;
  if (status >= 500) return true;
  if (status >= 200 && status < 300) return false;
  if (status === 403) return false;
  try {
    JSON.parse(text);
    return false;
  } catch (e) {
    return true;
  }
}

async function httpPostOnce(ctx, url) {
  let text = "";
  let status = 0;
  try {
    const resp = await ctx.http.post(url, {
      headers: { "Content-Type": "application/json" },
      body: "",
      timeout: 10000,
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
      return { netError: msg || "网络请求失败" };
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
  if (r.netError) return { error: r.netError };
  const status = r.status;
  const text = r.text;
  let data = null;
  try {
    data = JSON.parse(text);
  } catch (e) {}

  if (status === 403) {
    return {
      error: "槽位冲突：本机 IP 已在其它槽位，请先去控制台删除旧槽位",
      conflict: true,
      currentIp: data && data.currentIp,
    };
  }

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
        if (ctx && ctx.storage) {
          ctx.storage.setJSON(kvHist, hist.slice(-10));
        }
      } catch (e) {}
    }
  }
  return { kvState: kvState, kvHist: kvHist, slot: item.slot, st: st };
}

function pad2(n) {
  return n < 10 ? "0" + n : "" + n;
}

function formatTime(d) {
  const date = d ? new Date(d) : new Date();
  return pad2(date.getHours()) + ":" + pad2(date.getMinutes());
}

function readWidgetCache(ctx) {
  try {
    if (ctx && ctx.storage) {
      return ctx.storage.getJSON(WIDGET_CACHE_KEY);
    }
  } catch (e) {}
  return null;
}

function saveWidgetCache(ctx, data) {
  try {
    if (ctx && ctx.storage) {
      ctx.storage.setJSON(WIDGET_CACHE_KEY, data);
    }
  } catch (e) {}
}

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
            text: "请在模块的环境变量 (Env) 中填入 tokens",
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
            text: String(msg || "数据加载失败").slice(0, 60),
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
          // 底行：槽位数量与刷新时间按钮
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
              // 刷新按钮 (点击唤醒 Egern 执行实时刷新)
              {
                type: "stack",
                direction: "row",
                alignItems: "center",
                gap: 3,
                padding: [2, 6, 2, 6],
                backgroundColor: { light: "#E5E5EA", dark: "#3A3A3C" },
                borderRadius: 6,
                url: "egern://",
                children: [
                  {
                    type: "image",
                    src: "sf-symbol:arrow.clockwise",
                    color: { light: "#007AFF", dark: "#0A84FF" },
                    width: 9,
                    height: 9,
                  },
                  {
                    type: "text",
                    text: formatTime(state.ts),
                    font: { size: "caption2", weight: "medium" },
                    textColor: { light: "#007AFF", dark: "#0A84FF" },
                  },
                ],
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
        { type: "spacer", length: 6 },
        // 白名单列表右侧的【刷新】按钮 (参考 Surge 模块风格)
        {
          type: "stack",
          direction: "row",
          alignItems: "center",
          gap: 3,
          padding: [2, 6, 2, 6],
          backgroundColor: { light: "#E5E5EA", dark: "#3A3A3C" },
          borderRadius: 6,
          url: "egern://",
          children: [
            {
              type: "image",
              src: "sf-symbol:arrow.clockwise",
              color: { light: "#007AFF", dark: "#0A84FF" },
              width: 10,
              height: 10,
            },
            {
              type: "text",
              text: "刷新",
              font: { size: "caption2", weight: "semibold" },
              textColor: { light: "#007AFF", dark: "#0A84FF" },
            },
          ],
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
                text: allOk ? "✅ 全部已加白" : "❌ 加白异常",
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
          // 顶部横条：标题与刷新按钮
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
              // 刷新按钮 (唤醒 Egern 刷新)
              {
                type: "stack",
                direction: "row",
                alignItems: "center",
                gap: 4,
                padding: [3, 8, 3, 8],
                backgroundColor: { light: "#E5E5EA", dark: "#3A3A3C" },
                borderRadius: 8,
                url: "egern://",
                children: [
                  {
                    type: "image",
                    src: "sf-symbol:arrow.clockwise",
                    color: { light: "#007AFF", dark: "#0A84FF" },
                    width: 11,
                    height: 11,
                  },
                  {
                    type: "text",
                    text: "刷新",
                    font: { size: "caption2", weight: "semibold" },
                    textColor: { light: "#007AFF", dark: "#0A84FF" },
                  },
                ],
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

  if (family === "systemSmall") {
    return buildSmallWidget(state);
  } else if (family === "systemLarge") {
    return buildLargeWidget(ctx, state);
  } else {
    return buildMediumWidget(ctx, state);
  }
}

export default async function (ctx) {
  try {
    return await renderWidget(ctx);
  } catch (err) {
    const family = (ctx && ctx.widgetFamily) || "systemMedium";
    return renderErrorWidget(family, String((err && err.message) || err));
  }
}
