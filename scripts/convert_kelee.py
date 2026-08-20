#!/usr/bin/env python3
"""Convert Kelee Loon rules into Mihomo MRS and classical text providers."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "kelee"
OUTPUT_DIR = ROOT / "mihomo"
MANIFEST_PATH = ROOT / "metadata" / "kelee-mihomo-manifest.json"
IP_TYPES = {"IP-CIDR", "IP-CIDR6"}
CLASSICAL_TYPES = {"DOMAIN-KEYWORD", "IP-ASN", "AND", "OR", "NOT"}
UNSUPPORTED_TYPES = {"USER-AGENT"}
RULE_RE = re.compile(r"^\s*([A-Z0-9-]+)\s*,(.*)$")


def parse_rules(path: Path) -> tuple[list[str], list[str], list[str], list[str]]:
    domain: list[str] = []
    ipcidr: list[str] = []
    classical: list[str] = []
    unsupported: list[str] = []
    seen = {"domain": set(), "ipcidr": set(), "classical": set(), "unsupported": set()}

    text = path.read_text(encoding="utf-8-sig")
    for line_number, raw_line in enumerate(text.splitlines(), start=1):
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        match = RULE_RE.match(line)
        if not match:
            unsupported.append(f"line {line_number}: {line}")
            continue
        rule_type, payload = match.groups()
        payload = payload.strip()
        if rule_type == "DOMAIN":
            value = payload.split(",", 1)[0].strip()
            target, bucket = value, domain
        elif rule_type == "DOMAIN-SUFFIX":
            value = payload.split(",", 1)[0].strip()
            target, bucket = "+." + value.lstrip("+."), domain
        elif rule_type in IP_TYPES:
            target, bucket = payload.split(",", 1)[0].strip(), ipcidr
        elif rule_type in CLASSICAL_TYPES:
            target, bucket = line, classical
        elif rule_type in UNSUPPORTED_TYPES:
            target, bucket = line, unsupported
        else:
            target, bucket = line, unsupported
        key = target.lower()
        bucket_name = (
            "domain" if bucket is domain else
            "ipcidr" if bucket is ipcidr else
            "classical" if bucket is classical else
            "unsupported"
        )
        if key not in seen[bucket_name]:
            bucket.append(target)
            seen[bucket_name].add(key)
    return domain, ipcidr, classical, unsupported


def run_converter(binary: Path, behavior: str, source: Path, target: Path) -> None:
    result = subprocess.run(
        [str(binary), "convert-ruleset", behavior, "text", str(source), str(target)],
        capture_output=True,
        text=True,
    )
    if result.returncode:
        raise RuntimeError(
            f"Mihomo conversion failed for {source.name}: "
            f"{result.stderr.strip() or result.stdout.strip()}"
        )


def write_text(path: Path, lines: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mihomo", required=True, type=Path)
    args = parser.parse_args()
    binary = args.mihomo.resolve()
    if not binary.is_file():
        raise RuntimeError(f"Mihomo binary not found: {binary}")

    files = sorted(SOURCE_DIR.glob("*.lsr"))
    if not files:
        raise RuntimeError(f"No source rules found in {SOURCE_DIR}")

    with tempfile.TemporaryDirectory(prefix="kelee-convert-", dir=ROOT) as temp_dir:
        staging = Path(temp_dir) / "mihomo"
        records: list[dict] = []
        for source in files:
            domain, ipcidr, classical, unsupported = parse_rules(source)
            outputs: list[tuple[str, Path]] = []
            if domain:
                text_path = staging / "domain-text" / f"{source.stem}.txt"
                write_text(text_path, domain)
                target = staging / "domain" / f"{source.stem}.mrs"
                target.parent.mkdir(parents=True, exist_ok=True)
                run_converter(binary, "domain", text_path, target)
                outputs.append(("domain", target))
            if ipcidr:
                text_path = staging / "ipcidr-text" / f"{source.stem}.txt"
                write_text(text_path, ipcidr)
                target = staging / "ipcidr" / f"{source.stem}.mrs"
                target.parent.mkdir(parents=True, exist_ok=True)
                run_converter(binary, "ipcidr", text_path, target)
                outputs.append(("ipcidr", target))
            if classical:
                target = staging / "classical" / f"{source.stem}.list"
                write_text(target, classical)
                outputs.append(("classical", target))
            if unsupported:
                target = staging / "unsupported" / f"{source.stem}.list"
                write_text(target, unsupported)
                outputs.append(("unsupported", target))

            records.append(
                {
                    "source": f"kelee/{source.name}",
                    "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
                    "counts": {
                        "domain": len(domain),
                        "ipcidr": len(ipcidr),
                        "classical": len(classical),
                        "unsupported": len(unsupported),
                    },
                    "outputs": [
                        {
                            "behavior": behavior,
                            "path": str(path.relative_to(staging)).replace(os.sep, "/"),
                            "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                            "size": path.stat().st_size,
                        }
                        for behavior, path in outputs
                    ],
                }
            )

        for old_dir in ("domain", "ipcidr", "classical", "unsupported"):
            destination = OUTPUT_DIR / old_dir
            if destination.exists():
                shutil.rmtree(destination)
        for directory in ("domain", "ipcidr", "classical", "unsupported"):
            source_dir = staging / directory
            if source_dir.exists():
                shutil.copytree(source_dir, OUTPUT_DIR / directory)

        MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
        MANIFEST_PATH.write_text(
            json.dumps({"mihomo_version": "v1.19.30", "sources": records}, ensure_ascii=False, indent=2)
            + "\n",
            encoding="utf-8",
            newline="\n",
        )

    print(f"Converted {len(files)} Kelee rule files")
    for record in records:
        counts = record["counts"]
        print(
            f"{record['source']}: domain={counts['domain']} ipcidr={counts['ipcidr']} "
            f"classical={counts['classical']} unsupported={counts['unsupported']}"
        )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}")
        raise SystemExit(1)
