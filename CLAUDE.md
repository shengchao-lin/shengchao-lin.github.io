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

**Pages:** `index.html`, `about.html`, `research.html`, `projects.html`, `gallery.html`

**Single stylesheet:** `assets/css/style.css` — all styling lives here. Uses CSS custom properties defined at the top of the file:

| Variable | Value | Role |
|---|---|---|
| `--ink` | `#1f2933` | Primary text |
| `--muted` | `#65717f` | Secondary text |
| `--paper` | `#f7f3ec` | Page background |
| `--accent` | `#a64235` | Rust red (links, highlights) |
| `--accent-2` | `#0d6f7c` | Teal (secondary accent) |

Layout uses CSS Grid throughout. Responsive breakpoints are at `820px` and `560px`.

**Static assets:** `assets/images/` (profile photo + 18 gallery photos), `assets/images/alphabridge/play-table.png` (AlphaBridge project card screenshot), `files/Shengchao_Lin_CV.pdf`

## GitHub Actions / Deployment

The workflow at `.github/workflows/pages.yml` runs on push to main/master and on manual dispatch. It needs no secrets:
1. Fatal gate: `scripts/check_internal_links.py` verifies every internal href/src resolves, so internal 404s can never deploy
2. Uploads the repository root and deploys it to GitHub Pages (Settings → Pages → Source must be **GitHub Actions**)

The AlphaBridge project card on `projects.html` is static: a committed screenshot, pastel chips (`.ab-chip*` in `style.css`), and a link to the GitHub repo. Nothing is fetched from the AlphaBridge repository at deploy time.

## Key Conventions

- **No templating:** When adding or changing nav links, footer links, or any shared UI, update every `.html` file — changes do not propagate automatically.
- **No JavaScript.** The site is pure HTML + CSS.
- **Images:** Gallery photos follow the naming pattern `Gallery-1.jpg` through `Gallery-18.jpg`. The gallery page references them by index.
- **CV:** The PDF at `files/Shengchao_Lin_CV.pdf` is linked from `about.html` and the footer of every page.
