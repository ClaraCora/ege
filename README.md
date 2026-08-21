# ege 资源备份仓库

本仓库用于备份 Loon、Egern 和 Mihomo 使用的远程资源。GitHub Actions 每 12 小时读取根目录的 URL 清单，使用 Loon 的请求 User-Agent 下载资源、校验内容，并在资源发生变化时自动提交到 `main` 分支。

请求 User-Agent：

```text
Loon/975 CFNetwork/3860.700.1 Darwin/25.6.0
```

仓库地址：<https://github.com/ClaraCora/ege>

## 一、根目录清单的现成引用地址

下表中的地址是真实存在、可以直接打开或复制的 Raw 地址。根目录的 `.lsr` 文件是“下载输入清单”，用于 GitHub Actions 读取来源；客户端通常应该引用后面的具体备份文件，而不是引用清单本身。

| 文件 | 直接引用地址 | 用途 | 是否自动生成 |
| --- | --- | --- | --- |
| `kelee.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee.lsr> | 下载 Kelee Loon 规则的输入清单 | 否 |
| `png.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png.lsr> | 下载 PNG 图标的输入清单 | 否 |
| `ad.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/ad.lsr> | 下载广告规则的输入清单 | 否 |
| `mihomo.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo.lsr> | 下载 Mihomo 原生资源的输入清单 | 否 |
| `geo.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/geo.lsr> | 下载 GeoIP、GeoSite 和 MMDB 的输入清单 | 否 |

## 二、可直接使用的资源地址

以下各表按当前仓库中实际存在的文件列出完整地址，不使用 `<名称>`、`<文件名>` 等占位符。复制第三列地址即可使用。

### Kelee Loon 规则

| 文件 | 现成可用的 Raw 地址 | 作用 |
| --- | --- | --- |
| `kelee/AI.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/AI.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/Alibaba.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Alibaba.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/Apple.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Apple.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/Baidu.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Baidu.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/BiliBili.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/BiliBili.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/ChinaASN.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaASN.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/ChinaMax.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaMax.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/ChinaMobile.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaMobile.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/ChinaTelecom.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaTelecom.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/DouYin.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/DouYin.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/GaoDe.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/GaoDe.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/GitHub.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/GitHub.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/Global.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Global.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/Google.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Google.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/Instagram.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Instagram.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/JingDong.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/JingDong.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/KugouKuwo.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/KugouKuwo.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/Microsoft.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Microsoft.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/NetEase.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/NetEase.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/NetEaseMusic.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/NetEaseMusic.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/Pinduoduo.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Pinduoduo.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/SpeedtestInternational.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/SpeedtestInternational.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/Telegram.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Telegram.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/Tencent.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Tencent.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/TestFlight.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/TestFlight.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/TikTok.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/TikTok.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/Twitter.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Twitter.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/WeChat.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/WeChat.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/XiaoMi.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/XiaoMi.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |
| `kelee/YouTube.lsr` | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/YouTube.lsr> | Loon / Egern 规则，可直接作为规则资源引用 |

### PNG 图标

