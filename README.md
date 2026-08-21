# ege 资源备份仓库

[![Backup](https://github.com/ClaraCora/ege/actions/workflows/backup.yml/badge.svg)](https://github.com/ClaraCora/ege/actions/workflows/backup.yml)

备份 Loon、Egern 和 Mihomo 使用的远程资源。GitHub Actions 每天两次读取根目录的 URL 清单，以 Loon 的请求 User-Agent 下载、校验内容，并在资源发生变化时提交回 `main` 分支。

当前收录 **111** 个下载资源，另由 30 个 Kelee 规则转换出 **72** 个 Mihomo Provider（Mihomo `v1.19.30`）。

| 项目 | 值 |
| --- | --- |
| 请求 User-Agent | `Loon/975 CFNetwork/3860.700.1 Darwin/25.6.0` |
| 运行时间 | UTC `00:17` / `12:17`（北京时间约 `08:17` / `20:17`） |
| 仓库地址 | <https://github.com/ClaraCora/ege> |

下表所有条目都是可点击的名称链接，右键复制链接地址即可填入客户端。

> 本文件由 `scripts/render_readme.py` 依据磁盘上的实际文件生成，请不要手工编辑。

## 快速开始

|⭐ Loon / Egern 规则|  |  |  |  |
| ---- | ---- | ---- | ---- | ---- |
|[AI](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/AI.lsr) |[Apple](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Apple.lsr) |[ChinaMax](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaMax.lsr) |[Global](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Global.lsr) |[Microsoft](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Microsoft.lsr) |
|[Telegram](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Telegram.lsr) |[YouTube](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/YouTube.lsr) |  |  |  |

|⭐ Loon / Egern 图标|  |  |  |  |
| ---- | ---- | ---- | ---- | ---- |
|[Global](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Global.png) |[Proxy](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Proxy.png) |[Apple](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Apple.png) |[Microsoft](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Microsoft-5de51988.png) |[Telegram](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Telegram.png) |
|[YouTube](https://raw.githubusercontent.com/ClaraCora/ege/main/png/YouTube.png) |  |  |  |  |

|⭐ Mihomo Provider|  |  |  |  |
| ---- | ---- | ---- | ---- | ---- |
|[Global (domain)](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Global.mrs) |[Global (ipcidr)](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Global.mrs) |[Global (classical)](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Global.list) |[Microsoft (domain)](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Microsoft.mrs) |[Apple (domain)](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Apple.mrs) |
|[YouTube (domain)](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/YouTube.mrs) |[ads](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ads.mrs) |[fakeip-filter](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/fakeip-filter.mrs) |  |  |

## 根目录清单

GitHub Actions 的下载输入清单。客户端应引用下方的具体备份文件，而不是清单本身。

|📋 清单文件|  |  |  |  |
| ---- | ---- | ---- | ---- | ---- |
|[kelee](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee.lsr) |[png](https://raw.githubusercontent.com/ClaraCora/ege/main/png.lsr) |[ad](https://raw.githubusercontent.com/ClaraCora/ege/main/ad.lsr) |[mihomo](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo.lsr) |[geo](https://raw.githubusercontent.com/ClaraCora/ege/main/geo.lsr) |

## 下载备份

由 `scripts/backup.py` 按根目录清单下载并校验。

|🧩 Kelee Loon 规则（30）|  |  |  |  |
| ---- | ---- | ---- | ---- | ---- |
|[AI](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/AI.lsr) |[Alibaba](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Alibaba.lsr) |[Apple](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Apple.lsr) |[Baidu](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Baidu.lsr) |[BiliBili](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/BiliBili.lsr) |
|[ChinaASN](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaASN.lsr) |[ChinaMax](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaMax.lsr) |[ChinaMobile](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaMobile.lsr) |[ChinaTelecom](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaTelecom.lsr) |[DouYin](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/DouYin.lsr) |
|[GaoDe](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/GaoDe.lsr) |[GitHub](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/GitHub.lsr) |[Global](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Global.lsr) |[Google](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Google.lsr) |[Instagram](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Instagram.lsr) |
|[JingDong](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/JingDong.lsr) |[KugouKuwo](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/KugouKuwo.lsr) |[Microsoft](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Microsoft.lsr) |[NetEase](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/NetEase.lsr) |[NetEaseMusic](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/NetEaseMusic.lsr) |
|[Pinduoduo](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Pinduoduo.lsr) |[SpeedtestInternational](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/SpeedtestInternational.lsr) |[Telegram](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Telegram.lsr) |[Tencent](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Tencent.lsr) |[TestFlight](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/TestFlight.lsr) |
|[TikTok](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/TikTok.lsr) |[Twitter](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Twitter.lsr) |[WeChat](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/WeChat.lsr) |[XiaoMi](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/XiaoMi.lsr) |[YouTube](https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/YouTube.lsr) |

|🖼️ PNG 图标（57）|  |  |  |  |
| ---- | ---- | ---- | ---- | ---- |
|[AI](https://raw.githubusercontent.com/ClaraCora/ege/main/png/AI.png) |[Adblock](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Adblock.png) |[Apple](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Apple.png) |[CN](https://raw.githubusercontent.com/ClaraCora/ege/main/png/CN.png) |[ChatGPT](https://raw.githubusercontent.com/ClaraCora/ege/main/png/ChatGPT.png) |
|[China](https://raw.githubusercontent.com/ClaraCora/ege/main/png/China.png) |[Emby-0decdc6c](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Emby-0decdc6c.png) |[Emby-dc841cc2](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Emby-dc841cc2.png) |[Final](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Final.png) |[GitHub](https://raw.githubusercontent.com/ClaraCora/ege/main/png/GitHub.png) |
|[Global](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Global.png) |[Google](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Google.png) |[Google_Search](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Google_Search.png) |[HK](https://raw.githubusercontent.com/ClaraCora/ege/main/png/HK.png) |[Hong_Kong](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Hong_Kong.png) |
|[Instagram-4f81a6f8](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Instagram-4f81a6f8.png) |[Instagram-533227d7](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Instagram-533227d7.png) |[JP](https://raw.githubusercontent.com/ClaraCora/ege/main/png/JP.png) |[Japan](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Japan.png) |[KR](https://raw.githubusercontent.com/ClaraCora/ege/main/png/KR.png) |
|[Korea](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Korea.png) |[MO](https://raw.githubusercontent.com/ClaraCora/ege/main/png/MO.png) |[Macao](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Macao.png) |[Malaysia](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Malaysia.png) |[Microsoft-5de51988](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Microsoft-5de51988.png) |
|[Microsoft-d11688b0](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Microsoft-d11688b0.png) |[Netease](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Netease.png) |[Netflix](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Netflix.png) |[PayPal](https://raw.githubusercontent.com/ClaraCora/ege/main/png/PayPal.png) |[Proxy](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Proxy.png) |
|[QQ](https://raw.githubusercontent.com/ClaraCora/ege/main/png/QQ.png) |[SG](https://raw.githubusercontent.com/ClaraCora/ege/main/png/SG.png) |[Singapore](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Singapore.png) |[Speedtest](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Speedtest.png) |[Steam](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Steam.png) |
|[TW](https://raw.githubusercontent.com/ClaraCora/ege/main/png/TW.png) |[Taobao](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Taobao.png) |[Telegram](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Telegram.png) |[TikTok-27034e11](https://raw.githubusercontent.com/ClaraCora/ege/main/png/TikTok-27034e11.png) |[TikTok-5f5d2f2c](https://raw.githubusercontent.com/ClaraCora/ege/main/png/TikTok-5f5d2f2c.png) |
|[TikTok_1](https://raw.githubusercontent.com/ClaraCora/ege/main/png/TikTok_1.png) |[Twitter](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Twitter.png) |[US](https://raw.githubusercontent.com/ClaraCora/ege/main/png/US.png) |[United_States](https://raw.githubusercontent.com/ClaraCora/ege/main/png/United_States.png) |[Unlock](https://raw.githubusercontent.com/ClaraCora/ege/main/png/Unlock.png) |
|[YouTube](https://raw.githubusercontent.com/ClaraCora/ege/main/png/YouTube.png) |[baidunetdisk（1）](https://raw.githubusercontent.com/ClaraCora/ege/main/png/baidunetdisk%281%29.png) |[bilibili_3](https://raw.githubusercontent.com/ClaraCora/ege/main/png/bilibili_3.png) |[dianxin](https://raw.githubusercontent.com/ClaraCora/ege/main/png/dianxin.png) |[jingdong](https://raw.githubusercontent.com/ClaraCora/ege/main/png/jingdong.png) |
|[kugou](https://raw.githubusercontent.com/ClaraCora/ege/main/png/kugou.png) |[mega](https://raw.githubusercontent.com/ClaraCora/ege/main/png/mega.png) |[pinduoduo](https://raw.githubusercontent.com/ClaraCora/ege/main/png/pinduoduo.png) |[tengxunditu](https://raw.githubusercontent.com/ClaraCora/ege/main/png/tengxunditu.png) |[testflight（2）](https://raw.githubusercontent.com/ClaraCora/ege/main/png/testflight%282%29.png) |
|[wechat（1）](https://raw.githubusercontent.com/ClaraCora/ege/main/png/wechat%281%29.png) |[yidong（1）](https://raw.githubusercontent.com/ClaraCora/ege/main/png/yidong%281%29.png) |  |  |  |

|📵 广告规则（3）|  |  |  |  |
| ---- | ---- | ---- | ---- | ---- |
|[Ads_AWAvenue](https://raw.githubusercontent.com/ClaraCora/ege/main/ad/Ads_AWAvenue.yaml) |[Advertising](https://raw.githubusercontent.com/ClaraCora/ege/main/ad/Advertising.list) |[adrules](https://raw.githubusercontent.com/ClaraCora/ege/main/ad/adrules.list) |  |  |

|🌐 Geo 数据库（4）|  |  |  |  |
| ---- | ---- | ---- | ---- | ---- |
|[GeoLite2-ASN](https://raw.githubusercontent.com/ClaraCora/ege/main/geo/GeoLite2-ASN.mmdb) |[country](https://raw.githubusercontent.com/ClaraCora/ege/main/geo/country.mmdb) |[geoip](https://raw.githubusercontent.com/ClaraCora/ege/main/geo/geoip.dat) |[geosite](https://raw.githubusercontent.com/ClaraCora/ege/main/geo/geosite.dat) |  |

|⚙️ Mihomo 原生资源（17）|  |  |  |  |
| ---- | ---- | ---- | ---- | ---- |
|[Binance](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Binance.list) |[Crypto](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Crypto.list) |[Discord](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Discord.list) |[Facebook](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Facebook.list) |[LinkedIn](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/LinkedIn.list) |
|[OKX](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/OKX.list) |[PayPal](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/PayPal.list) |[Reddit](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Reddit.list) |[Steam](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Steam.yaml) |[WebRTC](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/WebRTC.list) |
|[ads](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ads.mrs) |[fakeip-filter](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/fakeip-filter.mrs) |[netflix-2b0a4ed1](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/netflix-2b0a4ed1.mrs) |[netflix-512b2f11](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/netflix-512b2f11.mrs) |[private-1fa87d08](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/private-1fa87d08.mrs) |
|[private-275bfa0d](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/private-275bfa0d.mrs) |[proxy](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/proxy.mrs) |  |  |  |

## Kelee 转换产物

由 `scripts/convert_kelee.py` 调用 Mihomo `v1.19.30` 从 `kelee/` 生成。

|🔤 Mihomo domain Provider（29）|  |  |  |  |
| ---- | ---- | ---- | ---- | ---- |
|[AI](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/AI.mrs) |[Alibaba](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Alibaba.mrs) |[Apple](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Apple.mrs) |[Baidu](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Baidu.mrs) |[BiliBili](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/BiliBili.mrs) |
|[ChinaMax](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/ChinaMax.mrs) |[ChinaMobile](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/ChinaMobile.mrs) |[ChinaTelecom](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/ChinaTelecom.mrs) |[DouYin](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/DouYin.mrs) |[GaoDe](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/GaoDe.mrs) |
|[GitHub](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/GitHub.mrs) |[Global](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Global.mrs) |[Google](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Google.mrs) |[Instagram](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Instagram.mrs) |[JingDong](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/JingDong.mrs) |
|[KugouKuwo](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/KugouKuwo.mrs) |[Microsoft](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Microsoft.mrs) |[NetEase](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/NetEase.mrs) |[NetEaseMusic](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/NetEaseMusic.mrs) |[Pinduoduo](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Pinduoduo.mrs) |
|[SpeedtestInternational](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/SpeedtestInternational.mrs) |[Telegram](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Telegram.mrs) |[Tencent](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Tencent.mrs) |[TestFlight](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/TestFlight.mrs) |[TikTok](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/TikTok.mrs) |
|[Twitter](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Twitter.mrs) |[WeChat](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/WeChat.mrs) |[XiaoMi](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/XiaoMi.mrs) |[YouTube](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/YouTube.mrs) |  |

behavior: domain，来自 `DOMAIN` 和 `DOMAIN-SUFFIX`。

|🔢 Mihomo ipcidr Provider（17）|  |  |  |  |
| ---- | ---- | ---- | ---- | ---- |
|[AI](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/AI.mrs) |[Alibaba](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Alibaba.mrs) |[Apple](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Apple.mrs) |[BiliBili](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/BiliBili.mrs) |[ChinaMax](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/ChinaMax.mrs) |
|[ChinaMobile](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/ChinaMobile.mrs) |[Global](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Global.mrs) |[Google](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Google.mrs) |[KugouKuwo](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/KugouKuwo.mrs) |[NetEase](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/NetEase.mrs) |
|[NetEaseMusic](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/NetEaseMusic.mrs) |[SpeedtestInternational](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/SpeedtestInternational.mrs) |[Telegram](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Telegram.mrs) |[Tencent](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Tencent.mrs) |[Twitter](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Twitter.mrs) |
|[XiaoMi](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/XiaoMi.mrs) |[YouTube](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/YouTube.mrs) |  |  |  |

behavior: ipcidr，来自 `IP-CIDR` 和 `IP-CIDR6`。

|📄 Mihomo classical Provider（15）|  |  |  |  |
| ---- | ---- | ---- | ---- | ---- |
|[AI](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/AI.list) |[Apple](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Apple.list) |[ChinaASN](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/ChinaASN.list) |[ChinaMax](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/ChinaMax.list) |[GitHub](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/GitHub.list) |
|[Global](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Global.list) |[Google](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Google.list) |[Instagram](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Instagram.list) |[Microsoft](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Microsoft.list) |[Telegram](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Telegram.list) |
|[TestFlight](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/TestFlight.list) |[TikTok](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/TikTok.list) |[Twitter](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Twitter.list) |[WeChat](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/WeChat.list) |[YouTube](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/YouTube.list) |

behavior: classical，来自 `DOMAIN-KEYWORD`、`IP-ASN`、`AND`、`OR`、`NOT`。

|🔍 Mihomo unsupported 审计（11）|  |  |  |  |
| ---- | ---- | ---- | ---- | ---- |
|[Apple](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Apple.list) |[BiliBili](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/BiliBili.list) |[ChinaMax](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/ChinaMax.list) |[Global](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Global.list) |[Google](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Google.list) |
|[Microsoft](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Microsoft.list) |[NetEaseMusic](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/NetEaseMusic.list) |[Tencent](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Tencent.list) |[TikTok](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/TikTok.list) |[WeChat](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/WeChat.list) |
|[YouTube](https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/YouTube.list) |  |  |  |  |

无法转换的规则，仅供人工核对，不要作为 Provider 引用。

## 目录结构

| 路径 | 作用 | 自动生成 |
| --- | --- | --- |
| `kelee/` | `kelee.lsr` 下载的 Loon 规则 | 是 |
| `png/` | `png.lsr` 下载的 PNG 图标 | 是 |
| `ad/` | `ad.lsr` 下载的广告资源 | 是 |
| `geo/` | `geo.lsr` 下载的地理数据库 | 是 |
| `mihomo/` | Mihomo 原生资源，以及 Kelee 转换结果子目录 | 是 |
| `metadata/manifest.json` | 来源 URL、目标路径、SHA-256、大小和 ETag | 是 |
| `metadata/kelee-mihomo-manifest.json` | Kelee 规则的分类数量、输出路径和校验值 | 是 |
| `scripts/backup.py` | 下载、校验、保存资源，清理已移除来源的旧文件 | 否 |
| `scripts/convert_kelee.py` | 调用 Mihomo 生成 MRS 和文本 Provider | 否 |
| `scripts/render_readme.py` | 依据磁盘实际文件生成本文件 | 否 |
| `.github/workflows/backup.yml` | 定时执行备份、转换与提交 | 否 |

## 运行规则

1. 工作流在 UTC `00:17` 和 `12:17` 运行（北京时间约 `08:17` 和 `20:17`），也可在 Actions 页面用 **Run workflow** 手动触发。
2. GitHub 的定时调度可能延迟数十分钟，且**不会补跑**错过的时段；需要立刻更新时请手动触发。
3. 下载失败、空文件、HTML 拦截页、超大响应或损坏的 PNG 都会让本次运行失败，此时不会覆盖任何已有文件——备份要么整体更新，要么保持原样。
4. 单次运行会汇总报告所有失败的资源，而不是遇到第一个错误就停下，便于一次定位全部问题源。
5. Kelee 的 `DOMAIN` 和 `DOMAIN-SUFFIX` 生成 `mihomo/domain/` 下的 MRS；`IP-CIDR` 和 `IP-CIDR6` 生成 `mihomo/ipcidr/` 下的 MRS。
6. `DOMAIN-KEYWORD`、`IP-ASN`、`AND`、`OR`、`NOT` 生成 `mihomo/classical/` 下的文本 Provider。
7. `USER-AGENT` 等无法表达的规则只写入 `mihomo/unsupported/` 供审计，不要作为 Provider 引用。
8. 资源内容没有变化时不会产生新提交，但 Actions 运行记录仍会保留。
9. 调整资源来源时只编辑根目录对应的 `.lsr` 文件，不要手工修改自动生成的目录。
