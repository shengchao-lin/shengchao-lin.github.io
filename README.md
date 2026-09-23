# Shengchao Lin's Personal Website

Built with [Hugo](https://gohugo.io/). Every page is one Markdown file in `content/`, and the header, footer and styles are shared. GitHub Actions builds and deploys the site on every push to `main`.

## Preview locally

```sh
brew install hugo          # once (macOS); other platforms: https://gohugo.io/installation/
hugo server                # open http://localhost:1313, reloads as you edit
```

The first run takes about a minute while Hugo resizes the gallery photos. After that it's instant.

## Where things live

| To change…                        | Edit                                                                 |
|-----------------------------------|----------------------------------------------------------------------|
| Home page intro, career path      | `content/_index.md`                                                  |
| Portrait                          | replace `content/me.jpg`                                             |
| About text, experience, education | `content/about.md`                                                   |
| Research, reading group, talks    | `content/research.md`                                                |
| Projects                          | `content/projects/*.md` (one file per project card)                  |
| Gallery photos and captions       | `content/gallery/index.md` + the JPGs in `content/gallery/`          |
| AlphaBridge showcase page         | `content/alphabridge.html`                                           |
| Nav menu, footer links, site title| `hugo.toml`                                                          |
| CV                                | replace `static/files/Shengchao_Lin_CV.pdf`                          |
| Colors, fonts, layout             | `assets/css/main.css` (color tokens at the top)                      |

The text below the `---` front matter is ordinary Markdown. The lists above it (experience, talks, photos, …) are YAML: copy an existing line and edit it.

### Common tasks

- **Add a photo:** copy the full-size JPG into `content/gallery/`, then add a line to `photos:` in `content/gallery/index.md`. Hugo publishes resized WebP versions; the original is never uploaded to the website.
- **Add a project:** run `hugo new projects/my-project.md`, fill in the fields, and put its screenshot in `static/images/my-project/`.
- **Add a nav link:** add a `[[menus.main]]` block in `hugo.toml`.

## Layout

```
content/     page text (Markdown + front matter) and photos
layouts/     HTML templates (rarely need editing)
assets/      CSS and the showcase JS (fingerprinted by Hugo)
static/      files copied as-is: favicon, CV, AlphaBridge screenshots
scripts/     deploy helpers for the AlphaBridge showcase
```
