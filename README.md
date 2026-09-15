# Moodsk Website

Public marketing site for [Moodsk](https://github.com/Ajigu-Studio/FolderArt), a macOS
file & folder icon editor. Single-page, plain HTML/CSS/JS — no build step.

Live: <https://moodsk.ajigu.com/> (GitHub Pages, custom domain via `CNAME`)

## Languages

The English page (`index.html`) is the source of truth. Localized pages are generated
into `zh-hans/`, `ja/` and `ko/`, together with `sitemap.xml`:

```sh
node scripts/generate-locales.mjs   # regenerate locale pages + sitemap
node scripts/validate-site.mjs      # verify markers, hreflang coverage, internal links
```

Translations live in the `copy` / `attrs` dictionaries inside
`scripts/generate-locales.mjs` (exact match on the English text node). When the English
copy changes, run the generator so every locale picks up the structure and flag anything
still untranslated. Pack names follow the app's own `Localizable.xcstrings` terms.

`language.js` redirects first-time visitors from the English page to their browser
language (choice persisted in `localStorage`); the in-page switcher sets that preference.
Each page declares `hreflang` alternates and the sitemap repeats them as
`xhtml:link` entries.

## Structure

- `index.html` — English landing page (source of truth for copy and structure)
- `zh-hans/`, `ja/`, `ko/` — generated localized pages
- `privacy/`, `support/` — English policy/support pages
- `styles.css` — design system; paper-cut sticker aesthetic matching the app icon
- `main.js` — sticky nav background and scroll-reveal animations
- `language.js` — browser-language redirect and switcher preference
- `scripts/` — locale generator and site validator
- `assets/` — app icon, favicon, OG image, real app screenshots (`assets/screens/`), and cropped pack/sticker art

## Updating screenshots

Screenshots are captured from the running app with `screencapture -x -o -l <windowID>` and
compressed to JPEG (quality ~82). Replace the files under `assets/screens/` keeping the same
names when the UI changes.

## SEO

Every page ships a canonical URL, `hreflang` alternates (+ `x-default`), Open Graph and
Twitter Card tags, `SoftwareApplication` and localized `FAQPage` JSON-LD, plus
`robots.txt`, `sitemap.xml`, `llms.txt`, a `404.html` and `.nojekyll` for GitHub Pages.

## App Store link

The download buttons currently point to `#` / `#download`. Replace the `href` of the
`.btn-primary` CTA anchors in `index.html` (nav, hero, and download section) with the real
App Store URL once it is available.

## Preview locally

```sh
python3 -m http.server 8080
# open http://localhost:8080
```

All asset paths are relative, so the site also serves fine from subpaths.
