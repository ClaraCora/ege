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

/* po0 Widget UI · A 浅色原生（两个独立入口须保持此段一致） */
const FW_THEME = {
  background: { light: "#FFFFFF", dark: "#18232F" },
  panel: { light: "#F2F6FA", dark: "#223242" },
  text: { light: "#1E2B3C", dark: "#F0F5FA" },
  muted: { light: "#627082", dark: "#ACBCCC" },
  ip: { light: "#234765", dark: "#C0DCF2" },
  line: { light: "#E1E8ED", dark: "#3A4D60" },
  success: { light: "#24744E", dark: "#8CD9B1" },
  successTint: { light: "#E8F4EE", dark: "#254338" },
  warning: { light: "#A85224", dark: "#FFC38E" },
  warningTint: { light: "#FFF0E5", dark: "#4B372B" },
  danger: { light: "#B23C3C", dark: "#FFA9A4" },
  dangerTint: { light: "#FCEDEC", dark: "#4B3034" },
};

function fwText(text, size, color, weight, options) {
  return Object.assign({
    type: "text",
    text: String(text === null || text === undefined ? "" : text),
    font: { size: size || 11, weight: weight || "regular" },
    textColor: color || FW_THEME.text,
    maxLines: 1,
    minScale: 0.85,
  }, options || {});
}

function fwIp(ip, size, color, weight) {
  return fwText(ip || "等待获取 IP", size, color || FW_THEME.ip, weight || "semibold", {
    font: { size: size, weight: weight || "semibold", family: "Menlo" },
    minScale: 0.58,
  });
}

function fwImage(symbol, size, color) {
  return { type: "image", src: "sf-symbol:" + symbol, width: size, height: size, color: color || FW_THEME.muted };
}

function fwRow(children, gap, options) {
  return Object.assign({ type: "stack", direction: "row", alignItems: "center", gap: gap || 0, children: children }, options || {});
}

function fwColumn(children, gap, options) {
  return Object.assign({ type: "stack", direction: "column", alignItems: "start", gap: gap || 0, children: children }, options || {});
}

function fwSpace(length) {
  return length === undefined ? { type: "spacer" } : { type: "spacer", length: length };
}

function fwRule() {
  return fwRow([fwSpace()], 0, { height: 1, backgroundColor: FW_THEME.line });
}

function fwWidget(children, padding, url) {
  const widget = {
    type: "widget",
    backgroundColor: FW_THEME.background,
    padding: padding,
    children: [fwColumn(children, 0, { flex: 1 })],
  };
  if (url) widget.url = url;
  return widget;
}

function fwMessage(message) {
  return String(message || "网络请求失败，请检查连接后重试")
    .replace(/pgnfw_[A-Za-z0-9_-]+/g, "[Token]")
    .slice(0, 100);
}

function fwStatus(state) {
  const results = state.results || [];
  if (state.allOk) return { label: "已加白", color: FW_THEME.success, tint: FW_THEME.successTint, symbol: "checkmark" };
  if (state.okCount > 0) return { label: "部分加白", color: FW_THEME.warning, tint: FW_THEME.warningTint, symbol: "exclamationmark" };
  if (results.length && results.every(function (r) { return r.st && r.st.error; })) {
    return { label: "更新失败", color: FW_THEME.warning, tint: FW_THEME.warningTint, symbol: "exclamationmark" };
  }
  if (results.length && results.every(function (r) { return r.st && r.st.enabled === false && !r.st.error; })) {
    return { label: "未启用", color: FW_THEME.warning, tint: FW_THEME.warningTint, symbol: "exclamationmark" };
  }
  return { label: "未生效", color: FW_THEME.danger, tint: FW_THEME.dangerTint, symbol: "xmark" };
}

function fwBadge(status) {
  return fwRow([fwImage(status.symbol, 9, status.color), fwText(status.label, 10, status.color, "semibold")], 4, {
    padding: [4, 7, 4, 7], backgroundColor: status.tint, borderRadius: 7,
  });
}

function fwHeader(state) {
  return fwRow([
    fwRow([fwImage(state.allOk ? "checkmark.shield" : "exclamationmark.shield", 16, fwStatus(state).color), fwText("po0 防火墙", 13, FW_THEME.text, "bold")], 6),
    fwSpace(),
    fwBadge(fwStatus(state)),
  ]);
}

function fwNetwork(state, size) {
  return fwRow([
    fwImage(state.cellular ? "antenna.radiowaves.left.and.right" : "wifi", size || 10, FW_THEME.muted),
    fwText(state.cellular ? "蜂窝网络" : "Wi-Fi / 有线", size || 10, FW_THEME.muted),
  ], 4);
}

function fwCount(state, size) {
  return fwText(state.okCount + " / " + state.totalCount + " 台已加白", size || 10, FW_THEME.muted);
}

function fwFirstMachine(state) {
  return (state.results && state.results[0] && state.results[0].st) || {};
}

function fwWhitelist(st) {
  return Array.isArray(st.whitelist) ? st.whitelist : [];
}

