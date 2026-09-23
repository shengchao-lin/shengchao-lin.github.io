# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Shengchao Lin, built with **Hugo** (extended, version pinned in `.github/workflows/pages.yml`) and deployed to GitHub Pages by GitHub Actions. There are no Node/Ruby dependencies for the site itself. Content lives in Markdown files; shared UI lives in templates.

## Local Development

```sh
hugo server          # http://localhost:1313, live reload
hugo --gc            # production build into public/
python3 -B scripts/check_internal_links.py public   # same fatal link check CI runs
```

The first build takes about a minute to resize the gallery originals; results are cached in `resources/_gen/` (gitignored).

## Architecture

- `hugo.toml` holds the site title, **main nav** (`[menus.main]`, the only place nav links are defined), footer/social links (`params.social`), and `uglyURLs = true`, so pages keep their original `.html` URLs (`/about.html`, `/gallery.html`, …). `projects/_index.md` sets `url: /projects.html` explicitly because sections ignore uglyURLs, and aliases the retired `/alphabridge.html` showcase URL to it.
- `content/` has one file per page. Structured lists (experience, education, reading-group members/talks, gallery captions, project cards) are in each page's front matter; prose is the Markdown body.
  - `_index.md` + `me.jpg` is the home page bundle (portrait). `gallery/index.md` + `Gallery-*.jpg` is the gallery bundle. Both set `build.publishResources: false`, so only resized WebP copies are published, never the multi-MB originals.
  - `projects/*.md` are card data only (`build.render: never`): a static screenshot from `static/images/`, pastel tag chips, and links (AlphaBridge's card links to its GitHub repo). `archetypes/projects.md` is the template for `hugo new projects/x.md`.
- `layouts/`: `baseof.html` (head/header/footer), `home.html`, `page.html`, `section.html` (projects list), and custom layouts `about.html`, `research.html`, `gallery.html`. Partials are in `layouts/_partials/`, including `photo.html` (responsive WebP `srcset`) and `timeline.html`.
- `assets/css/main.css` is the single stylesheet, fingerprinted via Hugo Pipes. Color tokens are at the top, and dark mode redefines them under `prefers-color-scheme`. The palette is warm: paper `#f7f0e6`, ink `#2b2320`, terracotta accent `#a94a31`, sage `#56694c`. Headings use Fraunces (serif) and body text uses Inter, both from Google Fonts. Breakpoints are `900px`, `820px` and `560px`.
- `static/` is copied verbatim: `favicon.ico`, `files/Shengchao_Lin_CV.pdf`, `images/alphabridge/play-table.png` (AlphaBridge card screenshot).

## GitHub Actions / Deployment

The workflow at `.github/workflows/pages.yml` (Hugo version staged in `ci/pages.yml` until installed; see `ci/README.md`) runs on push to main/master and on manual dispatch:
1. Installs the pinned Hugo extended release and restores the `resources/_gen` image cache
2. Builds into `public/`
3. Fatal gate: `scripts/check_internal_links.py public` verifies every internal href/src resolves
4. Uploads `public/` and deploys to GitHub Pages

It uses no secrets. AlphaBridge is no longer built live; its card is a committed screenshot plus a link to the repo.

## Key Conventions

- **Content vs. templates:** page text belongs in `content/` (Markdown/front matter), never hard-coded in `layouts/`. Shared UI changes happen once, in `layouts/` or `hugo.toml`.
- **No JavaScript.** The site is pure HTML + CSS; dark mode is CSS-only.
- **Images:** photos go through Hugo image processing via the `photo.html` partial. Don't reference originals directly. Gallery files are named `Gallery-N.jpg`; the gallery shows only the ones listed in `content/gallery/index.md` (e.g. `Gallery-10.jpg` is in the folder but unlisted).
- **CV:** `static/files/Shengchao_Lin_CV.pdf`, linked from the About page (`params.cv`) and the footer (`params.social`).
