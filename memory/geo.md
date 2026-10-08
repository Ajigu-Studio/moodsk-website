# GEO conventions

- Keep `Moodsk` as the app and website name. Use `ajigu` for the publisher.
- The English landing page is the source. Regenerate all localized pages with
  `node scripts/generate-locales.mjs`; do not edit generated pages alone.
- Keep Organization, WebSite and SoftwareApplication IDs stable across locales.
  Give each localized WebPage its own URL, ID, title and language.
- Use verified identity links only. The studio GitHub profile belongs to the
  publisher; the App Store listing belongs to the app.
- Keep FAQ structured answers equal to the visible questions and answers.
  Put question headings inside the native disclosure summaries.
- Set `dateModified` from the visible update date and use it for landing-page
  sitemap `lastmod`. Change it after a substantive content edit. Do not invent
  a publication date or change dates merely because a generator ran.
- Link the About section, contact, privacy policy and Apple standard app license.
  Link Apple documentation for the built-in Finder workflow.
- Keep `llms.txt` focused on Moodsk. It is supplemental documentation, not an
  indexing requirement or a guarantee of AI citations.
- Rendering and icon application are local. Apple services handle purchases.
  Free download does not mean that Editor Pro or every icon pack is free.

## Baseline checked on 2026-10-08

The live English page contained about 719 whitespace-separated words, four FAQ
answers, SoftwareApplication and FAQPage schema, and an author organization nested
inside the app schema. The screenshot's 202-word count and missing question report
did not describe the complete HTML. Missing items were a linked entity graph,
visible update date, About and license entries, and primary-source references.
The live `llms.txt` used the studio title and included unrelated apps.

`robots.txt` allows public pages for all user agents. This verifies declared crawl
rules only, not access through every crawler, CDN or search platform. Platform
visibility and citation changes require separate live measurements.

## Validation

Run `node scripts/validate-site.mjs` after generation. It checks JSON parsing,
entity links, localized page identity, FAQ parity, question headings, date parity,
footer/source entries, and the Moodsk-only summary. Check desktop and mobile
rendering, FAQ expansion, and About navigation before publishing.
