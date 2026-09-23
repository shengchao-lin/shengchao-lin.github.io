# Staged deploy workflow for the Hugo site

`ci/pages.yml` replaces `.github/workflows/pages.yml`. It's staged here because the automation token that pushed this branch can't write under `.github/workflows/`: it lacks the GitHub `workflow` scope.

**Install it before merging this branch.** The old workflow clones AlphaBridge with an expired token and uploads the repository root, which no longer contains built HTML.

```sh
git mv -f ci/pages.yml .github/workflows/pages.yml
git rm ci/README.md
git commit -m "Activate Hugo deploy workflow"
git push
```

The new workflow checks out the repo, installs pinned Hugo extended (0.166.0), restores the resized-photo cache, runs `hugo --gc` into `public/`, checks internal links, and deploys. It runs on push to `main` and on manual dispatch. It needs no secrets, so the `ALPHABRIDGE_REPO_TOKEN` secret can be deleted.