| 文件 | 现成可用的 Raw 地址 | 作用 |
| --- | --- | --- |
| `png/Adblock.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Adblock.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/AI.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/AI.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Apple.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Apple.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/baidunetdisk(1).png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/baidunetdisk(1).png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/bilibili_3.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/bilibili_3.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/ChatGPT.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/ChatGPT.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/China.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/China.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/CN.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/CN.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/dianxin.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/dianxin.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Emby-0decdc6c.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Emby-0decdc6c.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Emby-dc841cc2.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Emby-dc841cc2.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Final.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Final.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/GitHub.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/GitHub.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Global.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Global.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Google.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Google.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Google_Search.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Google_Search.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/HK.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/HK.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Hong_Kong.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Hong_Kong.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Instagram-4f81a6f8.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Instagram-4f81a6f8.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Instagram-533227d7.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Instagram-533227d7.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Japan.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Japan.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/jingdong.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/jingdong.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/JP.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/JP.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Korea.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Korea.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/KR.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/KR.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/kugou.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/kugou.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Macao.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Macao.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Malaysia.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Malaysia.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/mega.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/mega.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Microsoft-5de51988.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Microsoft-5de51988.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Microsoft-d11688b0.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Microsoft-d11688b0.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/MO.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/MO.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Netease.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Netease.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Netflix.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Netflix.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/PayPal.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/PayPal.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/pinduoduo.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/pinduoduo.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Proxy.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Proxy.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/QQ.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/QQ.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/SG.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/SG.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Singapore.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Singapore.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Speedtest.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Speedtest.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Steam.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Steam.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Taobao.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Taobao.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Telegram.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Telegram.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/tengxunditu.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/tengxunditu.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/testflight(2).png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/testflight(2).png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/TikTok_1.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/TikTok_1.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/TikTok-27034e11.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/TikTok-27034e11.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/TikTok-5f5d2f2c.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/TikTok-5f5d2f2c.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/TW.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/TW.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Twitter.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Twitter.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/United_States.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/United_States.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/Unlock.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Unlock.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/US.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/US.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/wechat(1).png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/wechat(1).png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/yidong(1).png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/yidong(1).png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |
| `png/YouTube.png` | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/YouTube.png> | Loon / Egern 分组图标，可直接作为图标 URL 引用 |

### 广告规则

| 文件 | 现成可用的 Raw 地址 | 作用 |
| --- | --- | --- |
| `ad/adrules.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/ad/adrules.list> | 广告过滤规则，按文件实际格式在客户端中引用 |
| `ad/Ads_AWAvenue.yaml` | <https://raw.githubusercontent.com/ClaraCora/ege/main/ad/Ads_AWAvenue.yaml> | 广告过滤规则，按文件实际格式在客户端中引用 |
| `ad/Advertising.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/ad/Advertising.list> | 广告过滤规则，按文件实际格式在客户端中引用 |

### Geo 数据库

| 文件 | 现成可用的 Raw 地址 | 作用 |
| --- | --- | --- |
| `geo/country.mmdb` | <https://raw.githubusercontent.com/ClaraCora/ege/main/geo/country.mmdb> | Mihomo、Loon 或其他支持对应格式的 Geo 数据库 |
| `geo/geoip.dat` | <https://raw.githubusercontent.com/ClaraCora/ege/main/geo/geoip.dat> | Mihomo、Loon 或其他支持对应格式的 Geo 数据库 |
| `geo/GeoLite2-ASN.mmdb` | <https://raw.githubusercontent.com/ClaraCora/ege/main/geo/GeoLite2-ASN.mmdb> | Mihomo、Loon 或其他支持对应格式的 Geo 数据库 |
| `geo/geosite.dat` | <https://raw.githubusercontent.com/ClaraCora/ege/main/geo/geosite.dat> | Mihomo、Loon 或其他支持对应格式的 Geo 数据库 |

### Mihomo 原生资源

| 文件 | 现成可用的 Raw 地址 | 作用 |
| --- | --- | --- |
| `mihomo/ads.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ads.mrs> | 原本就是 Mihomo 格式的资源，可直接作为 Provider 或配置资源 |
| `mihomo/Binance.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Binance.list> | 原本就是 Mihomo 格式的资源，可直接作为 Provider 或配置资源 |
| `mihomo/Crypto.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Crypto.list> | 原本就是 Mihomo 格式的资源，可直接作为 Provider 或配置资源 |
| `mihomo/Discord.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Discord.list> | 原本就是 Mihomo 格式的资源，可直接作为 Provider 或配置资源 |
| `mihomo/Facebook.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Facebook.list> | 原本就是 Mihomo 格式的资源，可直接作为 Provider 或配置资源 |
| `mihomo/fakeip-filter.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/fakeip-filter.mrs> | 原本就是 Mihomo 格式的资源，可直接作为 Provider 或配置资源 |
| `mihomo/LinkedIn.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/LinkedIn.list> | 原本就是 Mihomo 格式的资源，可直接作为 Provider 或配置资源 |
| `mihomo/netflix-2b0a4ed1.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/netflix-2b0a4ed1.mrs> | 原本就是 Mihomo 格式的资源，可直接作为 Provider 或配置资源 |
| `mihomo/netflix-512b2f11.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/netflix-512b2f11.mrs> | 原本就是 Mihomo 格式的资源，可直接作为 Provider 或配置资源 |
| `mihomo/OKX.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/OKX.list> | 原本就是 Mihomo 格式的资源，可直接作为 Provider 或配置资源 |
| `mihomo/PayPal.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/PayPal.list> | 原本就是 Mihomo 格式的资源，可直接作为 Provider 或配置资源 |
| `mihomo/private-1fa87d08.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/private-1fa87d08.mrs> | 原本就是 Mihomo 格式的资源，可直接作为 Provider 或配置资源 |
| `mihomo/private-275bfa0d.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/private-275bfa0d.mrs> | 原本就是 Mihomo 格式的资源，可直接作为 Provider 或配置资源 |
| `mihomo/proxy.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/proxy.mrs> | 原本就是 Mihomo 格式的资源，可直接作为 Provider 或配置资源 |
| `mihomo/Reddit.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Reddit.list> | 原本就是 Mihomo 格式的资源，可直接作为 Provider 或配置资源 |
| `mihomo/Steam.yaml` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Steam.yaml> | 原本就是 Mihomo 格式的资源，可直接作为 Provider 或配置资源 |
| `mihomo/WebRTC.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/WebRTC.list> | 原本就是 Mihomo 格式的资源，可直接作为 Provider 或配置资源 |

### Mihomo domain Provider

| 文件 | 现成可用的 Raw 地址 | 作用 |
| --- | --- | --- |
| `mihomo/domain/AI.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/AI.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/Alibaba.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Alibaba.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/Apple.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Apple.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/Baidu.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Baidu.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/BiliBili.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/BiliBili.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/ChinaMax.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/ChinaMax.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/ChinaMobile.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/ChinaMobile.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/ChinaTelecom.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/ChinaTelecom.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/DouYin.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/DouYin.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/GaoDe.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/GaoDe.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/GitHub.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/GitHub.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/Global.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Global.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/Google.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Google.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/Instagram.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Instagram.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/JingDong.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/JingDong.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/KugouKuwo.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/KugouKuwo.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/Microsoft.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Microsoft.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/NetEase.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/NetEase.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/NetEaseMusic.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/NetEaseMusic.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/Pinduoduo.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Pinduoduo.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/SpeedtestInternational.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/SpeedtestInternational.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/Telegram.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Telegram.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/Tencent.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Tencent.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/TestFlight.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/TestFlight.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/TikTok.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/TikTok.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/Twitter.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Twitter.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/WeChat.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/WeChat.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/XiaoMi.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/XiaoMi.mrs> | Mihomo `behavior: domain` 的 MRS Provider |
| `mihomo/domain/YouTube.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/YouTube.mrs> | Mihomo `behavior: domain` 的 MRS Provider |

### Mihomo ipcidr Provider

| 文件 | 现成可用的 Raw 地址 | 作用 |
| --- | --- | --- |
| `mihomo/ipcidr/AI.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/AI.mrs> | Mihomo `behavior: ipcidr` 的 MRS Provider |
| `mihomo/ipcidr/Alibaba.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Alibaba.mrs> | Mihomo `behavior: ipcidr` 的 MRS Provider |
| `mihomo/ipcidr/Apple.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Apple.mrs> | Mihomo `behavior: ipcidr` 的 MRS Provider |
| `mihomo/ipcidr/BiliBili.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/BiliBili.mrs> | Mihomo `behavior: ipcidr` 的 MRS Provider |
| `mihomo/ipcidr/ChinaMax.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/ChinaMax.mrs> | Mihomo `behavior: ipcidr` 的 MRS Provider |
| `mihomo/ipcidr/ChinaMobile.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/ChinaMobile.mrs> | Mihomo `behavior: ipcidr` 的 MRS Provider |
| `mihomo/ipcidr/Global.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Global.mrs> | Mihomo `behavior: ipcidr` 的 MRS Provider |
| `mihomo/ipcidr/Google.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Google.mrs> | Mihomo `behavior: ipcidr` 的 MRS Provider |
| `mihomo/ipcidr/KugouKuwo.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/KugouKuwo.mrs> | Mihomo `behavior: ipcidr` 的 MRS Provider |
| `mihomo/ipcidr/NetEase.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/NetEase.mrs> | Mihomo `behavior: ipcidr` 的 MRS Provider |
| `mihomo/ipcidr/NetEaseMusic.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/NetEaseMusic.mrs> | Mihomo `behavior: ipcidr` 的 MRS Provider |
| `mihomo/ipcidr/SpeedtestInternational.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/SpeedtestInternational.mrs> | Mihomo `behavior: ipcidr` 的 MRS Provider |
| `mihomo/ipcidr/Telegram.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Telegram.mrs> | Mihomo `behavior: ipcidr` 的 MRS Provider |
| `mihomo/ipcidr/Tencent.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Tencent.mrs> | Mihomo `behavior: ipcidr` 的 MRS Provider |
| `mihomo/ipcidr/Twitter.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Twitter.mrs> | Mihomo `behavior: ipcidr` 的 MRS Provider |
| `mihomo/ipcidr/XiaoMi.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/XiaoMi.mrs> | Mihomo `behavior: ipcidr` 的 MRS Provider |
| `mihomo/ipcidr/YouTube.mrs` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/YouTube.mrs> | Mihomo `behavior: ipcidr` 的 MRS Provider |

### Mihomo classical Provider

| 文件 | 现成可用的 Raw 地址 | 作用 |
| --- | --- | --- |
| `mihomo/classical/AI.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/AI.list> | Mihomo `behavior: classical` 的文本 Provider |
| `mihomo/classical/Apple.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Apple.list> | Mihomo `behavior: classical` 的文本 Provider |
| `mihomo/classical/ChinaASN.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/ChinaASN.list> | Mihomo `behavior: classical` 的文本 Provider |
| `mihomo/classical/ChinaMax.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/ChinaMax.list> | Mihomo `behavior: classical` 的文本 Provider |
| `mihomo/classical/GitHub.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/GitHub.list> | Mihomo `behavior: classical` 的文本 Provider |
| `mihomo/classical/Global.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Global.list> | Mihomo `behavior: classical` 的文本 Provider |
| `mihomo/classical/Google.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Google.list> | Mihomo `behavior: classical` 的文本 Provider |
| `mihomo/classical/Instagram.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Instagram.list> | Mihomo `behavior: classical` 的文本 Provider |
| `mihomo/classical/Microsoft.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Microsoft.list> | Mihomo `behavior: classical` 的文本 Provider |
| `mihomo/classical/Telegram.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Telegram.list> | Mihomo `behavior: classical` 的文本 Provider |
| `mihomo/classical/TestFlight.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/TestFlight.list> | Mihomo `behavior: classical` 的文本 Provider |
| `mihomo/classical/TikTok.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/TikTok.list> | Mihomo `behavior: classical` 的文本 Provider |
| `mihomo/classical/Twitter.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Twitter.list> | Mihomo `behavior: classical` 的文本 Provider |
| `mihomo/classical/WeChat.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/WeChat.list> | Mihomo `behavior: classical` 的文本 Provider |
| `mihomo/classical/YouTube.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/YouTube.list> | Mihomo `behavior: classical` 的文本 Provider |

