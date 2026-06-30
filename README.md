# raimonluna.dev — personal site

A static personal site: research portfolio, publications list, teaching
materials, outreach gallery, and a "Math is Beautiful" image gallery. Plain
HTML/CSS/JS — no build step, no framework, no dependencies beyond Google
Fonts.

## Structure

```
.
├── index.html                 Homepage / hero
├── research.html              Research areas
├── publications.html          Publications (rendered from data/publications.json)
├── teaching.html               Courses + supervision
├── outreach.html               Talks, articles, workshops
├── math-is-beautiful.html      Image gallery + lightbox
├── css/
│   ├── main.css                 design tokens, layout, nav, footer
│   └── components.css           page-specific components
├── js/
│   ├── site.js                  nav toggle, active-link highlighting
│   ├── publications.js          fetches + renders data/publications.json
│   └── math-beautiful.js        lightbox logic
├── data/
│   ├── publications.json        publication records (replace periodically)
│   ├── README.md                 how to regenerate this from INSPIRE-HEP
│   └── MEDIA-HOSTING.md          where to host images/video for the gallery
├── images/                      see "Adding your own images" below
├── assets/
│   └── cv_raimon_luna.pdf       (add your CV PDF here)
└── CNAME                        custom domain placeholder (see below)
```

## Running it locally

No build step is needed. Two options:

1. **Just open `index.html` in a browser.** Everything works except the
   Publications page, because browsers block `fetch()` of local files under
   `file://`. For that page specifically, use option 2.
2. **Serve it with a tiny local server**, e.g. from inside the project folder:
   ```
   python -m http.server 8000
   ```
   then visit `http://localhost:8000`.

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `raimonluna.github.io` for a root
   site, or any name for a project site under `/repo-name/`).
2. Push the contents of this folder to the repository's default branch.
3. In the repo settings → **Pages**, set the source to deploy from that
   branch (root folder).
4. Your site will be live at `https://<username>.github.io/` (or
   `https://<username>.github.io/<repo-name>/` for a project site) within a
   minute or two.

Because there's no build step, every page works exactly as committed — no
GitHub Action needed for a basic deploy.

## Moving to a custom domain later

1. Buy/own a domain (e.g. `raimonluna.com`).
2. Replace the placeholder text in the `CNAME` file at the repo root with
   your real domain, e.g.:
   ```
   raimonluna.com
   ```
3. At your domain registrar, add the DNS records GitHub specifies for Pages
   (typically an `A`/`ALIAS` record to GitHub's IPs for an apex domain, or a
   `CNAME` record to `<username>.github.io` for a subdomain like
   `www.raimonluna.com`). GitHub's own docs
   (https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
   have the exact current values — check there since IPs occasionally change.
4. Back in repo settings → Pages, enter the custom domain and enable
   "Enforce HTTPS" once it's verified.

## Moving to a different host later

Because this is a fully static site with no GitHub-Pages-specific config
beyond the `CNAME` file, you can drop the same folder onto Netlify, Vercel,
Cloudflare Pages, or a plain web host at any point — just delete or ignore
the `CNAME` file (most other hosts have their own domain UI) and upload the
folder as-is.

## Adding your own images

The HTML references images by filename only — drop files with these exact
names into the folders below and they'll appear automatically:

- `images/profile_picture.jpg` — homepage portrait
- `images/research/*.jpg` — one per research panel (large-d-gravity,
  numerical-relativity, holography, machine-learning, gravitational-waves)
- `images/outreach/*.jpg` — one per outreach card (see filenames in
  `outreach.html`)
- `images/math-beautiful/*.jpg` (+ `*.mp4` for animations) — your generative
  art tiles; see the template tiles in `math-is-beautiful.html` for how to
  add new ones, and `data/MEDIA-HOSTING.md` for hosting recommendations as
  this gallery grows
- `assets/cv_raimon_luna.pdf` — your CV, linked from the homepage button

Any image format works (`.jpg`, `.png`, `.webp`) — just update the filename
in the corresponding HTML `src`/`data-thumb`/`data-full` attribute to match.

## Updating publications

See `data/README.md` — short version: export BibTeX from INSPIRE-HEP, run
the included conversion script, replace `data/publications.json`, push.

## Editing without web dev experience

Everything is plain HTML — each page is self-contained and the structure
repeats predictably (header → main → footer). To add or edit content:

- **Text**: edit it directly inside the relevant `<p>`, `<h2>`, `<h3>` tags.
- **A new outreach card or course card**: copy an existing `<div
  class="outreach-card">` or `<div class="course-card">` block (including
  its closing tag) and edit the text/links inside.
- **A new Math is Beautiful tile**: copy the `<button class="mb-tile">`
  block in `math-is-beautiful.html` and change its `data-*` attributes.
- **Colors/fonts**: all defined once at the top of `css/main.css` as CSS
  variables (`--paper`, `--ink`, `--accent`, etc.) — change them there and
  they propagate everywhere.
