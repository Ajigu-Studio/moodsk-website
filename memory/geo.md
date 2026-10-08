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
- Generate a standalone About page for each landing-page locale. Link to that
  route from the footer. Keep the About language switcher on the same topic.
- Keep product entities first in the graph, with the publisher named separately.
  A page title describes the page; a site name identifies the brand. Do not erase
  useful page titles or rename the studio just to satisfy an exact-match audit.
- Put landing-page content in one `main` region. Include a visible product
  definition, workflow, purchase boundaries and restoration behaviour.
- Use short, attributed quotations from the matching-language Apple guide.
  Do not invent endorsements or add filler to meet a word-count threshold.
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

Whitespace-separated word counts are not comparable across English, Chinese and
Japanese. Check the actual visible text and language-aware segmentation before
classifying a localized page as thin. The AITDK detection rules were not accessible
in this environment, so remaining tool-specific flags require a direct recheck.

## Validation

Run `node scripts/validate-site.mjs` after generation. It checks JSON parsing,
entity links, localized page identity, FAQ parity, question headings, date parity,
footer/source entries, and the Moodsk-only summary. Check desktop and mobile
rendering, FAQ expansion, and About navigation before publishing.