### Mihomo unsupported 审计

| 文件 | 现成可用的 Raw 地址 | 作用 |
| --- | --- | --- |
| `mihomo/unsupported/Apple.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Apple.list> | 仅用于查看无法自动转换的规则，不应直接启用 |
| `mihomo/unsupported/BiliBili.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/BiliBili.list> | 仅用于查看无法自动转换的规则，不应直接启用 |
| `mihomo/unsupported/ChinaMax.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/ChinaMax.list> | 仅用于查看无法自动转换的规则，不应直接启用 |
| `mihomo/unsupported/Global.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Global.list> | 仅用于查看无法自动转换的规则，不应直接启用 |
| `mihomo/unsupported/Google.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Google.list> | 仅用于查看无法自动转换的规则，不应直接启用 |
| `mihomo/unsupported/Microsoft.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Microsoft.list> | 仅用于查看无法自动转换的规则，不应直接启用 |
| `mihomo/unsupported/NetEaseMusic.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/NetEaseMusic.list> | 仅用于查看无法自动转换的规则，不应直接启用 |
| `mihomo/unsupported/Tencent.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Tencent.list> | 仅用于查看无法自动转换的规则，不应直接启用 |
| `mihomo/unsupported/TikTok.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/TikTok.list> | 仅用于查看无法自动转换的规则，不应直接启用 |
| `mihomo/unsupported/WeChat.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/WeChat.list> | 仅用于查看无法自动转换的规则，不应直接启用 |
| `mihomo/unsupported/YouTube.list` | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/YouTube.list> | 仅用于查看无法自动转换的规则，不应直接启用 |

