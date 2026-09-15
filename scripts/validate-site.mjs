// Sanity checks for the generated site: locale markers, hreflang coverage,
// canonical/OG presence, switcher state, and internal link resolution.
// Run: node scripts/validate-site.mjs

import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const locales = [
  ["en-GB", ""],
  ["zh-Hans", "zh-hans"],
  ["ja", "ja"],
  ["ko", "ko"],
];
const failures = [];

for (const [locale, route] of locales) {
  const file = path.join(root, route, "index.html");
  const label = path.relative(root, file);
  let html;
  try {
    html = await readFile(file, "utf8");
  } catch {
    failures.push(`${label}: missing page`);
    continue;
  }

  const assertions = [
    [html.includes(`<html lang="${locale}" data-locale="${locale}">`), "locale marker"],
    [(html.match(/<link rel="alternate"/g) || []).length === 5, "five alternate links"],
    [(html.match(/<link rel="canonical"/g) || []).length === 1, "one canonical link"],
    [(html.match(/<meta property="og:url"/g) || []).length === 1, "one Open Graph URL"],
    [html.includes(`data-language="${locale}"`) && html.includes('aria-current="page"'), "current language in switcher"],
    [html.includes("language.js"), "language script"],
    [html.includes("application/ld+json"), "structured data"],
  ];
  for (const [passed, message] of assertions) {
    if (!passed) failures.push(`${label}: expected ${message}`);
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    if (!reference || reference.startsWith("http") || reference.startsWith("//") || reference.startsWith("#") || reference.startsWith("mailto:")) continue;
    const [pathname] = reference.split(/[?#]/);
    const target = pathname.endsWith("/") ? path.join(root, route, pathname, "index.html") : path.join(root, route, pathname);
    try {
      await access(target);
    } catch {
      failures.push(`${label}: missing internal target ${pathname}`);
    }
  }
}

if (failures.length) {
  console.error(`FAIL\n${failures.map((item) => `  - ${item}`).join("\n")}`);
  process.exit(1);
}
console.log("All site checks passed.");
