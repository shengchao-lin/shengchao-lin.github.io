"""Bake live champion stats into alphabridge.html at deploy time.

The numbers in the showcase (champion fitness, genome size, evolved rule
count, rule capacity) drift as evolution runs. The committed HTML holds
placeholder values; the deploy workflow runs this script after building the
AlphaBridge subsite so every deploy ships numbers computed from the actual
`AlphaBridge/data/evolution_latest.json` artifact. The page's JS re-fetches the
same JSON at view time as a second freshness layer.

Stdlib only. Exits 0 with a warning (placeholders stay) if the data is
missing or oddly shaped; exits 1 only on real errors.

Usage: python3 scripts/bake_alphabridge_stats.py [--data AlphaBridge/data/evolution_latest.json] [--page alphabridge.html]
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


def extract_stats(data: dict) -> dict | None:
    best = (data.get("evolution") or {}).get("best_candidate") or {}
    phenotype = best.get("phenotype") or {}
    fitness = best.get("fitness")
    genome = best.get("genome") or []
    active = phenotype.get("rule_count_active")
    capacity = phenotype.get("rule_capacity")
    if not isinstance(fitness, (int, float)) or not genome or not active or not capacity:
        return None
    return {
        "fitness": round(float(fitness), 1),
        "genome": len(genome),
        "rules": int(active),
        "capacity": int(capacity),
    }


def bake(page: Path, stats: dict) -> str:
    html = page.read_text(encoding="utf-8")
    pct = round(stats["rules"] / stats["capacity"] * 100, 1)

    def stat(name: str, value, decimals: int = 0) -> None:
        nonlocal html
        text = f"{value:.{decimals}f}" if decimals else str(value)
        pattern = rf'(data-stat="{name}" data-count-to=")[^"]*("(?: data-decimals="\d+")?>)[^<]*(</strong>)'
        html, n = re.subn(pattern, rf"\g<1>{text}\g<2>{text}\g<3>", html)
        if n == 0:
            raise SystemExit(f"placeholder for stat '{name}' not found in {page}")

    stat("fitness", stats["fitness"], decimals=1)
    stat("genome", stats["genome"])
    stat("rules", stats["rules"])

    html = re.sub(r"(<span data-stat-capacity>)[^<]*(</span>)", rf"\g<1>{stats['capacity']}\g<2>", html)
    html = re.sub(r"(<b data-ab-meter>)[^<]*(</b>)", rf"\g<1>{stats['rules']}\g<2>", html)
    html = re.sub(r"--ab-seg:\s*\d+", f"--ab-seg:{stats['capacity']}", html)
    html = re.sub(r"--fill:\s*[\d.]+%", f"--fill:{pct}%", html)
    html = re.sub(
        r'aria-label="\d+ of \d+ rule slots in use"',
        f'aria-label="{stats["rules"]} of {stats["capacity"]} rule slots in use"',
        html,
    )
    page.write_text(html, encoding="utf-8")
    return f"baked: fitness={stats['fitness']} genome={stats['genome']} rules={stats['rules']}/{stats['capacity']} fill={pct}%"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--data", default="AlphaBridge/data/evolution_latest.json")
    parser.add_argument("--page", default="alphabridge.html")
    args = parser.parse_args()

    data_path = Path(args.data)
    if not data_path.exists():
        print(f"warning: {data_path} not found; keeping committed placeholder stats", file=sys.stderr)
        return 0
    try:
        stats = extract_stats(json.loads(data_path.read_text(encoding="utf-8")))
    except (json.JSONDecodeError, OSError) as exc:
        print(f"warning: could not read {data_path} ({exc}); keeping placeholders", file=sys.stderr)
        return 0
    if stats is None:
        print(f"warning: {data_path} has no usable champion stats; keeping placeholders", file=sys.stderr)
        return 0

    print(bake(Path(args.page), stats))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
