---
name: betabridge-design
description: BetaBridge design language for the portfolio showcase and the BetaBridge app UI. Use whenever styling, restyling, or reviewing UI for betabridge.html, projects.html cards, or any BetaBridge-branded surface — palette, geometry, chips, motion rules, and verification steps.
---

# BetaBridge design language

A clean, premium, minimalist product-design style inspired by modern iOS usability
principles — **without** copying Apple's website, app layouts, icons, typefaces,
product imagery, logos, or trade dress — blended with BetaBridge's own card-table
identity (faint suit watermarks, deep green felt).

## Palette

| Token | Value | Role |
|---|---|---|
| Stage | `#f5f4f0` + dot grid `radial-gradient(rgba(28,38,34,.055) 1px, transparent 1px) / 22px` | Page background |
| Ink | `#1c2622` | Primary text |
| Card | `#ffffff` | Surfaces |
| Hairline | `rgba(28, 38, 34, 0.1)` | Borders |
| Emerald | `#14735a` (dark `#0b5443`) | Brand accent, eyebrows, links |
| Felt | `linear-gradient(168deg, #14735a, #0b5443 55%, #083f32)` + faint gold/mint radials | The green table-top band |
| Gold | `#d9b86a` / fill gradient `#cfa84e → #e5c068` | Accents on felt, meter fill |

Pastel chips (pill, weight 750, 0.84rem): green `#e2f3e9/#176245`, gold
`#faf0d2/#8a6a1c`, blue `#e3edfb/#2d5fa8`, purple `#ece7fa/#5b44a8`,
red `#fbe5e0/#a03d2d`.

## Typography

System sans (Inter/system-ui) everywhere. Display headlines: weight 850,
tracking `-0.025em` to `-0.035em`, tight line-height (~0.95–1.08). Micro-labels:
0.72–0.78rem, weight 800, uppercase, letter-spacing 0.12–0.14em, muted color.
Big numerals: weight 850, `font-variant-numeric: tabular-nums`. No webfonts.

## Geometry & surfaces

- Radii: 26px panels (`--bb-radius`), 32px hero bands, 18px window frames, 14px
  inner windows, 999px pills/chips.
- Shadows are layered and diffuse, never hard:
  `0 2px 6px rgba(28,38,34,.05), 0 28px 60px -28px rgba(28,38,34,.28)`.
- Screenshots/videos live in "window cards": neutral gray dots bar (NOT
  mac traffic-light colors), hairline border, white background.
- Feature media: a pastel-tinted panel (`aspect-ratio: 5/4`, mint/blush/sky
  gradients) with the window card anchored top-left (flipped: top-right) at
  ~132% width so it crops/bleeds off the panel edge.
- Stats: one cluster card, cells divided by hairlines; micro-label above,
  big numeral, one-line muted note below.
- Brand watermarks: giant faint suit glyph (`"\2660"`, 5–7% opacity emerald on
  light, 5% ivory on felt) behind heroes/bands. Parent needs
  `position: relative`; the stage ancestor needs `isolation: isolate` so a
  `z-index: -1` watermark paints above the stage background.

## Motion (all gated behind `prefers-reduced-motion: no-preference`)

- Scroll reveals: IntersectionObserver adds `.bb-in`; elements rise
  `translateY(26px) scale(.99) → none`, 0.7s `cubic-bezier(0.22, 1, 0.36, 1)`,
  staggered ~70ms. CSS hides `.bb-reveal` only under `html.bb-js` (JS adds the
  class), so no-JS users see everything.
- Numerals count up (~1.2s, cubic ease-out) when their card reveals.
- Segmented meters (capacity bars): mask-built segments
  (`mask-image: repeating-linear-gradient(90deg, #000 0 calc(2.5% - 3px), transparent ... 2.5%)`),
  fill sweeps left→right on reveal (width 0 → `var(--fill)`, 1.4s).
- Micro-interactions are springy: chips/cards hover with
  `cubic-bezier(0.34, 1.56, 0.64, 1)` (slight scale or -2px lift + shadow).
- Videos: muted, loop, playsinline; play only while in view, pause off-view.
- Never animate containers rebuilt via innerHTML on state refresh.

## Hard rules

- No Apple trade dress: no SF-style marketing layouts, no colored
  traffic-light dots, no Apple imagery/icons/typefaces.
- Progressive enhancement only: pages fully readable with JS disabled.
- Portfolio repo: JS allowed only in `assets/js/betabridge.js`.
- BetaBridge repo: restyle-don't-restructure — never remove ids/classes/script
  hooks; keep the pinned layout fragments; the play table keeps its dark felt.

## Verify before shipping

- Portfolio: drive `betabridge.html` headless (desktop + 390px + no-JS), check
  zero console errors, counters/meter/reveals fire, video plays in view.
- BetaBridge repo: `python3 scripts/check_play_ui_visuals.py` and
  `python3 -m unittest discover -s tests` must stay green.
- Re-capture showcase media after UI changes:
  `python3 main.py playground --no-browser --port 8765 &` then
  `node scripts/capture-betabridge-screenshots.mjs` and
  `python3 scripts/compress_betabridge_screenshots.py` (portfolio repo).
