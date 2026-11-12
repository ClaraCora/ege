/*
 * po0 防火墙自动加白
 * 兼容：Surge / Stash / Shadowrocket / Loon / Quantumult X
 * （Egern 运行模型不同，用独立的 egern/po0-firewall-whitelist.js）
 *
 * 本地维护副本：ClaraCora/ege/surge（2026-11-12）
 * 原作者：reallinzc；来源：https://github.com/w0ven/po0fw
 * Surge Panel：原生 SF Symbols、状态摘要、完整白名单与更新时间。
 *
 * POST /api/firewall/<token>/add  把"当前请求源 IP"加入白名单，并回显
 *   {enabled, whitelist:[{ip,slot}], limit, currentIp}。token 走 URL 路径，无需
 *   Authorization 头。服务端对已在白名单的 IP 做幂等处理（重复请求不
 *   重复占坑、不推进淘汰队列），因此这里每次直接无脑请求。
 * 加白粒度为 C 段（/24）：服务端把 whitelist 条目和 currentIp 都归一化成
 *   x.x.x.0/24 回显；同段内换 IP 不产生新写入。脚本用 sameC24() 做匹配，
 *   兼容精确 IP 与 /24 段混杂的新旧格式。
 * 白名单写满后按写入时间先进先出自动淘汰最旧 IP；API 无删除接口。
 *
 * 策略：
 * - 每次直接 POST 上报当前出口 IP，蜂窝与 WiFi/有线同等处理。
 * - 默认 slotless 写入：按 updated_at 触发 LRU 淘汰，被挤出的设备靠自己的
 *   cron/事件几分钟内自动补回。
 * - 可选固定槽位：token 后加 @N（如 pgnfw_xxx@0）→ POST .../add?slot=N，
 *   把本机 IP 钉在槽位 N，**永不被 LRU 淘汰**。槽位写入语义：
 *     · 本机 IP 已在该槽位 → 刷新 updated_at；
 *     · 槽位有旧 IP → 行级顶替，旧 IP 丢弃；
 *     · 本机 IP 已 slotless → 删 slotless 行升级到该槽位；
 *     · 本机 IP 已占用**别的**槽位 → 403 冲突，需先去 UI 删旧槽位（脚本会报 ❌）。
 * - 蜂窝（主接口 pdp_ip*）写入的 IP 仅做 📶 标记，便于面板识别。
 *
 * token 来源（优先级从高到低）：
 * 1. argument: tokens=<pgnfw_xxx>[@槽位],<pgnfw_yyy>（Surge/Loon/Stash 模块参数）
 * 2. 持久化存储 key "po0fw_tokens"（Quantumult X 等不支持参数的客户端，
 *    可用 BoxJs 或一次性脚本写入）
 * 3. 下面的 INLINE_TOKENS 常量（自己维护脚本副本时直接填这里）
 */

var INLINE_TOKENS = "";

var API_BASE = "https://124.221.69.228/api/firewall/"; // + <token> + "/add"
var STORE_PREFIX = "po0_fw_";
var TOKENS_KEY = "po0fw_tokens";
var HIST_WINDOW_MS = 24 * 3600 * 1000; // 📶 标记的记账窗口

/* ---------- 环境兼容层 ---------- */

var isQX = typeof $task !== "undefined";
var isSurgeLike = typeof $httpClient !== "undefined"; // Surge/Stash/Shadowrocket/Loon

// 客户端细分：各家注入的标识不同，Loon 有全局 $loon，
// Surge 系则在 $environment 里带 surge-version / shadowrocket-version 等字段。
var envInfo = "";
try {
  if (typeof $environment !== "undefined" && $environment) {
    envInfo = JSON.stringify($environment).toLowerCase();
  }
} catch (e) {}

var isLoon = typeof $loon !== "undefined" || envInfo.indexOf("loon") >= 0;
var isSurgeFamily =
  envInfo.indexOf("surge-version") >= 0 ||
  envInfo.indexOf("shadowrocket") >= 0 ||
  envInfo.indexOf("stash") >= 0;

