"""Shrink the AlphaBridge showcase screenshots.

The UI is flat-color, so quantizing each PNG to an adaptive 256-color palette
cuts size by ~3-4x with no visible loss. Requires Pillow (`pip install pillow`).

Usage: python3 scripts/compress_alphabridge_screenshots.py [dir]
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image


def compress(directory: Path) -> None:
    for png in sorted(directory.glob("*.png")):
        before = png.stat().st_size
        image = Image.open(png).convert("RGB")
        image.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).save(
            png, optimize=True
        )
        after = png.stat().st_size
        print(f"{png.name}: {before // 1024} KB -> {after // 1024} KB")


if __name__ == "__main__":
    compress(Path(sys.argv[1] if len(sys.argv) > 1 else "assets/images/alphabridge"))
