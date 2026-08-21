# ege 资源备份仓库

本仓库用于备份 Loon、Egern 和 Mihomo 使用的远程资源。GitHub Actions 每 12 小时读取根目录的 URL 清单，使用 Loon 的请求 User-Agent 下载资源、校验内容，并在资源发生变化时自动提交到 `main` 分支。

请求 User-Agent：

```text
Loon/975 CFNetwork/3860.700.1 Darwin/25.6.0
```

仓库地址：<https://github.com/ClaraCora/ege>

## 一、根目录清单和地址复制

根目录的 `.lsr` 文件是 GitHub Actions 使用的下载输入清单。客户端通常应该引用后面的具体备份文件，而不是引用清单本身。

| 文件名 | Raw 地址 |
| --- | --- |
| `kelee.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee.lsr` |
| `png.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png.lsr` |
| `ad.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/ad.lsr` |
| `mihomo.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo.lsr` |
| `geo.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/geo.lsr` |

根目录清单一键复制：

```text
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/png.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/ad.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/geo.lsr
```

## 二、可直接使用的资源地址

每张表只有“文件名”和“Raw 地址”两列。链接使用代码格式显示，便于复制；分类下方的代码框可以一键复制整组地址。

### Kelee Loon 规则

| 文件名 | Raw 地址 |
| --- | --- |
| `kelee/AI.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/AI.lsr` |
| `kelee/Alibaba.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Alibaba.lsr` |
| `kelee/Apple.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Apple.lsr` |
| `kelee/Baidu.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Baidu.lsr` |
| `kelee/BiliBili.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/BiliBili.lsr` |
| `kelee/ChinaASN.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaASN.lsr` |
| `kelee/ChinaMax.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaMax.lsr` |
| `kelee/ChinaMobile.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaMobile.lsr` |
| `kelee/ChinaTelecom.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaTelecom.lsr` |
| `kelee/DouYin.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/DouYin.lsr` |
| `kelee/GaoDe.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/GaoDe.lsr` |
| `kelee/GitHub.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/GitHub.lsr` |
| `kelee/Global.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Global.lsr` |
| `kelee/Google.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Google.lsr` |
| `kelee/Instagram.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Instagram.lsr` |
| `kelee/JingDong.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/JingDong.lsr` |
| `kelee/KugouKuwo.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/KugouKuwo.lsr` |
| `kelee/Microsoft.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Microsoft.lsr` |
| `kelee/NetEase.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/NetEase.lsr` |
| `kelee/NetEaseMusic.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/NetEaseMusic.lsr` |
| `kelee/Pinduoduo.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Pinduoduo.lsr` |
| `kelee/SpeedtestInternational.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/SpeedtestInternational.lsr` |
| `kelee/Telegram.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Telegram.lsr` |
| `kelee/Tencent.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Tencent.lsr` |
| `kelee/TestFlight.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/TestFlight.lsr` |
| `kelee/TikTok.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/TikTok.lsr` |
| `kelee/Twitter.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Twitter.lsr` |
| `kelee/WeChat.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/WeChat.lsr` |
| `kelee/XiaoMi.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/XiaoMi.lsr` |
| `kelee/YouTube.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/YouTube.lsr` |

一键复制本组地址：

```text
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/AI.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Alibaba.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Apple.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Baidu.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/BiliBili.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaASN.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaMax.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaMobile.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaTelecom.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/DouYin.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/GaoDe.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/GitHub.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Global.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Google.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Instagram.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/JingDong.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/KugouKuwo.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Microsoft.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/NetEase.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/NetEaseMusic.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Pinduoduo.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/SpeedtestInternational.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Telegram.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Tencent.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/TestFlight.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/TikTok.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Twitter.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/WeChat.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/XiaoMi.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/YouTube.lsr
```

### PNG 图标

