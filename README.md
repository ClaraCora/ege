# ege 资源备份仓库

本仓库用于集中备份 Loon、Egern 和 Mihomo 使用的远程资源。GitHub Actions 每 12 小时读取根目录下的 URL 清单，使用 Loon 的请求 User-Agent 下载资源、校验内容，并在资源发生变化时自动提交到 `main` 分支。

请求 User-Agent：

```text
Loon/975 CFNetwork/3860.700.1 Darwin/25.6.0
```

仓库地址：<https://github.com/ClaraCora/ege>

## 一、直接引用地址

以下地址使用 GitHub Raw 服务，适合直接填入客户端配置。表中的 `main` 是当前稳定分支；如果需要固定到某个版本，可以把 `main` 替换为具体提交 ID。

| 资源用途 | 仓库文件 | Raw 引用地址 | 适用场景 |
| --- | --- | --- | --- |
| Kelee 源 URL 清单 | [`kelee.lsr`](kelee.lsr) | <https://raw.githubusercontent.com/ClaraCora/ege/main/kelee.lsr> | 查看或维护 Kelee 规则的来源列表，不建议客户端直接把它当作单个规则集使用 |
| Kelee Loon 规则 | `kelee/<名称>.lsr` | `https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/<名称>.lsr` | Loon、Egern 直接引用；例如 [`kelee/Global.lsr`](kelee/Global.lsr) |
| PNG 图标清单 | [`png.lsr`](png.lsr) | <https://raw.githubusercontent.com/ClaraCora/ege/main/png.lsr> | 查看或维护图标来源列表 |
| PNG 图标文件 | `png/<名称>.png` | `https://raw.githubusercontent.com/ClaraCora/ege/main/png/<名称>.png` | Loon、Egern 分组图标；例如 [`png/Global.png`](png/Global.png) |
| 广告资源清单 | [`ad.lsr`](ad.lsr) | <https://raw.githubusercontent.com/ClaraCora/ege/main/ad.lsr> | 查看或维护广告规则来源列表 |
| 广告规则文件 | `ad/<文件名>` | `https://raw.githubusercontent.com/ClaraCora/ege/main/ad/<文件名>` | Loon、Egern 或其他支持对应格式的客户端；例如 [`ad/Advertising.list`](ad/Advertising.list) |
| Mihomo 外部资源清单 | [`mihomo.lsr`](mihomo.lsr) | <https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo.lsr> | 查看或维护 Mihomo 外部资源来源列表 |
| Mihomo 直接镜像资源 | `mihomo/<文件名>` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/<文件名>` | 直接引用原本就是 Mihomo 格式的资源，例如 [`mihomo/proxy.mrs`](mihomo/proxy.mrs) |
| Kelee 转换后的域名规则 | `mihomo/domain/<名称>.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/<名称>.mrs` | Mihomo `behavior: domain` Provider；例如 [`mihomo/domain/Global.mrs`](mihomo/domain/Global.mrs) |
| Kelee 转换后的 IP 规则 | `mihomo/ipcidr/<名称>.mrs` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/<名称>.mrs` | Mihomo `behavior: ipcidr` Provider；例如 [`mihomo/ipcidr/Global.mrs`](mihomo/ipcidr/Global.mrs) |
| Kelee 转换后的经典规则 | `mihomo/classical/<名称>.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/<名称>.list` | Mihomo `behavior: classical` Provider；例如 [`mihomo/classical/Global.list`](mihomo/classical/Global.list) |
| 暂不支持的规则审计 | `mihomo/unsupported/<名称>.list` | `https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/unsupported/<名称>.list` | 仅用于查看转换遗漏，不会被自动启用；常见类型包括 `USER-AGENT` |
| 地理数据库清单 | [`geo.lsr`](geo.lsr) | <https://raw.githubusercontent.com/ClaraCora/ege/main/geo.lsr> | 查看或维护 GeoIP、GeoSite、MMDB 来源列表 |
| 地理数据库文件 | `geo/<文件名>` | `https://raw.githubusercontent.com/ClaraCora/ege/main/geo/<文件名>` | Mihomo、Loon 或其他支持对应数据库格式的客户端；例如 [`geo/geosite.dat`](geo/geosite.dat) |

### 常用引用示例

```text
# Loon / Egern 规则
https://raw.githubusercontent.com/ClaraCora/ege/main/kelee/Global.lsr

# Loon / Egern 图标
https://raw.githubusercontent.com/ClaraCora/ege/main/png/Global.png

# Mihomo MRS Provider
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/domain/Global.mrs
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/ipcidr/Global.mrs

# Mihomo Classical Provider
https://raw.githubusercontent.com/ClaraCora/ege/main/mihomo/classical/Global.list
```

## 二、仓库文件索引