// ⚠️ timeout 单位在不同客户端不一致：
//   Surge / Shadowrocket / Stash → 秒
//   Loon / Quantumult X          → 毫秒
// 写死 15 会让 Loon 只等 15 毫秒 → 必然超时 → 回调 error=null → 通知里显示 "(null)"。
// 无法判定时干脆不传 timeout，交给模块声明的 timeout=60 兜底，避免再踩单位坑。
var REQUEST_TIMEOUT = null;
if (isLoon || isQX) REQUEST_TIMEOUT = 15000;
else if (isSurgeFamily) REQUEST_TIMEOUT = 15;

function storeRead(key) {
  if (isQX) return $prefs.valueForKey(key);
  if (typeof $persistentStore !== "undefined") return $persistentStore.read(key);
  return null;
}

function storeWrite(value, key) {
  if (isQX) return $prefs.setValueForKey(value, key);
  if (typeof $persistentStore !== "undefined") return $persistentStore.write(value, key);
  return false;
}

function notify(title, subtitle, body) {
  if (isQX) $notify(title, subtitle, body);
  else if (typeof $notification !== "undefined") $notification.post(title, subtitle, body);
}

// 各客户端失败时回传的 error 五花八门：Loon 在网络瞬断 / TLS 握手失败时
// 直接回调 error=null，裸 String(null) 只会得到毫无信息量的 "null"。
function describeHttpError(error) {
  var text;
  if (error === null || error === undefined) text = "";
  else if (typeof error === "object")
    text = String(error.message || error.error || error.description || "");
  else text = String(error);
  text = text.replace(/^\s+|\s+$/g, "");
  if (text === "" || text === "null" || text === "undefined" || text === "{}") {
    return "网络请求失败（超时 / 握手失败 / 被拦截）";
  }
  return text;
}

function httpRequestOnce(method, opts) {
  return new Promise(function (resolve) {
    if (isQX) {
      opts.method = method;
      $task.fetch(opts).then(
        function (resp) {
          resolve({ body: resp.body, status: resp.statusCode });
        },
        function (err) {
          resolve({ error: describeHttpError((err && err.error) || err) });
        }
      );
    } else if (isSurgeLike) {
      // 注意：不能把 $httpClient.post 解引用成局部变量再调用 —— Shadowrocket 的
      // $httpClient 是 ObjC 桥接对象，脱离对象调用会抛
      // "self type check failed for Objective-C instance method"。必须直调。
      var cb = function (error, response, body) {
        if (error) resolve({ error: describeHttpError(error) });
        else resolve({ body: body, status: response && (response.status || response.statusCode) });
      };
      if (method === "POST") $httpClient.post(opts, cb);
      else $httpClient.get(opts, cb);
    } else {
      resolve({ error: "unsupported client" });
    }
  });
}

function delay(ms) {
  return new Promise(function (resolve) {
    if (typeof setTimeout === "function") setTimeout(resolve, ms);
    else resolve();
  });
}

// 移动网络下单次请求失败很常见（cron 触发时链路刚唤醒 / 切网瞬间）。
// 服务端对重复 IP 幂等，重试 POST /add 不会重复占坑或推进淘汰队列，因此可安全重试。
var HTTP_RETRY = 3;
var HTTP_RETRY_DELAY_MS = 1500;

// 服务端瞬时异常也值得重试：po0 API 偶发返回裸 400（body 仅 "Error"）/ 5xx，
// 几秒后同一 token 即成功。规范 JSON 错误（如 token 无效 {"code":400,...}）不重试。
function isRetryableServerError(r) {
  if (!r || !r.status) return false;
  if (r.status >= 500) return true;
  if (r.status >= 200 && r.status < 300) return false;
  if (r.status === 403) return false; // 槽位冲突，重试无意义
  try {
    JSON.parse(r.body);
    return false; // 规范 JSON 错误 = 确定性失败，不重试
  } catch (e) {
    return true; // 非 JSON body（如裸 "Error"）= 服务端瞬时异常
  }
}

