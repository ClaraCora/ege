"""Exercise backup outages without using the network or repository resources."""

import contextlib
import hashlib
import io
import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from scripts import backup


class BackupOutageTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name)
        self.manifest = self.root / "metadata/manifest.json"
        self.urls = ["https://example.com/AI.lsr", "https://example.com/Other.lsr"]
        self.paths = ["kelee/AI.lsr", "kelee/Other.lsr"]
        (self.root / "kelee.lsr").write_text("\n".join(self.urls), encoding="utf-8")
        self.original = b"DOMAIN,old.example.com\n"
        records = []
        for url, path in zip(self.urls, self.paths):
            destination = self.root / path
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(self.original)
            records.append({
                "list": "kelee.lsr", "url": url, "path": path,
                "sha256": hashlib.sha256(self.original).hexdigest(),
                "size": len(self.original), "etag": '"old"',
            })
        backup.write_json_atomic(self.manifest, {"resources": records})
        for name, value in (
            ("ROOT", self.root), ("STATE_PATH", self.manifest), ("LIST_NAMES", ("kelee",)),
        ):
            patcher = patch.object(backup, name, value)
            patcher.start()
            self.addCleanup(patcher.stop)
        patcher = patch.dict(os.environ, {
            "GITHUB_ACTIONS": "true",
            "GITHUB_STEP_SUMMARY": str(self.root / "summary.md"),
        })
        patcher.start()
        self.addCleanup(patcher.stop)
        self.output = io.StringIO()

    def run_backup(self, broken=True, invalid_response=False):
        def download(url):
            if url == self.urls[0]:
                if invalid_response:
                    return b"<html>blocked</html>", None
                if broken:
                    raise RuntimeError("DNS lookup failed")
            return b"DOMAIN,new.example.com\n", '"new"'

        with patch.object(backup, "download", side_effect=download):
            with contextlib.redirect_stdout(self.output):
                return backup.main()

    def assert_aborted_without_changes(self):
        manifest_before = self.manifest.read_bytes()
        other_before = (self.root / self.paths[1]).read_bytes()
        with self.assertRaisesRegex(RuntimeError, "no files were modified"):
            self.run_backup()
        self.assertEqual(self.manifest.read_bytes(), manifest_before)
        self.assertEqual((self.root / self.paths[1]).read_bytes(), other_before)

    def test_outage_reuses_verified_backup_and_updates_healthy_source(self):
        self.assertEqual(self.run_backup(), 0)
        self.assertEqual((self.root / self.paths[0]).read_bytes(), self.original)
        self.assertEqual((self.root / self.paths[1]).read_bytes(), b"DOMAIN,new.example.com\n")
        records = json.loads(self.manifest.read_text())["resources"]
        self.assertEqual(records[0]["status"], "cached")
        self.assertEqual(records[0]["download_error"], "DNS lookup failed")
        self.assertNotIn("status", records[1])
        self.assertIn("::warning::", self.output.getvalue())
        summary = (self.root / "summary.md").read_text()
        self.assertIn("reused verified backups: 1", summary)
        self.assertIn(self.urls[0], summary)

    def test_tampered_backup_aborts_all_updates(self):
        (self.root / self.paths[0]).write_bytes(b"DOMAIN,tampered.example.com\n")
        self.assert_aborted_without_changes()

    def test_missing_backup_aborts_all_updates(self):
        (self.root / self.paths[0]).unlink()
        self.assert_aborted_without_changes()

    def test_changed_source_cannot_reuse_old_sources_backup(self):
        records = json.loads(self.manifest.read_text())["resources"]
        records[0]["url"] = "https://old.example.com/AI.lsr"
        backup.write_json_atomic(self.manifest, {"resources": records})
        self.assert_aborted_without_changes()

    def test_unrecorded_backup_aborts_all_updates(self):
        self.manifest.write_text('{"resources": []}', encoding="utf-8")
        self.assert_aborted_without_changes()

    def test_invalid_cached_content_is_rejected_even_with_matching_hash(self):
        invalid = b"<html>blocked</html>"
        (self.root / self.paths[0]).write_bytes(invalid)
        records = json.loads(self.manifest.read_text())["resources"]
        records[0].update(sha256=hashlib.sha256(invalid).hexdigest(), size=len(invalid))
        backup.write_json_atomic(self.manifest, {"resources": records})
        self.assert_aborted_without_changes()

    def test_invalid_download_preserves_verified_backup(self):
        self.assertEqual(self.run_backup(invalid_response=True), 0)
        self.assertEqual((self.root / self.paths[0]).read_bytes(), self.original)
        records = json.loads(self.manifest.read_text())["resources"]
        self.assertIn("HTML/block page", records[0]["download_error"])

    def test_recovery_clears_cached_status_and_error(self):
        self.run_backup()
        self.assertEqual(self.run_backup(broken=False), 0)
        records = json.loads(self.manifest.read_text())["resources"]
        self.assertTrue(all("status" not in item and "download_error" not in item for item in records))
        self.assertEqual((self.root / self.paths[0]).read_bytes(), b"DOMAIN,new.example.com\n")


if __name__ == "__main__":
    unittest.main()