| 文件名 | Raw 地址 |
| --- | --- |
| `png/Adblock.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Adblock.png` |
| `png/AI.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/AI.png` |
| `png/Apple.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Apple.png` |
| `png/baidunetdisk(1).png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/baidunetdisk(1).png` |
| `png/bilibili_3.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/bilibili_3.png` |
| `png/ChatGPT.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/ChatGPT.png` |
| `png/China.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/China.png` |
| `png/CN.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/CN.png` |
| `png/dianxin.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/dianxin.png` |
| `png/Emby-0decdc6c.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Emby-0decdc6c.png` |
| `png/Emby-dc841cc2.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Emby-dc841cc2.png` |
| `png/Final.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Final.png` |
| `png/GitHub.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/GitHub.png` |
| `png/Global.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Global.png` |
| `png/Google.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Google.png` |
| `png/Google_Search.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Google_Search.png` |
| `png/HK.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/HK.png` |
| `png/Hong_Kong.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Hong_Kong.png` |
| `png/Instagram-4f81a6f8.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Instagram-4f81a6f8.png` |
| `png/Instagram-533227d7.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Instagram-533227d7.png` |
| `png/Japan.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Japan.png` |
| `png/jingdong.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/jingdong.png` |
| `png/JP.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/JP.png` |
| `png/Korea.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Korea.png` |
| `png/KR.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/KR.png` |
| `png/kugou.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/kugou.png` |
| `png/Macao.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Macao.png` |
| `png/Malaysia.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Malaysia.png` |
| `png/mega.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/mega.png` |
| `png/Microsoft-5de51988.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Microsoft-5de51988.png` |
| `png/Microsoft-d11688b0.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Microsoft-d11688b0.png` |
| `png/MO.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/MO.png` |
| `png/Netease.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Netease.png` |
| `png/Netflix.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Netflix.png` |
| `png/PayPal.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/PayPal.png` |
| `png/pinduoduo.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/pinduoduo.png` |
| `png/Proxy.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Proxy.png` |
| `png/QQ.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/QQ.png` |
| `png/SG.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/SG.png` |
| `png/Singapore.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Singapore.png` |
| `png/Speedtest.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Speedtest.png` |
| `png/Steam.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Steam.png` |
| `png/Taobao.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Taobao.png` |
| `png/Telegram.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Telegram.png` |
| `png/tengxunditu.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/tengxunditu.png` |
| `png/testflight(2).png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/testflight(2).png` |
| `png/TikTok_1.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/TikTok_1.png` |
| `png/TikTok-27034e11.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/TikTok-27034e11.png` |
| `png/TikTok-5f5d2f2c.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/TikTok-5f5d2f2c.png` |
| `png/TW.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/TW.png` |
| `png/Twitter.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Twitter.png` |
| `png/United_States.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/United_States.png` |
| `png/Unlock.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Unlock.png` |
| `png/US.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/US.png` |
| `png/wechat(1).png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/wechat(1).png` |
| `png/yidong(1).png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/yidong(1).png` |
| `png/YouTube.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/YouTube.png` |

一键复制本组地址：

```text
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Adblock.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/AI.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Apple.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/baidunetdisk(1).png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/bilibili_3.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/ChatGPT.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/China.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/CN.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/dianxin.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Emby-0decdc6c.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Emby-dc841cc2.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Final.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/GitHub.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Global.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Google.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Google_Search.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/HK.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Hong_Kong.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Instagram-4f81a6f8.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Instagram-533227d7.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Japan.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/jingdong.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/JP.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Korea.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/KR.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/kugou.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Macao.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Malaysia.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/mega.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Microsoft-5de51988.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Microsoft-d11688b0.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/MO.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Netease.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Netflix.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/PayPal.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/pinduoduo.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Proxy.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/QQ.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/SG.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Singapore.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Speedtest.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Steam.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Taobao.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Telegram.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/tengxunditu.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/testflight(2).png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/TikTok_1.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/TikTok-27034e11.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/TikTok-5f5d2f2c.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/TW.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Twitter.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/United_States.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Unlock.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/US.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/wechat(1).png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/yidong(1).png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/YouTube.png
```

### 广告规则

| 文件名 | Raw 地址 |
| --- | --- |
| `ad/adrules.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/ad/adrules.list` |
| `ad/Ads_AWAvenue.yaml` | `https://raw.githubusercontent.com/ClaraCora/ege/main/ad/Ads_AWAvenue.yaml` |
| `ad/Advertising.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/ad/Advertising.list` |