function httpRequest(method, opts, attempt) {
  attempt = attempt || 1;
  return httpRequestOnce(method, opts).then(function (r) {
    if (!r.error && !isRetryableServerError(r)) return r;
    if (attempt >= HTTP_RETRY) {
      if (r.error) r.error = r.error + "（已重试 " + HTTP_RETRY + " 次）";
      return r;
    }
    return delay(HTTP_RETRY_DELAY_MS * attempt).then(function () {
      return httpRequest(method, opts, attempt + 1);
    });
  });
}

function getArgumentTokens() {
  if (typeof $argument === "undefined" || $argument === null) return "";
  // Loon 插件 argument=[{tokens}] 会注入对象形态
  if (typeof $argument === "object") return String($argument.tokens || "");
  if (typeof $argument === "string" && $argument.length > 0) {
    // Shadowrocket 等客户端可能把配置里的外层引号原样传入，先剥掉
    if (/^["'].*["']$/.test($argument)) $argument = $argument.slice(1, -1);
    // Loon 也可能注入 JSON 字符串
    if ($argument.charAt(0) === "{") {
      try {
        return String(JSON.parse($argument).tokens || "");
      } catch (e) {}
    }
    // Surge/Stash 风格 tokens=xxx&...
    var pairs = $argument.split("&");
    for (var i = 0; i < pairs.length; i++) {
      var idx = pairs[i].indexOf("=");
      if (idx > 0 && pairs[i].slice(0, idx) === "tokens") {
        return decodeURIComponent(pairs[i].slice(idx + 1));
      }
    }
    // 直接把整串当 token 填的兜底（如 Loon argument="pgnfw_..."）
    if ($argument.indexOf("pgnfw_") === 0) return $argument;
  }
  return "";
}

function onCellular() {
  try {
    var iface =
      ($network.v4 && $network.v4.primaryInterface) ||
      ($network.v6 && $network.v6.primaryInterface) ||
      "";
    return iface.indexOf("pdp_ip") === 0;
  } catch (e) {
    return false; // 客户端不支持 $network 时按非蜂窝处理
  }
}

// Surge Panel 只接受原生文本与 SF Symbols，不使用 HTML/CSS 或外部图片。
var PANEL_THEME = {
  success: { label: "已加白", icon: "checkmark.shield.fill", color: "#3B82B8" },
  partial: { label: "部分加白", icon: "exclamationmark.shield.fill", color: "#C17934" },
  disabled: { label: "未启用", icon: "exclamationmark.shield.fill", color: "#C17934" },
  error: { label: "更新失败", icon: "exclamationmark.shield.fill", color: "#D35C5C" },
  inactive: { label: "未生效", icon: "exclamationmark.shield.fill", color: "#D35C5C" },
  setup: { label: "等待配置", icon: "gearshape.fill", color: "#3B82B8" },
};

function redactSecrets(value) {
  var text = String(value === null || value === undefined ? "" : value);
  // 先移除完整参数，再兜底屏蔽错误响应里可能出现的其他 token。
  if (typeof tokens !== "undefined" && Array.isArray(tokens)) {
    tokens.forEach(function (item) {
      if (item.token) text = text.split(item.token).join("[已隐藏]");
    });
  }
  return text.replace(/pgnfw_[A-Za-z0-9._~%+\-]*/gi, "[已隐藏]");
}

function panelText(value) {
  return redactSecrets(value).replace(/\s+/g, " ").trim();
}

function hasSlot(slot) {
  return slot !== null && slot !== undefined && slot !== "";
}

function panelClock() {
  var date = new Date();
  function two(value) { return value < 10 ? "0" + value : String(value); }
  return two(date.getHours()) + ":" + two(date.getMinutes()) + ":" + two(date.getSeconds());
}

function networkLabel() {
  if (onCellular()) return "蜂窝网络";
  try {
    if ($network.wifi && $network.wifi.ssid) return "Wi-Fi";
    var iface = ($network.v4 && $network.v4.primaryInterface) ||
      ($network.v6 && $network.v6.primaryInterface) || "";
    if (iface) return "当前网络";
  } catch (e) {}
  return "网络未知";
}

function panelStatus(results) {
  var applied = results.filter(function (ctx) { return ctx.st.applied === true; }).length;
  if (applied === results.length) return "success";
  if (applied > 0) return "partial";
  if (results.every(function (ctx) { return !!ctx.st.error; })) return "error";
  if (results.every(function (ctx) { return ctx.st.enabled === false && !ctx.st.error; })) return "disabled";
  return "inactive";
}

function machineLines(index, ctx, showOutlet) {
  var st = ctx.st;
  var status = st.error ? (st.conflict ? "槽位冲突" : "更新失败") :
    st.enabled === false ? "未启用" : st.applied ? "已加白" : "未生效";
  var whitelist = st.whitelist || [];
  var capacity = typeof st.limit === "number" && isFinite(st.limit) ? st.limit : "?";
  var header = "机器 " + (index + 1) + " · " + status;
  if (!st.error) header += " · " + whitelist.length + "/" + capacity + " 槽位";
  if (hasSlot(ctx.slot)) header += " · 固定 " + ctx.slot;
  var lines = [header];
  if (showOutlet && st.currentIp) lines.push("出口  " + panelText(st.currentIp));
  if (st.error) {
    lines.push(panelText(st.error));
    if (!st.conflict) lines.push("请检查网络或 Token 后刷新");
    return lines;
  }
  if (st.enabled === false) lines.push("请先在控制台启用防火墙");
  else if (!st.applied) lines.push("当前出口尚未出现在白名单中");
  if (!whitelist.length) {
    lines.push("暂无白名单记录");
    return lines;
  }
  var cellHistory = readHistory(ctx.kvHist).filter(function (entry) { return entry.src === "cell"; });
  var slotOf = st.slotOf || {};
  whitelist.forEach(function (ip) {
    var tags = [];
    if (sameC24(ip, st.currentIp)) tags.push("本机");
    if (hasSlot(slotOf[ip])) tags.push("固定 " + slotOf[ip]);
    if (cellHistory.some(function (entry) { return sameC24(entry.ip, ip); })) tags.push("蜂窝");
    lines.push(panelText(ip) + (tags.length ? " · " + tags.join(" · ") : ""));
  });
  return lines;
}

function buildPanel(results) {
  var status = panelStatus(results);
  var theme = PANEL_THEME[status];
  var okCount = results.filter(function (ctx) { return ctx.st.applied === true; }).length;
  var outlets = [];
  results.forEach(function (ctx) {
    var ip = ctx.st.currentIp;
    if (ip && outlets.indexOf(ip) === -1) outlets.push(ip);
  });
  var content = [outlets.length > 1 ? "出口  " + outlets.length + " 个（详见各机器）" :
    "出口  " + (outlets.length ? panelText(outlets[0]) : "暂未获取")];
  results.forEach(function (ctx, index) {
    content.push("");
    content = content.concat(machineLines(index, ctx, outlets.length > 1));
  });
  content.push("", networkLabel() + " · 更新 " + panelClock());
  return {
    title: "po0 防火墙 · " + theme.label + " " + okCount + "/" + results.length,
    content: content.join("\n"),
    icon: theme.icon,
    "icon-color": theme.color,
  };
}

function finish(title, content, status) {
  if (isQX) {
    $done();
    return;
  }
  var theme = PANEL_THEME[status] || PANEL_THEME.error;
  $done({
    title: redactSecrets(title),
    content: redactSecrets(content),
    icon: theme.icon,
    "icon-color": theme.color,
  });
}

/* ---------- 业务逻辑 ---------- */

// 服务端按 C 段（/24）加白，条目可能是精确 IP 或 x.x.x.0/24。
// 任一侧为 /24 段时按前三段比较，两侧均为精确 IP 时要求全等。
function sameC24(a, b) {
  if (!a || !b) return false;
  a = String(a);
  b = String(b);
  if (a === b) return true;
  if (a.slice(-3) !== "/24" && b.slice(-3) !== "/24") return false;
  var pa = a.replace("/24", "").split(".");
  var pb = b.replace("/24", "").split(".");
  return (
    pa.length === 4 && pb.length === 4 && pa[0] === pb[0] && pa[1] === pb[1] && pa[2] === pb[2]
  );
}

function readHistory(key) {
  try {
    var h = JSON.parse(storeRead(key) || "[]");
    var cutoff = Date.now() - HIST_WINDOW_MS;
    return h.filter(function (e) {
      return e.ts > cutoff;
    });
  } catch (e) {
    return [];
  }
}

function apiCall(token, slot) {
  // token 走 URL 路径，命中 /add 即把当前出口 IP 加白；带 slot 则钉固定槽位
  var url = API_BASE + encodeURIComponent(token) + "/add";
  if (slot !== null && slot !== undefined && slot !== "") {
    url += "?slot=" + encodeURIComponent(slot);
  }
  var opts = {
    url: url,
    headers: { "Content-Type": "application/json" },
    body: "",
  };
  if (REQUEST_TIMEOUT !== null) opts.timeout = REQUEST_TIMEOUT;

  return httpRequest("POST", opts).then(function (r) {
    if (r.error) return { error: r.error };
    var data = null;
    try {
      data = JSON.parse(r.body);
    } catch (e) {}
    // 带槽位写入且本机 IP 已占用别的槽位 → 服务端 403 冲突，需去 UI 删旧槽位
    if (r.status === 403) {
      return {
        error: "槽位冲突：请先到控制台删除本机旧槽位",
        conflict: true,
        currentIp: data && data.currentIp,
      };
    }
    if (r.status < 200 || r.status >= 300) {
      var message = data && (data.message || data.msg || data.error);
      return { error: "HTTP " + r.status + (typeof message === "string" ? "：" + panelText(message) : "：API 请求失败") };
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return { error: "响应异常：API 未返回有效 JSON 对象" };
    }
    // whitelist 元素为 {ip, slot} 对象（旧版曾是纯 IP 字符串）：记下 ip→slot 再摊平成 IP 数组
    var raw = Array.isArray(data.whitelist) ? data.whitelist : [];
    data.slotOf = {};
    raw.forEach(function (e) {
      if (e && typeof e === "object" && e.slot !== null && e.slot !== undefined) {
        data.slotOf[e.ip] = e.slot;
      }
    });
    data.whitelist = raw.map(function (e) {
      return e && typeof e === "object" ? e.ip : e;
    }).filter(function (ip) {
      return typeof ip === "string" && ip.trim().length > 0;
    });
    data.applied =
      data.enabled === true &&
      data.whitelist.some(function (ip) {
        return sameC24(ip, data.currentIp);
      });
    return data;
  });
}

function ensureWhitelisted(item, index) {
  var kvState = STORE_PREFIX + index;
  var kvHist = STORE_PREFIX + "hist_" + index;
  var cellular = onCellular();
  var ctx = { kvState: kvState, kvHist: kvHist, slot: item.slot };

  // 服务端对重复 IP 幂等，直接请求 /add 即可，无需先查
  return apiCall(item.token, item.slot).then(function (st) {
    if (st.applied) {
      var hist = readHistory(kvHist);
      var last = hist.length ? hist[hist.length - 1] : null;
      if (!last || last.ip !== st.currentIp) {
        hist.push({ ip: st.currentIp, src: cellular ? "cell" : "fixed", ts: Date.now() });
        storeWrite(JSON.stringify(hist.slice(-10)), kvHist);
      }
    }
    ctx.st = st;
    return ctx;
  });
}

// 每 token 一行：不含 token，只含白名单/坑位信息；蜂窝加的 IP 标 📶
function describe(index, ctx) {
  var st = ctx.st;
  var pin = ctx.slot !== null && ctx.slot !== undefined && ctx.slot !== "" ? " 📌" + ctx.slot : "";
  var head = "#" + (index + 1) + pin + " ";
  if (st.error) return head + "❌ " + panelText(st.error);
  if (st.enabled === false) return head + "⚠️ 防火墙未启用";
  if (!st.applied) return head + "❌ 加白未生效 " + st.whitelist.length + "/" + st.limit;

  var hist = readHistory(ctx.kvHist);
  var cellIps = {};
  hist.forEach(function (e) {
    if (e.src === "cell") cellIps[e.ip] = true;
  });
  var slotOf = st.slotOf || {};
  var ips = st.whitelist
    .map(function (ip) {
      var slotTag = slotOf[ip] !== undefined ? " 📌" + slotOf[ip] : "";
      return ip + slotTag + (cellIps[ip] ? " 📶" : "") + (sameC24(ip, st.currentIp) ? " ←" : "");
    })
    .join("\n    ");
  return head + "✅ " + st.whitelist.length + "/" + st.limit + "\n    " + ips;
}

// 分隔符兼容 , | ; 、；非 pgnfw_ 开头的段（如未修改的占位提示）直接忽略。
// 每段可带可选 @槽位 后缀：pgnfw_xxx@0 → 钉槽位 0；无后缀则 slotless。
var tokens = (getArgumentTokens() || storeRead(TOKENS_KEY) || INLINE_TOKENS || "")
  .split(/[,|;、\s]+/)
  .map(function (s) {
    return s.trim();
  })
  .filter(function (s) {
    return s.indexOf("pgnfw_") === 0;
  })
  .map(function (s) {
    var at = s.indexOf("@");
    if (at === -1) return { token: s, slot: null };
    var n = parseInt(s.slice(at + 1), 10);
    return { token: s.slice(0, at), slot: isNaN(n) ? null : n };
  });

if (tokens.length === 0) {
  notify(
    "po0 防火墙加白",
    "未配置 token",
    "模块参数 tokens / 存储 key po0fw_tokens / 脚本内 INLINE_TOKENS 三选一填入 pgnfw_ token"
  );
  finish("po0 防火墙 · 等待配置", "请在模块设置中填写 Token\n多台机器用英文逗号分隔\n固定槽位示例：Token@0", "setup");
} else {
  Promise.all(
    tokens.map(function (t, i) {
      return ensureWhitelisted(t, i);
    })
  ).then(function (results) {
    var okCount = 0;
    var exitIp = "?";
    var lines = [];
    var changed = false;

    for (var i = 0; i < results.length; i++) {
      var st = results[i].st;
      if (st.applied) okCount++;
      if (st.currentIp) exitIp = st.currentIp;
      lines.push(describe(i, results[i]));

      var state = (st.currentIp || "?") + "|" + (st.applied ? "1" : "0");
      if (storeRead(results[i].kvState) !== state) {
        storeWrite(state, results[i].kvState);
        changed = true;
      }
    }

    var allOk = okCount === results.length;
    var title =
      "po0 加白 " + okCount + "/" + results.length + " · 出口 " + exitIp + (onCellular() ? " 📶" : "");
    var content = lines.join("\n");

    // 成功态仅在出口 IP / 加白状态变化时通知；失败/未生效必须每次弹，
    // 否则持久化状态相同（都是失败）时 changed=false 会把错误静默吞掉。
    if (changed || !allOk) {
      notify("po0 防火墙加白", title, content);
    }
    if (isQX) $done();
    else $done(buildPanel(results));
  }).catch(function (e) {
    var message = panelText(e && e.message ? e.message : e);
    notify("po0 防火墙加白", "脚本异常", message);
    finish("po0 防火墙 · 脚本异常", message + "\n请检查模块参数后刷新", "error");
  });
}

