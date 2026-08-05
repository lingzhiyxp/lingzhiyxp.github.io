# lingzhiyxp.github.io

Personal site for Lingzhi Yuan. Plain static HTML/CSS/JS — **no build step, no Jekyll**.
Whatever is on the default branch is exactly what GitHub Pages serves.

```
.
├── index.html                # home: About, News, Selected Publications
├── about/index.html          # the non-research page
├── assets/
│   ├── css/style.css         # all styling + design tokens (light & dark)
│   ├── js/main.js            # scroll fade-in, click-to-copy email
│   ├── img/                  # portraits + paper thumbnails
│   └── pdf/                  # CV / resume
└── .nojekyll                 # tell Pages to serve files as-is
```

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Use a server rather than opening `index.html` directly — links and asset paths are
absolute (`/assets/...`), which only resolve when served from a root.

## Editing

**A news item** — add a `<p>` at the top of `.news` in `index.html`, newest first:

```html
<p>
  <span class="date">2026/09</span> - Something happened.
</p>
```

**A paper** — copy an `<article class="entry">` block in `index.html`, drop the figure into
`assets/img/thumbnails/`, and pick a badge class. Badges are defined in `style.css`:

| class              | used for       |
| ------------------ | -------------- |
| `badge--preprint`  | preprints      |
| `badge--icml`      | ICML           |
| `badge--iclr`      | ICLR           |
| `badge--tifs`      | IEEE TIFS      |

To add a venue, add one line to `style.css` (`.badge--neurips { color: var(--badge-neurips); }`)
plus a `--badge-neurips` value in both `:root` and the dark-mode block.

Underline your own name in the author list with `<span class="me">Lingzhi Yuan</span>`.

**The top nav** — one `<nav class="topnav">` block near the top of each page. Home-page
items are in-page anchors (`#about`, `#news`, `#publications`, matching the `id` on each
`<section>`); "About Me" points at the separate `/about/` page. Adding a section means
adding an `id` and one `<a>`.

**Photos** — shown uncropped at their native aspect ratio. `.portrait` is 300px wide on
desktop; add `portrait--narrow` (230px) for tall portrait-orientation shots, as `/about/`
does.

**Colors / fonts** — everything lives in the two token blocks at the top of `style.css`:
`:root` holds the **dark** theme (the default for every visitor, regardless of their OS
setting) and `:root[data-theme="light"]` overrides it with the light one. The sun/moon
button at the right of the top bar switches between them and remembers the choice in
`localStorage`; an inline script in each page's `<head>` applies it before first paint so
there is no flash. Deleting that button and the `[data-theme="light"]` block would leave a
dark-only site.

Keep thumbnails small (≈760px wide is plenty):

```bash
sips -Z 760 assets/img/thumbnails/new-paper.png
```

## Deploying

⚠️ Read this before pushing. The `lingzhiyxp.github.io` repo currently runs al-folio: a
GitHub Action (`.github/workflows/deploy.yml`) builds Jekyll on every push to `main` and
force-pushes the result to the **`gh-pages`** branch, which is what Pages actually serves.
Dropping these files onto `main` alone will change nothing on the live site — the Action
would rebuild Jekyll over them.

**Recommended: retire the Jekyll pipeline.**

1. On `main`, delete the al-folio scaffolding — `_config.yml`, `Gemfile*`, `_layouts/`,
   `_includes/`, `_sass/`, `_plugins/`, `_pages/`, `_posts/`, `_projects/`, `_news/`,
   `_data/`, `_bibliography/`, `bin/`, `.github/workflows/`, `purgecss.config.js`,
   `Dockerfile`, `docker-compose*.yml`, `CUSTOMIZE.md`, `FAQ.md`, `INSTALL.md` — then copy
   these files in and push.
2. In the repo's **Settings → Pages**, switch the source from the `gh-pages` branch to
   **`main` / `(root)`**.
3. Delete the now-unused `gh-pages` branch.

Keep a tag or branch of the old site first (`git tag al-folio-archive && git push --tags`)
so nothing is lost.

**Alternative: keep `gh-pages` as the served branch.** Leave Pages settings alone, delete
`.github/workflows/deploy.yml` so Jekyll stops rebuilding, and publish by hand:

```bash
git checkout --orphan gh-pages-new
git rm -rf .          # clear the index
cp -R /path/to/this/site/. .
git add -A && git commit -m "New static site"
git push -f origin gh-pages-new:gh-pages
```
