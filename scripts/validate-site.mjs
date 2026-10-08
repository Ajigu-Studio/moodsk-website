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
const textContent = (value) => value.replace(/<[^>]*>/g, "").replaceAll("&amp;", "&").replace(/\s+/g, " ").trim();

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
  const title = textContent(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "");
  const description = textContent(html.match(/<meta name="description" content="([^"]*)"/)?.[1] || "");
  const metadata = (name) => textContent(html.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`))?.[1] || "");

  const assertions = [
    [(html.match(/<h1\b/g) || []).length === 1, "one landing-page heading"],
    [title && metadata("og:title") === title && metadata("twitter:title") === title, "matching page and social titles"],
    [description && metadata("og:description") === description && metadata("twitter:description") === description, "matching page and social descriptions"],
    [html.includes(`<html lang="${locale}" data-locale="${locale}">`), "locale marker"],
    [(html.match(/<link rel="alternate"/g) || []).length === 5, "five alternate links"],
    [(html.match(/<link rel="canonical"/g) || []).length === 1, "one canonical link"],
    [(html.match(/<meta property="og:url"/g) || []).length === 1, "one Open Graph URL"],
    [html.includes(`data-language="${locale}"`) && html.includes('aria-current="page"'), "current language in switcher"],
    [html.includes("language.js"), "language script"],
    [html.includes("application/ld+json"), "structured data"],
    [appStoreLinkCount === 3, "three App Store links"],
    [!html.toLowerCase().includes("testflight"), "no TestFlight entry"],
    [html.includes(`href="${route === "zh-hans" ? "tutorials/" : route ? "../tutorials/" : "tutorials/"}"`), "tutorial entry"],
  ];
  for (const [passed, message] of assertions) {
    if (!passed) failures.push(`${label}: expected ${message}`);
  }

  const entities = [];
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const schema = JSON.parse(match[1]);
      entities.push(...(schema["@graph"] || [schema]));
    } catch {
      failures.push(`${label}: invalid structured data`);
    }
  }
  const organization = entities.find((item) => item["@type"] === "Organization");
  const website = entities.find((item) => item["@type"] === "WebSite");
  const webpage = entities.find((item) => item["@type"] === "WebPage");
  const app = entities.find((item) => item["@type"] === "SoftwareApplication");
  const faq = entities.find((item) => item["@type"] === "FAQPage");
  const pageURL = `https://moodsk.ajigu.com/${route ? `${route}/` : ""}`;
  const modified = html.match(/<time datetime="([^"]+)">/)?.[1];
  const faqSection = html.match(/<div class="faq-list[^"]*">([\s\S]*?)<\/div>/)?.[1] || "";
  const visibleFAQs = [...faqSection.matchAll(/<details>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/g)]
    .map((match) => [textContent(match[1]), textContent(match[2])]);
  const schemaFAQs = faq?.mainEntity?.map((item) => [item.name, item.acceptedAnswer?.text]);
  const geoAssertions = [
    [webpage?.name === title && app?.description === description, "metadata matches structured page and app"],
    [organization?.name === "ajigu" && organization?.sameAs?.includes("https://github.com/Ajigu-Studio"), "verified publisher entity"],
    [website?.name === "Moodsk" && app?.name === "Moodsk" && html.includes('property="og:site_name" content="Moodsk"'), "consistent Moodsk identity"],
    [organization?.["@id"] && app?.author?.["@id"] === organization["@id"] && website?.publisher?.["@id"] === organization["@id"], "linked publisher"],
    [app?.sameAs?.some((url) => url.includes("id6752535811")), "App Store entity link"],
    [webpage?.url === pageURL && webpage?.inLanguage === locale && webpage?.isPartOf?.["@id"] === website?.["@id"], "localized page entity"],
    [app?.["@id"] && webpage?.mainEntity?.["@id"] === app["@id"], "page linked to application"],
    [/^\d{4}-\d{2}-\d{2}$/.test(modified || "") && webpage?.dateModified === modified, "visible and structured update date"],
    [visibleFAQs.length >= 4 && JSON.stringify(visibleFAQs) === JSON.stringify(schemaFAQs), "FAQ schema matches visible answers"],
    [(faqSection.match(/<summary><h3>/g) || []).length === visibleFAQs.length, "question headings"],
    [html.includes('href="#about"') && html.includes('id="about"'), "About entry and section"],
    [html.includes('href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"'), "Apple license entry"],
    [html.includes('href="https://support.apple.com/guide/mac-help/change-icons-for-files-or-folders-on-mac-mchlp2313/mac"'), "Apple icon source"],
  ];
  for (const [passed, message] of geoAssertions) {
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

const llms = await readFile(path.join(root, "llms.txt"), "utf8");
if (!llms.startsWith("# Moodsk\n") || /Go Sleep|TypeNote|DailyApod/.test(llms)) {
  failures.push("llms.txt: expected a Moodsk-only summary");
}

const articles = JSON.parse(await readFile(path.join(root, "content/tutorials/index.json"), "utf8"));
const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
for (const [locale, prefix] of [["en-GB", ""], ["zh-Hans", "/zh-hans"]]) {
  for (const slug of ["", ...articles.map((item) => item.slug)]) {
    const route = `${prefix}/tutorials/${slug ? `${slug}/` : ""}`;
    const file = path.join(root, route.slice(1), "index.html");
    const html = await readFile(file, "utf8");
    const label = path.relative(root, file);
    const url = `https://moodsk.ajigu.com${route}`;
    const assertions = [
      [html.includes(`<html lang="${locale}">`), "tutorial language"],
      [(html.match(/<h1[ >]/g) || []).length === 1, "one article heading"],
      [html.includes(`<link rel="canonical" href="${url}"/>`), "article canonical"],
      [(html.match(/<link rel="alternate"/g) || []).length === 3, "three tutorial alternates"],
      [!html.includes("language.js"), "no landing-page redirect"],
      [!html.includes("Editorial notes:") && !html.includes("status: draft"), "no draft notes"],
      [sitemap.includes(`<loc>${url}</loc>`), "tutorial in sitemap"],
    ];
    for (const [passed, message] of assertions) {
      if (!passed) failures.push(`${label}: expected ${message}`);
    }
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(match[1]); } catch { failures.push(`${label}: invalid structured data`); }
    }
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const reference = match[1];
      if (reference.startsWith("http") || reference.startsWith("mailto:")) continue;
      if (reference.startsWith("#")) {
        if (!html.includes(`id="${reference.slice(1)}"`)) failures.push(`${label}: missing anchor ${reference}`);
        continue;
      }
      const [pathname] = reference.split(/[?#]/);
      let target = pathname.startsWith("/") ? path.join(root, pathname.slice(1)) : path.resolve(path.dirname(file), pathname);
      if (pathname.endsWith("/")) target = path.join(target, "index.html");
      try { await access(target); } catch { failures.push(`${label}: missing tutorial target ${reference}`); }
    }
  }
}

if (failures.length) {
  console.error(`FAIL\n${failures.map((item) => `  - ${item}`).join("\n")}`);
  process.exit(1);
}
console.log("All site checks passed.");
