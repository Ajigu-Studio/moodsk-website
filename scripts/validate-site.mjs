// Sanity checks for the generated site: locale markers, hreflang coverage,
// canonical/OG presence, switcher state, and internal link resolution.
// Run: node scripts/validate-site.mjs

import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const locales = [
  ["en-GB", "", "https://apps.apple.com/gb/app/moodsk-folder-icon-maker/id6752535811?mt=12"],
  [
    "zh-Hans",
    "zh-hans",
    "https://apps.apple.com/cn/app/moodsk-%E6%96%87%E4%BB%B6%E5%A4%B9%E5%9B%BE%E6%A0%87%E5%88%B6%E4%BD%9C/id6752535811?mt=12",
  ],
  [
    "ja",
    "ja",
    "https://apps.apple.com/jp/app/moodsk-%E3%83%95%E3%82%A9%E3%83%AB%E3%83%80%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3%E4%BD%9C%E6%88%90/id6752535811?mt=12",
  ],
  [
    "ko",
    "ko",
    "https://apps.apple.com/kr/app/moodsk-%ED%8F%B4%EB%8D%94-%EC%95%84%EC%9D%B4%EC%BD%98-%EB%A7%8C%EB%93%A4%EA%B8%B0/id6752535811?mt=12",
  ],
];
const failures = [];

for (const [locale, route, appStoreURL] of locales) {
  const file = path.join(root, route, "index.html");
  const label = path.relative(root, file);
  let html;
  try {
    html = await readFile(file, "utf8");
  } catch {
    failures.push(`${label}: missing page`);
    continue;
  }
  const appStoreLinkCount = html.split(`href="${appStoreURL}"`).length - 1;

  const assertions = [
    [html.includes(`<html lang="${locale}" data-locale="${locale}">`), "locale marker"],
    [(html.match(/<link rel="alternate"/g) || []).length === 5, "five alternate links"],
    [(html.match(/<link rel="canonical"/g) || []).length === 1, "one canonical link"],
    [(html.match(/<meta property="og:url"/g) || []).length === 1, "one Open Graph URL"],
    [html.includes(`data-language="${locale}"`) && html.includes('aria-current="page"'), "current language in switcher"],
    [html.includes("language.js"), "language script"],
    [html.includes("application/ld+json"), "structured data"],
    [appStoreLinkCount === 3, "three App Store links"],
    [!html.toLowerCase().includes("testflight"), "no TestFlight entry"],
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
