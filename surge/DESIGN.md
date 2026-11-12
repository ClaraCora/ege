# Surge Panel 设计约束

本表面用于查看自动加白结果，沿用项目的冰川蓝方向。生产界面由 Surge 原生 Panel 渲染，使用系统字体与 SF Symbols；不交付 HTML、CSS、位图背景或自定义交互控件。

信息顺序固定为整体状态与成功数、当前出口、各机器的真实名单、网络与更新时间。用空行区分机器，用“·”分隔同一行内的相关信息。不使用空格表格或装饰性进度条；小屏通过系统换行承载完整 CIDR。实际名单不折叠、不生成空槽位。

| 状态 | 标题 | SF Symbol | 图标色 |
| --- | --- | --- | --- |
| 全部生效 | 已加白 | `checkmark.shield.fill` | `#3B82B8` |
| 部分生效 | 部分加白 | `exclamationmark.shield.fill` | `#C17934` |
| 全部未启用 | 未启用 | `exclamationmark.shield.fill` | `#C17934` |
| 全部请求失败 | 更新失败 | `exclamationmark.shield.fill` | `#D35C5C` |
| 无生效机器且存在其他异常 | 未生效 | `exclamationmark.shield.fill` | `#D35C5C` |
| 缺少 Token | 等待配置 | `gearshape.fill` | `#3B82B8` |

每台机器单独标明结果；槽位冲突提示到控制台删除旧槽位，未启用提示开启防火墙，空名单明确显示无记录。Slot 0、CIDR 后缀及本机匹配均保留。Token 不出现在面板和错误通知中。

运行时使用 Surge 原生刷新按钮。背景和文字随宿主的浅色、深色外观变化，脚本只设置图标色。`output/surge-panel/` 是浏览器近似排版预览，其卡片外观与盾牌图形不作为原生渲染的精确承诺。
