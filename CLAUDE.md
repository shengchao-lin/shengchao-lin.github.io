# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Shengchao Lin, built with **Hugo** (extended, version pinned in `.github/workflows/pages.yml`) and deployed to GitHub Pages by GitHub Actions. There are no Node/Ruby dependencies for the site itself. Content lives in Markdown files; shared UI lives in templates.

## Local Development

```sh
hugo server          # http://localhost:1313, live reload
hugo --gc            # production build into public/
python3 -B scripts/check_internal_links.py public   # AlphaBridge/ links fail locally: that subsite is built only in CI
```

The first build takes about a minute to resize the gallery originals; results are cached in `resources/_gen/` (gitignored).

## Architecture

- `hugo.toml` holds the site title, **main nav** (`[menus.main]`, the only place nav links are defined), footer/social links (`params.social`), and `uglyURLs = true`, so pages keep their original `.html` URLs (`/about.html`, `/alphabridge.html`, …). `projects/_index.md` sets `url: /projects.html` explicitly because sections ignore uglyURLs.
- `content/` has one file per page. Structured lists (experience, education, reading-group members/talks, gallery captions, project cards) are in each page's front matter; prose is the Markdown body.
  - `_index.md` + `me.jpg` is the home page bundle (portrait). `gallery/index.md` + `Gallery-*.jpg` is the gallery bundle. Both set `build.publishResources: false`, so only resized WebP copies are published, never the multi-MB originals.
  - `projects/*.md` are card data only (`build.render: never`). `archetypes/projects.md` is the template for `hugo new projects/x.md`.
  - `alphabridge.html` is raw HTML content (allowed via `[security] allowContent`) for the showcase.
- `layouts/`: `baseof.html` (head/header/footer), `home.html`, `page.html`, `section.html` (projects list), and custom layouts `about.html`, `research.html`, `gallery.html`, `showcase.html`. Partials are in `layouts/_partials/`, including `photo.html` (responsive WebP `srcset`) and `timeline.html`.
- `assets/css/main.css` is the single stylesheet, fingerprinted via Hugo Pipes. Color tokens are at the top, and dark mode redefines them under `prefers-color-scheme`. The palette is warm: paper `#f7f0e6`, ink `#2b2320`, terracotta accent `#a94a31`, sage `#56694c`. Headings use Fraunces (serif) and body text uses Inter, both from Google Fonts. Breakpoints are `900px`, `820px` and `560px`.
- `static/` is copied verbatim: `favicon.ico`, `files/Shengchao_Lin_CV.pdf`, `images/alphabridge/` (showcase screenshots + demo video).

## AlphaBridge showcase (`content/alphabridge.html` → `/alphabridge.html`)

Scroll showcase for the AlphaBridge project: dotted paper stage, floating window cards bleeding off pastel panels, pastel tag chips, stat cluster, green felt band, segmented capacity meter. Its colors come from the site tokens, so it follows light/dark mode. The project cards (`layouts/_partials/project-card.html`) reuse the chip styles. It is the one page with JavaScript (`assets/js/alphabridge.js`): scroll reveals, stat counters, in-view video autoplay, and a fetch of `AlphaBridge/data/evolution_latest.json` to refresh the baked stats. All of it is progressive enhancement and respects `prefers-reduced-motion`. Styles live in the marked "AlphaBridge showcase" section at the end of `main.css`. **Keep the `data-stat`/`data-count-to`/`data-ab-meter`/`--ab-seg`/`--fill` markup intact**, because the bake script regexes depend on it (the build must stay unminified).

The screenshots and demo video in `static/images/alphabridge/` are committed fallbacks; the deploy workflow re-captures them from the current AlphaBridge UI on every deploy:

```sh
# Regenerate locally (requires Node + playwright with Chromium, and Pillow):
cd ../AlphaBridge && python3 main.py playground --no-browser --port 8765 &
node scripts/capture-alphabridge-screenshots.mjs
python3 scripts/compress_alphabridge_screenshots.py
```

## GitHub Actions / Deployment

The workflow at `.github/workflows/pages.yml` (Hugo version staged in `ci/pages.yml` until installed; see `ci/README.md`) runs on push to main/master, on a weekly cron (so the showcase tracks AlphaBridge), on manual dispatch, and on a `repository_dispatch` event of type `alphabridge-updated` (fired by AlphaBridge's CI after every merge to its main branch):
1. Clones the separate AlphaBridge repository (requires the `ALPHABRIDGE_REPO_TOKEN` secret)
2. Best-effort: serves the cloned engine locally, re-captures the showcase screenshots/demo video into `static/images/alphabridge/`, and compresses them (falls back to the committed assets on failure)
3. Installs the pinned Hugo extended release, restores the `resources/_gen` image cache, and builds into `public/`
4. Runs AlphaBridge's `scripts/build_site.py` to build the read-only static subsite (with `data/` JSON artifacts) into `public/AlphaBridge/`
5. Bakes live champion stats into `public/alphabridge.html` (`scripts/bake_alphabridge_stats.py`). The numbers in `content/alphabridge.html` are placeholders, never hand-maintained facts
6. Fatal gate: `scripts/check_internal_links.py public` verifies every internal href/src resolves
7. Uploads `public/` and deploys to GitHub Pages

`public/` and `/AlphaBridge/` are gitignored. `play.html` in the subsite needs the Python backend and stays non-interactive when hosted statically.

When editing the workflow or adding new external repo integrations, note the `ALPHABRIDGE_REPO_TOKEN` dependency.

## Key Conventions

- **Content vs. templates:** page text belongs in `content/` (Markdown/front matter), never hard-coded in `layouts/`. Shared UI changes happen once, in `layouts/` or `hugo.toml`.
- **No JavaScript** outside the AlphaBridge showcase: `assets/js/alphabridge.js` is the sanctioned exception (progressive enhancement only). Dark mode is CSS-only.
- **Images:** photos go through Hugo image processing via the `photo.html` partial. Don't reference originals directly. Gallery files are named `Gallery-N.jpg`; the gallery shows only the ones listed in `content/gallery/index.md` (e.g. `Gallery-10.jpg` is in the folder but unlisted).
- **CV:** `static/files/Shengchao_Lin_CV.pdf`, linked from the About page (`params.cv`) and the footer (`params.social`).
