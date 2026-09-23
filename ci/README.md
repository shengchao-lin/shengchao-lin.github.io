# Staged deploy workflow for the Hugo site

`ci/pages.yml` is the updated `.github/workflows/pages.yml` for the Hugo version of the site. It's staged here because the automation token that pushed this branch can't write under `.github/workflows/`: it lacks the GitHub `workflow` scope.

**Install it before merging this branch.** The old workflow uploads the repository root, which no longer contains built HTML, so the site would deploy broken.

```sh
git mv -f ci/pages.yml .github/workflows/pages.yml
git rm ci/README.md
git commit -m "Activate Hugo deploy workflow"
git push
```

What changed from the old workflow:
- It captures screenshots into `static/images/alphabridge` before building.
- It installs pinned Hugo extended (0.166.0), caches `resources/_gen`, and runs `hugo --gc` into `public/`.
- It builds the AlphaBridge subsite into `public/AlphaBridge`, bakes stats into `public/alphabridge.html`, runs the link check on `public`, and uploads `public`.