| 路径 | 类型 | 是否自动生成 | 作用 |
| --- | --- | --- | --- |
| `kelee.lsr` | URL 清单 | 否 | 列出需要备份的 Kelee Loon 规则地址；每行一个 HTTPS URL |
| `png.lsr` | URL 清单 | 否 | 列出需要备份的 PNG 图标地址 |
| `ad.lsr` | URL 清单 | 否 | 列出需要备份的广告规则地址 |
| `mihomo.lsr` | URL 清单 | 否 | 列出需要备份的 Mihomo 原生资源地址；不再包含不稳定的 `cnsub.lkany.com` OneDrive 资源 |
| `geo.lsr` | URL 清单 | 否 | 列出需要备份的 GeoIP、GeoSite 和 MMDB 地址 |
| `kelee/` | Loon 规则目录 | 是 | 保存 `kelee.lsr` 下载的 `.lsr` 文件，文件名取自 URL 路径 |
| `png/` | 图标目录 | 是 | 保存 `png.lsr` 下载的 `.png` 图标 |
| `ad/` | 广告规则目录 | 是 | 保存 `ad.lsr` 下载的规则文件 |
| `mihomo/` | Mihomo 资源目录 | 部分 | 保存 `mihomo.lsr` 的原生资源，以及 Kelee 转换生成的 Provider |
| `mihomo/domain/` | MRS Provider | 是 | Kelee 中可转换为域名行为的规则 |
| `mihomo/ipcidr/` | MRS Provider | 是 | Kelee 中可转换为 IP-CIDR 行为的规则 |
| `mihomo/classical/` | Classical Provider | 是 | Mihomo 没有独立 MRS 行为、但可用经典格式表达的规则 |
| `mihomo/unsupported/` | 审计报告 | 是 | 记录无法安全转换的规则，供人工评估，不会自动加入配置 |
| `geo/` | 地理数据库目录 | 是 | 保存 `geo.lsr` 下载的 `.dat` 和 `.mmdb` 文件 |
| `metadata/manifest.json` | 下载清单 | 是 | 记录每个下载文件的来源 URL、目标路径、SHA-256、大小和 ETag，用于校验和清理旧文件 |
| `metadata/kelee-mihomo-manifest.json` | 转换清单 | 是 | 记录每个 Kelee 文件的规则数量、转换类型、输出路径和校验值 |
| `scripts/backup.py` | Python 脚本 | 否 | 读取五个 `.lsr` 清单、下载资源、校验内容、写入备份目录和 `manifest.json` |
| `scripts/convert_kelee.py` | Python 脚本 | 否 | 调用 Mihomo `convert-ruleset`，生成 `domain`、`ipcidr`、`classical` 和 `unsupported` 输出 |
| `.github/workflows/backup.yml` | GitHub Actions 工作流 | 否 | 定时执行备份、安装 Mihomo 转换器，并在有变化时提交回仓库 |
| `README.md` | 文档 | 否 | 说明目录结构、引用地址和自动化流程 |

## 三、自动更新流程

| 阶段 | 执行内容 | 结果 |
| --- | --- | --- |
| 1. 读取清单 | 读取 `kelee.lsr`、`png.lsr`、`ad.lsr`、`mihomo.lsr`、`geo.lsr` | 忽略空行和 `#` 注释，要求每行是 HTTPS 地址 |
| 2. 下载与校验 | 使用 Loon UA 下载，最多重试三次 | 拒绝空文件、HTML 拦截页、超大响应和错误 PNG |
| 3. 保存镜像 | 按清单名称写入 `kelee/`、`png/`、`ad/`、`mihomo/`、`geo/` | 同名文件会根据 URL 添加稳定哈希后缀，避免覆盖 |
| 4. 转换 Kelee | 下载 Mihomo `v1.19.30` 转换器并运行 `convert_kelee.py` | 生成可供 Mihomo 使用的 `.mrs` 和 `.list` |
| 5. 提交变化 | 比较工作区是否有变化 | 有变化才由 `github-actions[bot]` 提交并推送；无变化显示 `No resource changes` |

工作流触发时间为 UTC `00:17` 和 `12:17`，即北京时间约 `08:17` 和 `20:17`。也可以在仓库的 **Actions → Backup listed resources → Run workflow** 手动执行。

## 四、转换规则说明

Kelee 规则会按类型拆分：

- `DOMAIN`、`DOMAIN-SUFFIX` → `mihomo/domain/<名称>.mrs`
- `IP-CIDR`、`IP-CIDR6` → `mihomo/ipcidr/<名称>.mrs`
- `DOMAIN-KEYWORD`、`IP-ASN`、`AND`、`OR`、`NOT` → `mihomo/classical/<名称>.list`
- `USER-AGENT` 以及其他无法直接表达的类型 → `mihomo/unsupported/<名称>.list`

`unsupported` 目录是审计用途，不应直接加入 Mihomo 配置。需要保留 `USER-AGENT` 语义时，应在 Mihomo 配置中使用等价的 `PROCESS-NAME`、域名规则或其他客户端支持的匹配方式单独补充。

## 五、维护约定

1. 修改源地址时只编辑根目录对应的 `.lsr` 文件，不要手动修改自动生成目录。
2. 资源文件名来自 URL 的最后一段；如果多个 URL 文件名相同，脚本会自动追加八位 URL 哈希。
3. 删除源地址后，下一次运行会根据 `manifest.json` 清理对应的旧备份文件。
4. 资源内容未变化时不会产生新的 Git 提交，Actions 的运行记录仍会保留。
5. 引用客户端资源时优先使用具体文件的 Raw 地址，不要引用 `.lsr` 清单本身，除非客户端明确支持该清单格式。
