# Moodsk Website

Public marketing site for [Moodsk](https://github.com/Ajigu-Studio/FolderArt), a macOS
file & folder icon editor. Plain HTML/CSS/JS with generated locale pages and tutorials.
GitHub Pages serves the committed files directly.

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
- `about/`, `zh-hans/about/`, `ja/about/`, `ko/about/` — generated publisher pages
- `tutorials/`, `zh-hans/tutorials/` — generated English and Simplified Chinese guides
- `content/tutorials/` — article metadata and editable HTML bodies
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

Landing pages also link the publisher, website, application and localized page
entities in JSON-LD. Keep the visible update date and `WebPage.dateModified` in
sync; the generator uses that date for sitemap `lastmod`. See `memory/geo.md`.
The validator checks FAQ parity, entity links, source references and date parity.
It also checks each About page, its locale links, schema and sitemap entry.
`llms.txt` documents Moodsk only. It does not guarantee indexing or AI citations.

## App Store link

The navigation, hero, and download CTAs link to Moodsk on the App Store. The English
source uses the GB storefront. `scripts/generate-locales.mjs` replaces that URL with
the matching CN, JP, or KR storefront URL for each localized page.

## Preview locally

```sh
python3 -m http.server 8080
# open http://localhost:8080
```

Serve the repository root. Tutorial assets use root-relative URLs.

## Publishing tutorials

Article metadata is in `content/tutorials/index.json`. The matching English and
Chinese article bodies are in `content/tutorials/en/` and `content/tutorials/zh-hans/`.
Add both translations for each topic. Use the same slug in both languages.

Run `node scripts/generate-locales.mjs` to generate all landing pages, tutorial
pages, and the combined sitemap. Run `node scripts/validate-site.mjs` to check
links, images, anchors, canonical URLs, and language coverage. Preview the index
and articles on desktop and mobile before pushing to `master`.

Do not edit generated article pages alone. Do not use the landing page language
redirect on article routes: the language links must keep the current topic.
