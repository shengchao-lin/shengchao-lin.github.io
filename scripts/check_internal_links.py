"""Verify every internal link/asset in the built site resolves to a real file.

Scans all .html files under the site root (including the generated
/AlphaBridge/ subsite) for href/src/poster targets and fails (exit 1) if any
internal target is missing — so a deploy can never ship internal 404s like an
unshipped subsite page. External (http/https/mailto/tel), fragment-only, and
data: URLs are ignored. Stdlib only.

Usage: python3 scripts/check_internal_links.py [site_root]
"""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

SKIP_DIRS = {".git", ".github", "node_modules", ".claude"}
ATTR_RE = re.compile(r"""(?:href|src|poster)\s*=\s*["']([^"']+)["']""", re.IGNORECASE)


def iter_html_files(root: Path):
    for path in root.rglob("*.html"):
        if not any(part in SKIP_DIRS for part in path.parts):
            yield path


def target_exists(root: Path, page: Path, raw: str) -> bool:
    parts = urlsplit(raw)
    if parts.scheme or parts.netloc:  # external / protocol-relative
        return True
    path = parts.path
    if not path:  # pure fragment or query
        return True
    base = root if path.startswith("/") else page.parent
    resolved = (base / path.lstrip("/")).resolve()
    if path.endswith("/"):
        return (resolved / "index.html").exists() or resolved.is_dir()
    return resolved.exists() or (resolved / "index.html").exists()


def main() -> int:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    missing: list[tuple[Path, str]] = []
    pages = 0
    links = 0
    for page in iter_html_files(root):
        pages += 1
        for raw in ATTR_RE.findall(page.read_text(encoding="utf-8", errors="replace")):
            links += 1
            if not target_exists(root, page, raw):
                missing.append((page.relative_to(root), raw))

    if missing:
        print(f"BROKEN INTERNAL LINKS ({len(missing)}):")
        for page, raw in missing:
            print(f"  {page}: {raw}")
        return 1
    print(f"link check OK: {links} links across {pages} pages")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