## 三、常用配置地址

### Loon / Egern 规则

| 规则 | 直接地址 |
| --- | --- |
| AI | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/AI.lsr> |
| Apple | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Apple.lsr> |
| ChinaMax | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaMax.lsr> |
| Global | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Global.lsr> |
| Microsoft | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Microsoft.lsr> |
| Telegram | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Telegram.lsr> |
| YouTube | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/YouTube.lsr> |

### Loon / Egern 图标

| 图标 | 直接地址 |
| --- | --- |
| Global | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Global.png> |
| Proxy | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Proxy.png> |
| Apple | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Apple.png> |
| Microsoft | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Microsoft-5de51988.png> |
| Telegram | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/Telegram.png> |
| YouTube | <https://raw.githubusercontent.com/ClaraCora/ege/main/png/YouTube.png> |

### Mihomo Provider

| Provider | 直接地址 | behavior |
| --- | --- | --- |
| Global 域名 | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Global.mrs> | domain |
| Global IP | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Global.mrs> | ipcidr |
| Global 经典规则 | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Global.list> | classical |
| Microsoft 域名 | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Microsoft.mrs> | domain |
| Apple 域名 | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Apple.mrs> | domain |
| YouTube 域名 | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/YouTube.mrs> | domain |
| 广告规则 | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ads.mrs> | Mihomo 原生 MRS |
| Fake-IP 过滤 | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/fakeip-filter.mrs> | Mihomo 原生 MRS |

