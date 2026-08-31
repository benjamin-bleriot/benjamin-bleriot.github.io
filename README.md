# Benjamin Bleriot — iOS app portfolio

A fast, static portfolio for Benjamin Bleriot's iOS applications. It is built with
[Astro](https://astro.build), TypeScript, content collections and native CSS, then
deployed to GitHub Pages with GitHub Actions.

## Local development

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

Astro prints the local development URL. Production output can be checked with:

```bash
npm run build
npm run preview
```

`npm run build` runs Astro's type/content checks before creating the static site in
`dist/`.

## Content

Each application is a Markdown or MDX entry in [`src/content/apps`](src/content/apps).
Its typed frontmatter contains the product metadata, features, FAQs, optional verified
reviews, Privacy and Terms drafts, and changelog entries. The Markdown body is the
long-form app description.

The schema lives in [`src/content.config.ts`](src/content.config.ts). A build fails
with a useful validation error if a required field is missing or has the wrong type.

Never add an App Store rating, review, privacy claim or product capability until it is
verified. Empty arrays and empty App Store fields are intentionally supported.

## Adding a new app

1. Copy an existing entry in `src/content/apps/` to `my-new-app.md`.
2. Change `name`, `slug`, descriptions, category, order and accent color.
3. Keep `appStoreUrl` empty until a real listing exists.
4. Replace the clearly marked legal placeholders only after the app's data practices
   and terms have been reviewed.
5. Run `npm run build`.

The following routes are created automatically from the one content entry:

```text
/apps/my-new-app/
/privacy/my-new-app/
/terms/my-new-app/
/changelog/my-new-app/
```

Minimal frontmatter shape:

```yaml
---
name: "My New App"
slug: "my-new-app"
description: "A factual product description."
shortDescription: "A short, factual description."
category: "Utilities"
status: "in-development"
featuredOrder: 5
appStoreUrl: ""
appStoreId: ""
icon: ""
accent: "#496E60"
hero:
  title: "A concise product promise."
  subtitle: "A factual supporting sentence."
features: []
screenshots: []
reviews: []
faq: []
technologies: []
links: []
privacy:
  lastUpdated: "2026-08-31"
  isPlaceholder: true
  summary: "Draft privacy information to review before release."
  sections:
    - heading: "Draft status"
      content: "This is not a legally reviewed privacy policy."
terms:
  lastUpdated: "2026-08-31"
  isPlaceholder: true
  summary: "Draft terms to review before release."
  sections:
    - heading: "Draft status"
      content: "These are not legally reviewed terms."
changelog: []
---

Longer factual description here.
```

## App icons and screenshots

Put assets in `public/images/apps/<slug>/`:

```text
public/images/apps/my-new-app/
├── icon.png
└── screenshots/
    ├── 01-home.png
    └── 02-detail.png
```

`icon.webp`, `icon.png` and `icon.jpg` are detected automatically. Supported images in
the `screenshots/` folder are sorted naturally and displayed automatically at the next
build. No fake product screenshots are included.

For precise accessibility text or a caption, declare an existing image in the app entry:

```yaml
screenshots:
  - image: "/images/apps/my-new-app/screenshots/01-home.png"
    alt: "My New App home screen"
    caption: "Optional caption"
```

## SEO

The shared SEO component produces titles, descriptions, canonical URLs, Open Graph and
Twitter/X cards. App pages include `SoftwareApplication` JSON-LD; the homepage includes
`Person` and `WebSite` data. Astro generates the sitemap, and `robots.txt` uses the
configured site URL. Ratings are omitted unless real data is added deliberately.

## GitHub Pages deployment

The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs on
every push to `main`. It installs locked dependencies, checks and builds the Astro site,
uploads `dist/`, and deploys it through the official GitHub Pages actions.

In the repository settings, set **Pages → Build and deployment → Source** to
**GitHub Actions** if it is not already selected.

The default site URL is `https://benjamin-bleriot.github.io`. It can be overridden for
any build with `SITE_URL` (see `.env.example`).

## Adding a custom domain

1. Configure the domain in the repository's GitHub Pages settings.
2. Add the DNS records requested by GitHub.
3. Add `public/CNAME` containing only the hostname.
4. Set `SITE_URL=https://example.com` for local/alternative builds. The deployment
   workflow automatically receives GitHub Pages' configured base URL.
5. Rebuild and verify canonical, sitemap and `robots.txt` URLs.

Do not add a `CNAME` until a real domain has been selected.