function fwLimit(st) {
  return Number(st.limit) > 0 ? Number(st.limit) : 5;
}

function fwExitIp(state) {
  return state.exitIp && state.exitIp !== "?" && state.exitIp !== "--" ? state.exitIp : "";
}

function fwSlotLabel(result) {
  return result && result.slot !== null && result.slot !== undefined && result.slot !== "" ? "固定槽位 " + result.slot : "自动槽位";
}

function fwEntry(ip, index, st, exitIp, compact) {
  const slot = (st.slotOf || {})[ip];
  const pinned = slot !== undefined && slot !== null;
  const current = sameC24(ip, st.currentIp || exitIp);
  const color = current ? FW_THEME.success : FW_THEME.text;
  const leading = pinned
    ? fwRow([fwImage("pin.fill", compact ? 7 : 8, FW_THEME.muted), fwText(slot, compact ? 8 : 9, FW_THEME.muted)], 1, { width: compact ? 14 : 20 })
    : fwRow([fwText(pad2(index + 1), compact ? 8.5 : 9.5, FW_THEME.muted)], 0, { width: compact ? 14 : 20 });
  const address = fwIp(ip, compact ? 10.5 : 12, color, current ? "semibold" : "regular");
  address.flex = 1;
  address.minScale = compact ? 0.85 : 0.7;
  const children = [leading, address];
  if (current) children.push(fwText("本机", compact ? 8.5 : 10, FW_THEME.success, "medium"));
  return fwRow(children, compact ? 4 : 5, { height: compact ? 15 : 17 });
}

function fwSlotMeter(count, limit) {
  // 槽位数量有上限，避免异常数据生成无限数量的布局节点。
  const segments = Math.min(10, Math.max(1, limit));
  const children = [];
  for (let i = 0; i < segments; i++) {
    children.push(fwRow([], 0, { flex: 1, height: 4, borderRadius: 2, backgroundColor: i < Math.ceil(count / limit * segments) ? FW_THEME.success : FW_THEME.line }));
  }
  return fwRow(children, 3, { width: 50 });
}

function fwEmptyList(st, compact) {
  let message = "暂无白名单记录";
  if (st.error) message = fwMessage(st.error);
  else if (st.enabled === false) message = "防火墙未启用，请到控制台开启";
  return fwText(message, compact ? 10 : 10.5, st.error ? FW_THEME.warning : FW_THEME.muted, "regular", { maxLines: compact ? 4 : 2, minScale: 0.9 });
}

function fwNoticeWidget(family, configured, message) {
  const small = family === "systemSmall";
  const large = family === "systemLarge" || family === "systemExtraLarge";
  const color = configured ? FW_THEME.warning : FW_THEME.muted;
  const title = configured ? "更新失败" : "等待配置";
  const description = configured ? fwMessage(message) : "在 Egern 模块设置中填写防火墙 Token";
  const heading = fwRow([fwImage(configured ? "exclamationmark.triangle" : "key", 16, color), fwText("po0 防火墙", 13, FW_THEME.text, "bold")], 6);
  const content = [
    heading,
    fwSpace(large ? 30 : 16),
    fwText(title, small ? 22 : 24, configured ? FW_THEME.warning : FW_THEME.text, "semibold"),
    fwSpace(7),
    fwText(description, small ? 10.5 : 12, FW_THEME.muted, "regular", { maxLines: small ? 2 : 3, minScale: 0.9 }),
    fwSpace(),
    fwRule(),
    fwSpace(8),
    fwText(configured ? "请检查连接后重试" : "模块设置 · tokens", 10, FW_THEME.muted),
  ];
  return fwWidget(content, small ? 12 : 16, configured ? "https://console.po0.io" : null);
}

function renderUnconfiguredWidget(family) {
  return fwNoticeWidget(family, false, "");
}

function renderErrorWidget(family, msg) {
  return fwNoticeWidget(family, true, msg);
}

function buildSmallWidget(state) {
  const st = fwFirstMachine(state);
  const status = fwStatus(state);
  const ip = fwExitIp(state);
  if (!ip && st.error) return renderErrorWidget("systemSmall", st.error);
  const note = st.error ? fwMessage(st.error) : state.allOk ? state.okCount + " / " + state.totalCount + " 台机器正常" : state.okCount + " / " + state.totalCount + " 台已加白";
  return fwWidget([
    fwRow([
      fwRow([fwImage(state.allOk ? "checkmark.shield" : "exclamationmark.shield", 16, status.color), fwText("po0", 13, FW_THEME.text, "bold")], 6),
      fwSpace(), fwText("防火墙", 9, FW_THEME.muted),
    ]),
    fwSpace(12),
    fwText(status.label, 23, status.color, "semibold"),
    fwSpace(5),
    fwIp(ip, 13, FW_THEME.text),
    fwSpace(5),
    fwText(note, 10, FW_THEME.muted, "regular", { maxLines: 1 }),
    fwSpace(),
    fwRule(),
    fwSpace(8),
    fwRow([fwText("槽位 " + fwWhitelist(st).length + " / " + fwLimit(st), 9.5, FW_THEME.muted), fwSpace(), fwText(formatTime(state.ts), 9.5, FW_THEME.muted)]),
  ], 12, "https://console.po0.io");
}

