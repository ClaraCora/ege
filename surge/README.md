# po0 防火墙 · Surge

此目录是可独立上传到 `ClaraCora/ege` 仓库的 Surge 版本。上游为 [w0ven/po0fw](https://github.com/w0ven/po0fw)，原作者 `reallinzc`；本副本于 2026-11-12 获取，增加了原生 Panel 排版及错误状态处理。

## 文件与安装

- `po0-firewall-whitelist.sgmodule`：Surge 模块，包含直连规则、定时任务、切网事件和 Panel。
- `po0-firewall-whitelist.js`：模块唯一引用的脚本，已一并保存于此目录。

将整个 `surge/` 目录上传至仓库的 `main` 分支，然后在 Surge 的模块管理中通过以下地址安装：

```text
https://raw.githubusercontent.com/ClaraCora/ege/main/surge/po0-firewall-whitelist.sgmodule
```

安装时在 `tokens` 参数填写自己的 Token。多台机器使用英文逗号分隔，例如 `pgnfw_xxx,pgnfw_yyy`；需要固定槽位时使用 `pgnfw_xxx@0`，槽位从 `0` 开始有效。Token 在 Surge 内填写，仓库中的参数默认留空。

模块三处 `script-path` 均指向本仓库的 `main/surge/po0-firewall-whitelist.js`，运行时不再下载上游脚本，也没有远程图片、字体或脚本库依赖。若更换仓库或分支，需要同步修改这三处地址。这里的“本地化”指将模块依赖收纳到自己的仓库；Surge 安装后仍通过仓库的 Raw 地址获取脚本。

## 自动运行

每 10 分钟及网络切换时自动调用加白 API。面板保留 Surge 原生刷新按钮，面板刷新也会执行一次加白。`update-interval=300` 表示打开面板时，若距上次更新已满 5 分钟就更新，并非额外的后台定时器。

服务端仍为 `https://124.221.69.228/api/firewall/`，这是加白服务本身，须联网使用。模块保留它的 `DIRECT` 规则，以便服务端读取真实出口。原有重试、多 Token、固定槽位、24 小时蜂窝记录及状态变化通知机制继续使用。

## Panel

面板标题显示整体状态和成功机器数，正文依次显示出口、每台机器的状态与槽位数量、完整白名单和本机更新时间。名单保留 CIDR 后缀，使用“本机”“固定 0”“蜂窝”等文字标记。多个出口分别显示在对应机器下；失败时给出原因与处理提示。

成功使用冰川蓝盾牌，部分成功或未启用使用琥珀色，失败或未生效使用红色。SF Symbols 图标和明确文案共同表达状态。Surge Panel 支持原生标题、纯文本、图标与图标色；字体、背景和外层布局由 Surge 管理。参见 [Surge Panel 官方文档](https://manual.nssurge.com/tools/panel.html)。

## 验证

在项目根目录运行 `node --test tests/surge-panel.test.mjs` 可验证脚本实际入口，覆盖固定槽位 0、五条白名单、多机器、部分成功、未启用、空名单、网络重试、API 错误和 Token 脱敏。测试使用模拟响应，不调用真实加白 API。

`output/surge-panel/` 存放开发用的文本排版预览，基于脚本真实返回值和明确的示例数据；它不需要上传。Windows 环境未运行 Surge，预览用于检查内容与换行，最终原生渲染和设备上的 API 连通性需在 Surge 中确认。
