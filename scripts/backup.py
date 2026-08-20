#!/usr/bin/env python3
"""Download the resources listed in the repository's URL indexes."""

from __future__ import annotations

import hashlib
import json
import os
import tempfile
import time
from collections import Counter
from pathlib import Path, PurePosixPath
from urllib.error import HTTPError, URLError
from urllib.parse import unquote, urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
USER_AGENT = "Loon/975 CFNetwork/3860.700.1 Darwin/25.6.0"
LIST_NAMES = ("kelee", "png", "ad", "mihomo", "geo")
STATE_PATH = ROOT / "metadata" / "manifest.json"
MAX_DOWNLOAD_BYTES = 50 * 1024 * 1024
RETRY_DELAYS = (1, 3, 8)
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
BLOCK_PAGE_MARKERS = (
    b"<!doctype html",
    b"<html",
    b"attention required",
    b"you have been blocked",
)


def read_urls(list_path: Path) -> list[str]:
    """Read and validate one URL index, preserving its order."""
    try:
        text = list_path.read_text(encoding="utf-8-sig")
    except UnicodeDecodeError as exc:
        raise RuntimeError(f"{list_path.name} is not valid UTF-8") from exc

    urls: list[str] = []
    seen: set[str] = set()
    for line_number, line in enumerate(text.splitlines(), start=1):
        value = line.strip()
        if not value or value.startswith("#"):
            continue
        parsed = urlparse(value)
        if parsed.scheme != "https" or not parsed.netloc:
            raise RuntimeError(
                f"{list_path.name}:{line_number} must contain an HTTPS URL: {value}"
            )
        if value not in seen:
            urls.append(value)
            seen.add(value)
    if not urls:
        raise RuntimeError(f"{list_path.name} does not contain any URLs")
    return urls


def filename_from_url(url: str) -> str:
    path_name = unquote(PurePosixPath(urlparse(url).path).name)
    if not path_name or path_name in {".", ".."} or "/" in path_name or "\\" in path_name:
        raise RuntimeError(f"URL does not contain a safe filename: {url}")
    if any(ord(character) < 32 for character in path_name):
        raise RuntimeError(f"URL contains an invalid filename: {url}")
    return path_name


def destination_paths(name: str, urls: list[str]) -> list[tuple[str, str]]:
    """Return (URL, repository path), adding a stable suffix on collisions."""
    names = [filename_from_url(url) for url in urls]
    # Treat filenames case-insensitively so the same indexes work on Windows.
    counts = Counter(filename.casefold() for filename in names)
    destinations: list[tuple[str, str]] = []
    for url, filename in zip(urls, names):
        if counts[filename.casefold()] > 1:
            stem, extension = os.path.splitext(filename)
            suffix = hashlib.sha256(url.encode("utf-8")).hexdigest()[:8]
            filename = f"{stem}-{suffix}{extension}"
        destinations.append((url, f"{name}/{filename}"))
    return destinations


def download(url: str) -> tuple[bytes, str | None]:
    last_error: Exception | None = None
    for attempt, delay in enumerate((*RETRY_DELAYS, None), start=1):
        try:
            request = Request(
                url,
                headers={
                    "Accept": "*/*",
                    "User-Agent": USER_AGENT,
                },
            )
            with urlopen(request, timeout=45) as response:
                status = getattr(response, "status", 200)
                if status < 200 or status >= 300:
                    raise RuntimeError(f"HTTP {status}")
                data = response.read(MAX_DOWNLOAD_BYTES + 1)
                if len(data) > MAX_DOWNLOAD_BYTES:
                    raise RuntimeError(f"response exceeds {MAX_DOWNLOAD_BYTES} bytes")
                return data, response.headers.get("ETag")
        except HTTPError as exc:
            last_error = RuntimeError(f"HTTP {exc.code}")
        except (OSError, URLError, RuntimeError) as exc:
            last_error = exc

        if delay is not None:
            print(f"  attempt {attempt} failed ({last_error}); retrying in {delay}s")
            time.sleep(delay)
    raise RuntimeError(f"download failed for {url}: {last_error}")


def validate_content(path: str, data: bytes) -> None:
    if not data:
        raise RuntimeError(f"{path} is empty")

    sample = data[:4096].lower()
    if any(marker in sample for marker in BLOCK_PAGE_MARKERS):
        raise RuntimeError(f"{path} looks like an HTML/block page")

    extension = Path(path).suffix.lower()
    if extension == ".png":
        if not data.startswith(PNG_SIGNATURE):
            raise RuntimeError(f"{path} is not a valid PNG")
        return

    if extension in {".lsr", ".list", ".yaml", ".yml", ".txt"}:
        try:
            data.decode("utf-8-sig")
        except UnicodeDecodeError as exc:
            raise RuntimeError(f"{path} is not valid UTF-8") from exc


def load_manifest() -> dict:
    if not STATE_PATH.exists():
        return {"user_agent": USER_AGENT, "resources": []}
    try:
        value = json.loads(STATE_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"cannot read {STATE_PATH}: {exc}") from exc
    if not isinstance(value, dict) or not isinstance(value.get("resources"), list):
        raise RuntimeError(f"invalid manifest format in {STATE_PATH}")
    return value


def write_json_atomic(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        mode="w", encoding="utf-8", dir=path.parent, delete=False
    ) as handle:
        json.dump(value, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
        temporary = Path(handle.name)
    os.replace(temporary, path)


def main() -> int:
    all_entries: list[tuple[str, str, str]] = []
    for name in LIST_NAMES:
        urls = read_urls(ROOT / f"{name}.lsr")
        all_entries.extend((name, url, path) for url, path in destination_paths(name, urls))
        print(f"{name}.lsr: {len(urls)} URLs")

    previous_manifest = load_manifest()
    previous_paths = {
        item.get("path")
        for item in previous_manifest.get("resources", [])
        if isinstance(item, dict) and isinstance(item.get("path"), str)
    }

    new_resources: list[dict] = []
    total_bytes = 0
    with tempfile.TemporaryDirectory(prefix="resource-backup-", dir=ROOT) as temporary_dir:
        staging = Path(temporary_dir)
        for index, (list_name, url, repository_path) in enumerate(all_entries, start=1):
            print(f"[{index}/{len(all_entries)}] {url}")
            data, etag = download(url)
            validate_content(repository_path, data)
            staged_path = staging / repository_path
            staged_path.parent.mkdir(parents=True, exist_ok=True)
            staged_path.write_bytes(data)
            digest = hashlib.sha256(data).hexdigest()
            new_resources.append(
                {
                    "list": f"{list_name}.lsr",
                    "url": url,
                    "path": repository_path,
                    "sha256": digest,
                    "size": len(data),
                    **({"etag": etag} if etag else {}),
                }
            )
            total_bytes += len(data)

        new_resources.sort(key=lambda item: item["path"])
        new_manifest = {"user_agent": USER_AGENT, "resources": new_resources}

        for item in new_resources:
            destination = ROOT / item["path"]
            destination.parent.mkdir(parents=True, exist_ok=True)
            os.replace(staging / item["path"], destination)

        current_paths = {item["path"] for item in new_resources}
        for old_path in previous_paths - current_paths:
            old_parts = PurePosixPath(old_path).parts
            if len(old_parts) == 2 and old_parts[0] in LIST_NAMES:
                old_file = ROOT / old_path
                if old_file.is_file():
                    old_file.unlink()

        write_json_atomic(STATE_PATH, new_manifest)

    print(f"Synced {len(new_resources)} resources ({total_bytes} bytes)")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}")
        raise SystemExit(1)
