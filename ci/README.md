# Staged CI fix — install `ci/pages.yml` over `.github/workflows/pages.yml`

## Why this file is here

The live deploy workflow at `.github/workflows/pages.yml` still referenced the
project's **old name (BetaBridge)** everywhere. The project was renamed to
**AlphaBridge**, and `github.com/shengchao-lin/BetaBridge` no longer exists, so
every deploy run failed at the **Clone BetaBridge** step with:

```
fatal: Authentication failed for 'https://github.com/shengchao-lin/BetaBridge.git/'
```

`ci/pages.yml` is the corrected workflow (a pure `BetaBridge` → `AlphaBridge`
rename). It is staged here because the automation that opened this PR uses an
integration token **without the GitHub `workflow` OAuth scope**, so it cannot
write under `.github/workflows/` directly. (AlphaBridge handles the same
limitation by shipping `design-system/workflows/design-lock.yml` outside
`.github/workflows/`.)

## One-step install (pick either)

**A. GitHub web UI** — open `.github/workflows/pages.yml`, click *Edit*, and
replace its contents with `ci/pages.yml` (then delete this `ci/` folder).

**B. Local git with a workflow-scoped token / SSH:**

```sh
cp ci/pages.yml .github/workflows/pages.yml
git rm -r ci
git add .github/workflows/pages.yml
git commit -m "Fix Deploy static site workflow: BetaBridge -> AlphaBridge"
git push
```

## What the fix changes

| Was (broken) | Now (fixed) |
|---|---|
| clone `BetaBridge.git` into `_betabridge_tmp` | clone `AlphaBridge.git` into `_alphabridge_tmp` |
| build into `$GITHUB_WORKSPACE/BetaBridge` | build into `$GITHUB_WORKSPACE/AlphaBridge` |
| `bake_betabridge_stats.py` | `bake_alphabridge_stats.py` |
| `capture-betabridge-screenshots.mjs` | `capture-alphabridge-screenshots.mjs` |
| `compress_betabridge_screenshots.py` | `compress_alphabridge_screenshots.py` |
| `repository_dispatch: [betabridge-updated]` | `repository_dispatch: [alphabridge-updated]` |

The new names match the committed `scripts/` (`bake_alphabridge_stats.py`,
`capture-alphabridge-screenshots.mjs`, `compress_alphabridge_screenshots.py`)
and the `alphabridge-updated` dispatch that AlphaBridge's CI actually fires.