function buildMediumWidget(ctx, state) {
  const st = fwFirstMachine(state);
  const whitelist = fwWhitelist(st);
  const right = [
    fwRow([
      fwText(state.totalCount > 1 ? "白名单 #1" : "白名单", 9.5, FW_THEME.muted, "medium"),
      fwSpace(), fwText(whitelist.length + " / " + fwLimit(st), 9.5, FW_THEME.muted),
    ]),
    fwSpace(3),
  ];
  // 中号始终逐条展示最多 5 个真实 IP，不使用“+N”折叠。
  whitelist.slice(0, 5).forEach(function (ip, index) {
    right.push(fwEntry(ip, index, st, state.exitIp, true));
  });
  if (!whitelist.length) right.push(fwEmptyList(st, true));
  const summary = fwColumn([
    fwRow([fwImage(state.cellular ? "antenna.radiowaves.left.and.right" : "wifi", 10), fwText("当前出口 IP", 9.5, FW_THEME.muted)], 4),
    fwSpace(6),
    fwIp(fwExitIp(state), 18),
    fwSpace(11),
    fwCount(state, 10),
    fwSpace(7),
    fwNetwork(state, 9.5),
    fwSpace(7),
    fwText("更新于 " + formatTime(state.ts), 9.5, FW_THEME.muted),
  ], 0, { flex: 1 });
  return fwWidget([
    fwHeader(state),
    fwSpace(8),
    fwRow([
      summary,
      fwColumn(right, 0, { flex: 1.45, padding: [6, 8, 6, 8], borderRadius: 12, backgroundColor: FW_THEME.panel }),
    ], 12, { flex: 1, alignItems: "center" }),
  ], 12, "https://console.po0.io");
}

function fwMachineSection(result, index, state, maxEntries) {
  const st = result.st || {};
  const whitelist = fwWhitelist(st);
  const count = whitelist.length;
  const title = "机器 " + pad2(index + 1);
  const children = [fwRow([
    fwRow([fwImage("server.rack", 12), fwText(title, 11, FW_THEME.text, "semibold")], 5),
    fwSpace(),
    fwText(st.error ? "请求失败" : st.applied ? count + " / " + fwLimit(st) + " 槽位" : st.enabled === false ? "未启用" : "未生效", 9.5, st.applied && !st.error ? FW_THEME.muted : FW_THEME.warning),
    st.applied && !st.error ? fwSlotMeter(count, fwLimit(st)) : fwImage("exclamationmark.circle", 11, FW_THEME.warning),
  ], 6), fwSpace(5)];
  if (st.error || !count) children.push(fwEmptyList(st, false));
  else {
    whitelist.slice(0, maxEntries).forEach(function (ip, entryIndex) { children.push(fwEntry(ip, entryIndex, st, state.exitIp, false)); });
    if (count > maxEntries) children.push(fwText("另 " + (count - maxEntries) + " 条 · 点按查看全部", 9, FW_THEME.muted));
  }
  return fwColumn(children);
}

function buildLargeWidget(ctx, state) {
  const results = state.results || [];
  const visible = results.slice(0, 3);
  // 小屏大号也留足底部空间；能放下时展示全部条目。
  const entryCount = visible.reduce(function (sum, r) { return sum + fwWhitelist(r.st || {}).length; }, 0);
  const maxEntries = visible.length === 1 ? 5 : visible.length === 2 ? (entryCount <= 7 ? 5 : 3) : 1;
  const hero = fwColumn([
    fwRow([
      fwRow([fwImage(state.cellular ? "antenna.radiowaves.left.and.right" : "wifi", 11), fwText("当前出口 IP", 10, FW_THEME.muted)], 5),
      fwSpace(), fwCount(state, 10),
    ]),
    fwSpace(6), fwIp(fwExitIp(state), 22), fwSpace(7),
    fwRow([fwNetwork(state, 10), fwSpace(), fwText(fwSlotLabel(results[0]), 10, FW_THEME.muted)]),
  ], 0, { padding: [9, 12, 9, 12], borderRadius: 13, backgroundColor: FW_THEME.panel });
  const children = [fwHeader(state), fwSpace(10), hero, fwSpace(10)];
  visible.forEach(function (result, index) {
    if (index) children.push(fwSpace(4), fwRule(), fwSpace(4));
    children.push(fwMachineSection(result, index, state, maxEntries));
  });
  if (results.length > visible.length) {
    children.push(fwSpace(5), fwText("另 " + (results.length - visible.length) + " 台机器 · 点按查看全部", 9.5, FW_THEME.muted));
  }
  children.push(fwSpace(), fwSpace(8), fwRow([
    fwImage("clock", 10), fwText("更新于 " + formatTime(state.ts), 10, FW_THEME.muted), fwSpace(), fwText("po0", 10, FW_THEME.muted),
  ], 5));
  return fwWidget(children, 14, "https://console.po0.io");
}
/* po0 Widget UI END */

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
