# Landing-page SEO conventions

- Use the visible H1 to describe custom Mac folder icons. Keep brand slogans in
  supporting copy or the closing call to action.
- Describe icon creation, replacement and restoration in relevant section
  headings. Keep the existing question-and-answer structure and avoid repeating
  keywords in every heading.
- Update the English source and locale dictionaries together. Generate Chinese,
  Japanese and Korean pages with `node scripts/generate-locales.mjs`.
- Keep each locale's page title, Open Graph title, Twitter title and WebPage name
  equal. Keep the meta, social and SoftwareApplication descriptions equal.
- The generator uses the configured English title when translating social tags.
  Do not introduce a second hardcoded source title in the translation pipeline.
- Generate the combined sitemap with the locale pages. Confirm tutorial URLs in
  the production sitemap after GitHub Pages finishes deployment.
- Run `node scripts/validate-site.mjs` and inspect all four homepages on desktop
  and mobile before publishing heading changes.
- Search positions and Core Web Vitals require separate measurements. Content
  validation does not confirm ranking improvements.
