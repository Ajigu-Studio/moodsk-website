# Tutorial Publishing

- Tutorial pages are static HTML. Source metadata is in `content/tutorials/index.json`; article bodies are in `content/tutorials/en/` and `content/tutorials/zh-hans/`. Edit sources and run `node scripts/generate-locales.mjs`; do not edit generated pages alone.
- English tutorials use `/tutorials/`; Simplified Chinese tutorials use `/zh-hans/tutorials/`. Article language links must point to the same topic and declare reciprocal alternates. Do not run the landing page language redirect on tutorial routes.
- The locale generator also emits tutorial pages and sitemap entries. Adding an article must preserve existing sitemap entries. Run `node scripts/validate-site.mjs` before publishing.
- Result images in `assets/tutorials/` are real Finder crops. Keep the four-style result separate from the original color result. Editor Pro output and paid pack ownership are separate purchase conditions.
- The site is published from the root of the `master` branch by GitHub Pages. A push is not delivery proof: verify the Pages build commit and the live article pages and assets.