一键复制本组地址：

```text
https://raw.githubusercontent.com/ClaraCora/ege/main/ad/adrules.list
https://raw.githubusercontent.com/ClaraCora/ege/main/ad/Ads_AWAvenue.yaml
https://raw.githubusercontent.com/ClaraCora/ege/main/ad/Advertising.list
```

### Geo 数据库

| 文件名 | Raw 地址 |
| --- | --- |
| `geo/country.mmdb` | `https://raw.githubusercontent.com/ClaraCora/ege/main/geo/country.mmdb` |
| `geo/geoip.dat` | `https://raw.githubusercontent.com/ClaraCora/ege/main/geo/geoip.dat` |
| `geo/GeoLite2-ASN.mmdb` | `https://raw.githubusercontent.com/ClaraCora/ege/main/geo/GeoLite2-ASN.mmdb` |
| `geo/geosite.dat` | `https://raw.githubusercontent.com/ClaraCora/ege/main/geo/geosite.dat` |

一键复制本组地址：

```text
https://raw.githubusercontent.com/ClaraCora/ege/main/geo/country.mmdb
https://raw.githubusercontent.com/ClaraCora/ege/main/geo/geoip.dat
https://raw.githubusercontent.com/ClaraCora/ege/main/geo/GeoLite2-ASN.mmdb
https://raw.githubusercontent.com/ClaraCora/ege/main/geo/geosite.dat
```

### Mihomo 原生资源