## 四、文件和自动化说明

| 路径 | 作用 | 是否自动生成 |
| --- | --- | --- |
| `kelee/` | 保存 `kelee.lsr` 下载的 Loon 规则 | 是 |
| `png/` | 保存 `png.lsr` 下载的 PNG 图标 | 是 |
| `ad/` | 保存 `ad.lsr` 下载的广告资源 | 是 |
| `mihomo/` | 保存 Mihomo 原生资源和 Kelee 转换结果 | 部分 |
| `geo/` | 保存 `geo.lsr` 下载的地理数据库 | 是 |
| `metadata/manifest.json` | 记录来源 URL、目标路径、SHA-256、文件大小和 ETag | 是 |
| `metadata/kelee-mihomo-manifest.json` | 记录 Kelee 规则的分类数量、输出路径和校验值 | 是 |
| `scripts/backup.py` | 下载、校验、保存资源并清理已删除来源的旧文件 | 否 |
| `scripts/convert_kelee.py` | 调用 Mihomo 转换器生成 MRS 和 classical 文件 | 否 |
| `.github/workflows/backup.yml` | 每 12 小时执行备份和转换，有变化才提交 | 否 |

## 五、更新和转换规则

1. 工作流在 UTC `00:17` 和 `12:17` 运行，即北京时间约 `08:17` 和 `20:17`；也可以在 Actions 页面手动运行。
2. 下载失败、空文件、HTML 拦截页、超大响应和错误 PNG 会使本次任务失败，不会覆盖旧文件。
3. Kelee 的 `DOMAIN` 和 `DOMAIN-SUFFIX` 会生成 `mihomo/domain/` 下的 MRS；`IP-CIDR` 和 `IP-CIDR6` 会生成 `mihomo/ipcidr/` 下的 MRS。
4. `DOMAIN-KEYWORD`、`IP-ASN`、`AND`、`OR`、`NOT` 会生成 `mihomo/classical/` 下的文本 Provider。
5. `USER-AGENT` 等无法直接表达的规则只写入 `mihomo/unsupported/` 审计文件，不会自动加入 Mihomo 配置。
6. 资源内容未变化时不会产生新的 Git 提交，但 Actions 运行记录仍会保留。
7. 修改资源来源时只编辑根目录对应的 `.lsr` 文件，不要手动修改自动生成目录。
