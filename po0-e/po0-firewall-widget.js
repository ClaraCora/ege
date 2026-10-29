/*
 * po0 防火墙白名单看板 · Egern 独立小组件脚本
 *
 * 用途：独立作为 Egern 的 Generic 脚本，在 Widget Gallery 或主屏幕/锁屏上渲染小组件。
 * 兼容配合主模块 po0-firewall-whitelist.yaml，亦可在脚本独立设置中填入 env: tokens
 */

import handler from "./po0-firewall-whitelist.js";

export default async function (ctx) {
  // 确保以小组件环境模式执行
  if (!ctx.widgetFamily) {
    ctx.widgetFamily = "systemMedium";
  }
  return await handler(ctx);
}
