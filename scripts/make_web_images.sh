#!/bin/sh
# Build web-sized copies of the site photos into assets/images/web/.
#
# The originals in assets/images/ are full camera exports (3-23 MB each) and
# must never be referenced directly by a page. This script writes resized
# JPEGs at 800, 1600 and 2400 px on the long edge, which the HTML serves via
# srcset. Re-run it after adding or replacing a photo. macOS only (uses sips).
#
# Usage: sh scripts/make_web_images.sh

set -eu
cd "$(dirname "$0")/.."

src=assets/images
out=assets/images/web
mkdir -p "$out"

for f in "$src"/Gallery-*.jpg "$src"/Me-1.jpg; do
  name=$(basename "$f" .jpg)
  for w in 800 1600 2400; do
    dest="$out/$name-$w.jpg"
    if [ ! -f "$dest" ] || [ "$f" -nt "$dest" ]; then
      sips -Z "$w" -s format jpeg -s formatOptions 76 "$f" --out "$dest" >/dev/null
      echo "wrote $dest"
    fi
  done
done
