# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Shengchao Lin, served as a plain static GitHub Pages site. There is **no build step, no bundler, no Jekyll, and no dependencies** — the `.nojekyll` file disables Jekyll processing so GitHub Pages serves the repository root directly.

## Local Development

Preview the site locally with:

```sh
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/` in a browser. No installation required.

## Architecture

All pages are standalone HTML files in the repo root. Shared structure (header nav, footer) is **manually duplicated** across each file — there is no templating engine or component system.

**Pages:** `index.html`, `about.html`, `research.html`, `projects.html`, `gallery.html`, `betabridge.html` (project showcase)

**Single stylesheet:** `assets/css/style.css` — all styling lives here. Uses CSS custom properties defined at the top of the file:

| Variable | Value | Role |
|---|---|---|
| `--ink` | `#1f2933` | Primary text |
| `--muted` | `#65717f` | Secondary text |
| `--paper` | `#f7f3ec` | Page background |
| `--accent` | `#a64235` | Rust red (links, highlights) |
| `--accent-2` | `#0d6f7c` | Teal (secondary accent) |

Layout uses CSS Grid throughout. Responsive breakpoints are at `820px` and `560px`.

**Static assets:** `assets/images/` (profile photo + 18 gallery photos), `assets/images/betabridge/` (showcase screenshots + demo video, see below), `files/Shengchao_Lin_CV.pdf`

## BetaBridge showcase (`betabridge.html`)

Scroll showcase for the BetaBridge project in a clean, premium product-design style: soft neutral dotted stage, floating window cards bleeding off pastel panels, pastel tag chips, a micro-label stat cluster, and a segmented capacity meter (generic modern-product cues only — no Apple trade dress). The matching project cards on `projects.html` reuse the chip styles. It is the one page with JavaScript (`assets/js/betabridge.js`): scroll reveals, stat counters, in-view video autoplay, and a fetch of `BetaBridge/data/evolution_latest.json` to refresh the baked champion stats. All motion is progressive enhancement — the page is fully readable with JS disabled and respects `prefers-reduced-motion`. Its styles live in the marked "BetaBridge showcase" section at the end of `style.css`.

The screenshots and demo video in `assets/images/betabridge/` are committed fallbacks; the deploy workflow re-captures them from the current BetaBridge UI on every deploy:

```sh
# Regenerate locally (requires Node + playwright with Chromium, and Pillow):
cd ../BetaBridge && python3 main.py playground --no-browser --port 8765 &
node scripts/capture-betabridge-screenshots.mjs
python3 scripts/compress_betabridge_screenshots.py
```

## GitHub Actions / Deployment

The workflow at `.github/workflows/pages.yml` runs on push to main/master, on a weekly cron (so the showcase tracks BetaBridge), on manual dispatch, and on a `repository_dispatch` event of type `betabridge-updated` (fired by BetaBridge's CI after every merge to its main branch, so the showcase refreshes immediately):
1. Clones the separate BetaBridge repository (requires `GH_PAT` secret)
2. Runs BetaBridge's `scripts/build_site.py` to build the read-only static subsite (with `data/` JSON artifacts) into `/BetaBridge/`
3. Bakes live champion stats into `betabridge.html` from the freshly built `BetaBridge/data/evolution_latest.json` (`scripts/bake_betabridge_stats.py`) — the committed numbers are placeholders, never hand-maintained facts
4. Best-effort: serves the cloned engine locally, re-captures the showcase screenshots/demo video from the live UI, and compresses them (falls back to the committed assets on failure)
5. Fatal gate: `scripts/check_internal_links.py` verifies every internal href/src across the built site (subsite included) resolves, so internal 404s can never deploy
6. Deploys the combined result to GitHub Pages

The `/BetaBridge/` directory is gitignored — it exists only inside the deploy artifact. Note: `play.html` in the subsite needs the Python backend and stays non-interactive when hosted statically; the showcase page is the public face of the project, and the subsite's dashboard/agreements pages work read-only from the data snapshots.

When editing the workflow or adding new external repo integrations, note this `GH_PAT` dependency.

## Key Conventions

- **No templating:** When adding or changing nav links, footer links, or any shared UI, update every `.html` file — changes do not propagate automatically.
- **No JavaScript** outside the BetaBridge showcase: `assets/js/betabridge.js` is the sanctioned exception (animation + live artifacts, progressive enhancement only). Don't add JS elsewhere without a strong reason.
- **Images:** Gallery photos follow the naming pattern `Gallery-1.jpg` through `Gallery-18.jpg`. The gallery page references them by index.
- **CV:** The PDF at `files/Shengchao_Lin_CV.pdf` is linked from `about.html` and the footer of every page.