| 文件名 | Raw 地址 |
| --- | --- |
| `mihomo/ads.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ads.mrs` |
| `mihomo/Binance.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Binance.list` |
| `mihomo/Crypto.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Crypto.list` |
| `mihomo/Discord.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Discord.list` |
| `mihomo/Facebook.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Facebook.list` |
| `mihomo/fakeip-filter.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/fakeip-filter.mrs` |
| `mihomo/LinkedIn.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/LinkedIn.list` |
| `mihomo/netflix-2b0a4ed1.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/netflix-2b0a4ed1.mrs` |
| `mihomo/netflix-512b2f11.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/netflix-512b2f11.mrs` |
| `mihomo/OKX.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/OKX.list` |
| `mihomo/PayPal.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/PayPal.list` |
| `mihomo/private-1fa87d08.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/private-1fa87d08.mrs` |
| `mihomo/private-275bfa0d.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/private-275bfa0d.mrs` |
| `mihomo/proxy.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/proxy.mrs` |
| `mihomo/Reddit.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Reddit.list` |
| `mihomo/Steam.yaml` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Steam.yaml` |
| `mihomo/WebRTC.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/WebRTC.list` |

一键复制本组地址：

```text
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ads.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Binance.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Crypto.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Discord.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Facebook.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/fakeip-filter.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/LinkedIn.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/netflix-2b0a4ed1.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/netflix-512b2f11.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/OKX.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/PayPal.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/private-1fa87d08.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/private-275bfa0d.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/proxy.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Reddit.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/Steam.yaml
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/WebRTC.list
```

### Mihomo domain Provider

| 文件名 | Raw 地址 |
| --- | --- |
| `mihomo/domain/AI.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/AI.mrs` |
| `mihomo/domain/Alibaba.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Alibaba.mrs` |
| `mihomo/domain/Apple.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Apple.mrs` |
| `mihomo/domain/Baidu.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Baidu.mrs` |
| `mihomo/domain/BiliBili.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/BiliBili.mrs` |
| `mihomo/domain/ChinaMax.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/ChinaMax.mrs` |
| `mihomo/domain/ChinaMobile.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/ChinaMobile.mrs` |
| `mihomo/domain/ChinaTelecom.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/ChinaTelecom.mrs` |
| `mihomo/domain/DouYin.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/DouYin.mrs` |
| `mihomo/domain/GaoDe.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/GaoDe.mrs` |
| `mihomo/domain/GitHub.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/GitHub.mrs` |
| `mihomo/domain/Global.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Global.mrs` |
| `mihomo/domain/Google.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Google.mrs` |
| `mihomo/domain/Instagram.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Instagram.mrs` |
| `mihomo/domain/JingDong.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/JingDong.mrs` |
| `mihomo/domain/KugouKuwo.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/KugouKuwo.mrs` |
| `mihomo/domain/Microsoft.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Microsoft.mrs` |
| `mihomo/domain/NetEase.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/NetEase.mrs` |
| `mihomo/domain/NetEaseMusic.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/NetEaseMusic.mrs` |
| `mihomo/domain/Pinduoduo.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Pinduoduo.mrs` |
| `mihomo/domain/SpeedtestInternational.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/SpeedtestInternational.mrs` |
| `mihomo/domain/Telegram.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Telegram.mrs` |
| `mihomo/domain/Tencent.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Tencent.mrs` |
| `mihomo/domain/TestFlight.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/TestFlight.mrs` |
| `mihomo/domain/TikTok.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/TikTok.mrs` |
| `mihomo/domain/Twitter.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Twitter.mrs` |
| `mihomo/domain/WeChat.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/WeChat.mrs` |
| `mihomo/domain/XiaoMi.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/XiaoMi.mrs` |
| `mihomo/domain/YouTube.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/YouTube.mrs` |

一键复制本组地址：

```text
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/AI.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Alibaba.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Apple.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Baidu.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/BiliBili.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/ChinaMax.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/ChinaMobile.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/ChinaTelecom.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/DouYin.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/GaoDe.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/GitHub.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Global.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Google.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Instagram.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/JingDong.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/KugouKuwo.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Microsoft.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/NetEase.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/NetEaseMusic.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Pinduoduo.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/SpeedtestInternational.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Telegram.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Tencent.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/TestFlight.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/TikTok.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Twitter.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/WeChat.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/XiaoMi.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/YouTube.mrs
```

### Mihomo ipcidr Provider

| 文件名 | Raw 地址 |
| --- | --- |
| `mihomo/ipcidr/AI.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/AI.mrs` |
| `mihomo/ipcidr/Alibaba.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Alibaba.mrs` |
| `mihomo/ipcidr/Apple.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Apple.mrs` |
| `mihomo/ipcidr/BiliBili.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/BiliBili.mrs` |
| `mihomo/ipcidr/ChinaMax.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/ChinaMax.mrs` |
| `mihomo/ipcidr/ChinaMobile.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/ChinaMobile.mrs` |
| `mihomo/ipcidr/Global.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Global.mrs` |
| `mihomo/ipcidr/Google.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Google.mrs` |
| `mihomo/ipcidr/KugouKuwo.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/KugouKuwo.mrs` |
| `mihomo/ipcidr/NetEase.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/NetEase.mrs` |
| `mihomo/ipcidr/NetEaseMusic.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/NetEaseMusic.mrs` |
| `mihomo/ipcidr/SpeedtestInternational.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/SpeedtestInternational.mrs` |
| `mihomo/ipcidr/Telegram.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Telegram.mrs` |
| `mihomo/ipcidr/Tencent.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Tencent.mrs` |
| `mihomo/ipcidr/Twitter.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Twitter.mrs` |
| `mihomo/ipcidr/XiaoMi.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/XiaoMi.mrs` |
| `mihomo/ipcidr/YouTube.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/YouTube.mrs` |

一键复制本组地址：

```text
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/AI.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Alibaba.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Apple.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/BiliBili.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/ChinaMax.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/ChinaMobile.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Global.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Google.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/KugouKuwo.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/NetEase.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/NetEaseMusic.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/SpeedtestInternational.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Telegram.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Tencent.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Twitter.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/XiaoMi.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/YouTube.mrs
```

### Mihomo classical Provider

| 文件名 | Raw 地址 |
| --- | --- |
| `mihomo/classical/AI.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/AI.list` |
| `mihomo/classical/Apple.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Apple.list` |
| `mihomo/classical/ChinaASN.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/ChinaASN.list` |
| `mihomo/classical/ChinaMax.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/ChinaMax.list` |
| `mihomo/classical/GitHub.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/GitHub.list` |
| `mihomo/classical/Global.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Global.list` |
| `mihomo/classical/Google.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Google.list` |
| `mihomo/classical/Instagram.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Instagram.list` |
| `mihomo/classical/Microsoft.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Microsoft.list` |
| `mihomo/classical/Telegram.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Telegram.list` |
| `mihomo/classical/TestFlight.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/TestFlight.list` |
| `mihomo/classical/TikTok.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/TikTok.list` |
| `mihomo/classical/Twitter.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Twitter.list` |
| `mihomo/classical/WeChat.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/WeChat.list` |
| `mihomo/classical/YouTube.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/YouTube.list` |

一键复制本组地址：

```text
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/AI.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Apple.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/ChinaASN.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/ChinaMax.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/GitHub.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Global.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Google.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Instagram.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Microsoft.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Telegram.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/TestFlight.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/TikTok.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Twitter.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/WeChat.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/YouTube.list
```

### Mihomo unsupported 审计

| 文件名 | Raw 地址 |
| --- | --- |
| `mihomo/unsupported/Apple.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Apple.list` |
| `mihomo/unsupported/BiliBili.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/BiliBili.list` |
| `mihomo/unsupported/ChinaMax.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/ChinaMax.list` |
| `mihomo/unsupported/Global.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Global.list` |
| `mihomo/unsupported/Google.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Google.list` |
| `mihomo/unsupported/Microsoft.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Microsoft.list` |
| `mihomo/unsupported/NetEaseMusic.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/NetEaseMusic.list` |
| `mihomo/unsupported/Tencent.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Tencent.list` |
| `mihomo/unsupported/TikTok.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/TikTok.list` |
| `mihomo/unsupported/WeChat.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/WeChat.list` |
| `mihomo/unsupported/YouTube.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/YouTube.list` |

一键复制本组地址：

```text
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Apple.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/BiliBili.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/ChinaMax.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Global.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Google.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Microsoft.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/NetEaseMusic.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/Tencent.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/TikTok.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/WeChat.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/YouTube.list
```

## 三、常用配置地址

### Loon / Egern 规则

| 文件名 | Raw 地址 |
| --- | --- |
| `kelee/AI.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/AI.lsr` |
| `kelee/Apple.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Apple.lsr` |
| `kelee/ChinaMax.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaMax.lsr` |
| `kelee/Global.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Global.lsr` |
| `kelee/Microsoft.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Microsoft.lsr` |
| `kelee/Telegram.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Telegram.lsr` |
| `kelee/YouTube.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/YouTube.lsr` |

一键复制：

```text
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/AI.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Apple.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/ChinaMax.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Global.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Microsoft.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Telegram.lsr
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/YouTube.lsr
```

### Loon / Egern 图标

| 文件名 | Raw 地址 |
| --- | --- |
| `png/Global.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Global.png` |
| `png/Proxy.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Proxy.png` |
| `png/Apple.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Apple.png` |
| `png/Microsoft-5de51988.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Microsoft-5de51988.png` |
| `png/Telegram.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/Telegram.png` |
| `png/YouTube.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/YouTube.png` |

一键复制：

```text
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Global.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Proxy.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Apple.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Microsoft-5de51988.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Telegram.png
https://raw.githubusercontent.com/ClaraCora/ege/main/png/YouTube.png
```

### Mihomo Provider

| 文件名 | Raw 地址 |
| --- | --- |
| `mihomo/domain/Global.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Global.mrs` |
| `mihomo/ipcidr/Global.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Global.mrs` |
| `mihomo/classical/Global.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Global.list` |
| `mihomo/domain/Microsoft.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Microsoft.mrs` |
| `mihomo/domain/Apple.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Apple.mrs` |
| `mihomo/domain/YouTube.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/YouTube.mrs` |
| `mihomo/ads.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ads.mrs` |
| `mihomo/fakeip-filter.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/fakeip-filter.mrs` |

一键复制：

```text
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Global.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Global.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Global.list
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Microsoft.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Apple.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/YouTube.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ads.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/fakeip-filter.mrs
```

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
