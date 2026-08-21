#!/usr/bin/env python3
"""Render README.md from the resources that actually exist on disk.

The README lists every backed-up file, so maintaining it by hand meant 180+
entries drifting out of sync with the real directories. Generating it keeps the
document honest: whatever the backup produced is exactly what gets documented.

Resources are rendered as compact grids of name links. The raw URL never appears
as visible text — readers copy the link itself.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
README_PATH = ROOT / "README.md"
MANIFEST_PATH = ROOT / "metadata" / "manifest.json"
KELEE_MANIFEST_PATH = ROOT / "metadata" / "kelee-mihomo-manifest.json"

REPO = "ClaraCora/ege"
BRANCH = "main"
RAW_BASE = f"https://raw.githubusercontent.com/{REPO}/{BRANCH}"
USER_AGENT = "Loon/975 CFNetwork/3860.700.1 Darwin/25.6.0"
COLUMNS = 5

# Downloaded resource groups, in the order they appear in the README.
DOWNLOAD_SECTIONS = (
    ("🧩", "Kelee Loon 规则", "kelee", ("*.lsr",)),
    ("🖼️", "PNG 图标", "png", ("*.png",)),
    ("📵", "广告规则", "ad", ("*",)),
    ("🌐", "Geo 数据库", "geo", ("*",)),
    ("⚙️", "Mihomo 原生资源", "mihomo", ("*.mrs", "*.list", "*.yaml")),
)

# Kelee conversion outputs, keyed by the Mihomo behaviour that produced them.
CONVERT_SECTIONS = (
    ("🔤", "Mihomo domain Provider", "mihomo/domain",
     "behavior: domain，来自 `DOMAIN` 和 `DOMAIN-SUFFIX`"),
    ("🔢", "Mihomo ipcidr Provider", "mihomo/ipcidr",
     "behavior: ipcidr，来自 `IP-CIDR` 和 `IP-CIDR6`"),
    ("📄", "Mihomo classical Provider", "mihomo/classical",
     "behavior: classical，来自 `DOMAIN-KEYWORD`、`IP-ASN`、`AND`、`OR`、`NOT`"),
    ("🔍", "Mihomo unsupported 审计", "mihomo/unsupported",
     "无法转换的规则，仅供人工核对，不要作为 Provider 引用"),
)

# Hand-picked entries for the quick-start section, as (label, path) pairs. Labels
# are explicit because this section mixes directories: domain/Global.mrs and
# ipcidr/Global.mrs would otherwise both render as a bare "Global". Paths are
# validated on render so a renamed resource fails loudly instead of shipping a
# dead link.
FEATURED = (
    ("⭐ Loon / Egern 规则", (
        ("AI", "kelee/AI.lsr"),
        ("Apple", "kelee/Apple.lsr"),
        ("ChinaMax", "kelee/ChinaMax.lsr"),
        ("Global", "kelee/Global.lsr"),
        ("Microsoft", "kelee/Microsoft.lsr"),
        ("Telegram", "kelee/Telegram.lsr"),
        ("YouTube", "kelee/YouTube.lsr"),
    )),
    ("⭐ Loon / Egern 图标", (
        ("Global", "png/Global.png"),
        ("Proxy", "png/Proxy.png"),
        ("Apple", "png/Apple.png"),
        ("Microsoft", "png/Microsoft-5de51988.png"),
        ("Telegram", "png/Telegram.png"),
        ("YouTube", "png/YouTube.png"),
    )),
    ("⭐ Mihomo Provider", (
        ("Global (domain)", "mihomo/domain/Global.mrs"),
        ("Global (ipcidr)", "mihomo/ipcidr/Global.mrs"),
        ("Global (classical)", "mihomo/classical/Global.list"),
        ("Microsoft (domain)", "mihomo/domain/Microsoft.mrs"),
        ("Apple (domain)", "mihomo/domain/Apple.mrs"),
        ("YouTube (domain)", "mihomo/domain/YouTube.mrs"),
        ("ads", "mihomo/ads.mrs"),
        ("fakeip-filter", "mihomo/fakeip-filter.mrs"),
    )),
)

ROOT_LISTS = ("kelee.lsr", "png.lsr", "ad.lsr", "mihomo.lsr", "geo.lsr")


def encode_url(path: str) -> str:
    """Percent-encode the characters that would break Markdown link syntax.

    Several icons are named like `baidunetdisk(1).png`; an unescaped `)` ends
    the link target early and corrupts the rest of the table row.
    """
    return f"{RAW_BASE}/{path}".replace("(", "%28").replace(")", "%29")


def collect(directory: str, patterns: tuple[str, ...]) -> list[str]:
    """Return repository-relative paths of files directly inside `directory`."""
    base = ROOT / directory
    if not base.is_dir():
        return []
    found: set[Path] = set()
    for pattern in patterns:
        found.update(item for item in base.glob(pattern) if item.is_file())
    return sorted(f"{directory}/{item.name}" for item in found)


def grid(title: str, entries: list[tuple[str, str]]) -> list[str]:
    """Render (label, path) pairs as a compact titled grid of name links."""
    if not entries:
        return []
    lines = [
        "|" + title + "|" + "  |" * (COLUMNS - 1),
        "|" + " ---- |" * COLUMNS,
    ]
    for start in range(0, len(entries), COLUMNS):
        row = entries[start : start + COLUMNS]
        cells = "".join(f"[{label}]({encode_url(path)}) |" for label, path in row)
        # Pad short rows so every row keeps the declared column count.
        lines.append("|" + cells + "  |" * (COLUMNS - len(row)))
    lines.append("")
    return lines


def labelled(paths: list[str]) -> list[tuple[str, str]]:
    """Label paths by filename stem, for groups sharing a single directory.

    Parentheses in the stem become full-width so a name like `wechat(1)` cannot
    be mistaken for the end of the link text followed by a new link target.
    """
    return [
        (Path(path).stem.replace("(", "（").replace(")", "）"), path)
        for path in paths
    ]


def main() -> int:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    downloaded = len(manifest.get("resources", []))
    kelee_manifest = json.loads(KELEE_MANIFEST_PATH.read_text(encoding="utf-8"))
    mihomo_version = kelee_manifest.get("mihomo_version", "unknown")
    kelee_sources = len(kelee_manifest.get("sources", []))

    download_groups = [
        (emoji, title, collect(directory, patterns))
        for emoji, title, directory, patterns in DOWNLOAD_SECTIONS
    ]
    convert_groups = [
        (emoji, title, note, collect(directory, ("*",)))
        for emoji, title, directory, note in CONVERT_SECTIONS
    ]
    converted = sum(len(paths) for _, _, _, paths in convert_groups)

    missing = [
        path
        for _, entries in FEATURED
        for _, path in entries
        if not (ROOT / path).is_file()
    ]
    if missing:
        raise RuntimeError(
            "常用配置引用了不存在的资源，请更新 FEATURED： " + ", ".join(missing)
        )

    out: list[str] = [
        "# ege 资源备份仓库",
        "",
        f"[![Backup](https://github.com/{REPO}/actions/workflows/backup.yml/badge.svg)]"
        f"(https://github.com/{REPO}/actions/workflows/backup.yml)",
        "",
        "备份 Loon、Egern 和 Mihomo 使用的远程资源。GitHub Actions 每天两次读取根目录的 URL 清单，"
        f"以 Loon 的请求 User-Agent 下载、校验内容，并在资源发生变化时提交回 `{BRANCH}` 分支。",
        "",
        f"当前收录 **{downloaded}** 个下载资源，另由 {kelee_sources} 个 Kelee 规则转换出 "
        f"**{converted}** 个 Mihomo Provider（Mihomo `{mihomo_version}`）。",
        "",
        "| 项目 | 值 |",
        "| --- | --- |",
        f"| 请求 User-Agent | `{USER_AGENT}` |",
        "| 运行时间 | UTC `00:17` / `12:17`（北京时间约 `08:17` / `20:17`） |",
        f"| 仓库地址 | <https://github.com/{REPO}> |",
        "",
        "下表所有条目都是可点击的名称链接，右键复制链接地址即可填入客户端。",
        "",
        "> 本文件由 `scripts/render_readme.py` 依据磁盘上的实际文件生成，请不要手工编辑。",
        "",
        "## 快速开始",
        "",
    ]

    for title, entries in FEATURED:
        out.extend(grid(title, list(entries)))

    out.extend(
        [
            "## 根目录清单",
            "",
            "GitHub Actions 的下载输入清单。客户端应引用下方的具体备份文件，而不是清单本身。",
            "",
        ]
    )
    out.extend(grid("📋 清单文件", labelled(list(ROOT_LISTS))))

    out.extend(
        [
            "## 下载备份",
            "",
            "由 `scripts/backup.py` 按根目录清单下载并校验。",
            "",
        ]
    )
    for emoji, title, paths in download_groups:
        out.extend(grid(f"{emoji} {title}（{len(paths)}）", labelled(paths)))

    out.extend(
        [
            "## Kelee 转换产物",
            "",
            f"由 `scripts/convert_kelee.py` 调用 Mihomo `{mihomo_version}` 从 `kelee/` 生成。",
            "",
        ]
    )
    for emoji, title, note, paths in convert_groups:
        out.extend(grid(f"{emoji} {title}（{len(paths)}）", labelled(paths)))
        out.append(f"{note}。")
        out.append("")

    out.extend(
        [
            "## 目录结构",
            "",
            "| 路径 | 作用 | 自动生成 |",
            "| --- | --- | --- |",
            "| `kelee/` | `kelee.lsr` 下载的 Loon 规则 | 是 |",
            "| `png/` | `png.lsr` 下载的 PNG 图标 | 是 |",
            "| `ad/` | `ad.lsr` 下载的广告资源 | 是 |",
            "| `geo/` | `geo.lsr` 下载的地理数据库 | 是 |",
            "| `mihomo/` | Mihomo 原生资源，以及 Kelee 转换结果子目录 | 是 |",
            "| `metadata/manifest.json` | 来源 URL、目标路径、SHA-256、大小和 ETag | 是 |",
            "| `metadata/kelee-mihomo-manifest.json` | Kelee 规则的分类数量、输出路径和校验值 | 是 |",
            "| `scripts/backup.py` | 下载、校验、保存资源，清理已移除来源的旧文件 | 否 |",
            "| `scripts/convert_kelee.py` | 调用 Mihomo 生成 MRS 和文本 Provider | 否 |",
            "| `scripts/render_readme.py` | 依据磁盘实际文件生成本文件 | 否 |",
            "| `.github/workflows/backup.yml` | 定时执行备份、转换与提交 | 否 |",
            "",
            "## 运行规则",
            "",
            "1. 工作流在 UTC `00:17` 和 `12:17` 运行（北京时间约 `08:17` 和 `20:17`），"
            "也可在 Actions 页面用 **Run workflow** 手动触发。",
            "2. GitHub 的定时调度可能延迟数十分钟，且**不会补跑**错过的时段；需要立刻更新时请手动触发。",
            "3. 下载失败、空文件、HTML 拦截页、超大响应或损坏的 PNG 都会让本次运行失败，"
            "此时不会覆盖任何已有文件——备份要么整体更新，要么保持原样。",
            "4. 单次运行会汇总报告所有失败的资源，而不是遇到第一个错误就停下，便于一次定位全部问题源。",
            "5. Kelee 的 `DOMAIN` 和 `DOMAIN-SUFFIX` 生成 `mihomo/domain/` 下的 MRS；"
            "`IP-CIDR` 和 `IP-CIDR6` 生成 `mihomo/ipcidr/` 下的 MRS。",
            "6. `DOMAIN-KEYWORD`、`IP-ASN`、`AND`、`OR`、`NOT` 生成 `mihomo/classical/` 下的文本 Provider。",
            "7. `USER-AGENT` 等无法表达的规则只写入 `mihomo/unsupported/` 供审计，不要作为 Provider 引用。",
            "8. 资源内容没有变化时不会产生新提交，但 Actions 运行记录仍会保留。",
            "9. 调整资源来源时只编辑根目录对应的 `.lsr` 文件，不要手工修改自动生成的目录。",
            "",
        ]
    )

    README_PATH.write_text("\n".join(out), encoding="utf-8", newline="\n")
    print(f"Rendered README.md: {downloaded} downloaded, {converted} converted")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}")
        raise SystemExit(1)
