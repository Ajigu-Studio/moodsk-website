import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://moodsk.ajigu.com";
const articles = JSON.parse(await readFile(path.join(root, "content/tutorials/index.json"), "utf8"));
const locales = {
  en: {
    code: "en-GB", prefix: "", home: "/?lang=en", og: "en_GB", label: "English",
    title: "Folder icon tutorials for Mac", description: "Change folder icons, choose a color system, and make text labels with Moodsk. Practical guides with real Finder results.",
    eyebrow: "MOODSK GUIDES", guides: "Tutorials", back: "Back to Moodsk", read: "Read tutorial", contents: "In this guide", related: "Continue reading",
    author: "By Ajigu · Moodsk team", cta: "Try it on your Mac", ctaText: "Built-in color icons apply for free. Editor output requires Editor Pro; paid icon packs are sold separately.", download: "View Moodsk on the App Store",
    store: "https://apps.apple.com/gb/app/id6752535811?mt=12",
  },
  "zh-hans": {
    code: "zh-Hans", prefix: "/zh-hans", home: "/zh-hans/", og: "zh_Hans", label: "简体中文",
    title: "Mac 文件夹图标教程", description: "从更换图标到颜色分类，再到文字标签，用真实访达结果一步步了解 Moodsk。",
    eyebrow: "MOODSK 使用指南", guides: "教程", back: "返回 Moodsk", read: "阅读教程", contents: "本文内容", related: "继续阅读",
    author: "作者：Ajigu · Moodsk 团队", cta: "在你的 Mac 上试一试", ctaText: "内置颜色图标可免费直接应用；编辑器输出需要 Editor Pro，付费图标包另售。", download: "前往 Mac App Store",
    store: "https://apps.apple.com/cn/app/id6752535811?mt=12",
  },
};
const escape = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const route = (locale, slug = "") => `${locales[locale].prefix}/tutorials/${slug ? `${slug}/` : ""}`;
const imageURL = `${origin}/assets/tutorials/finder-after-detail.svg`;

function alternateLinks(slug) {
  return Object.entries(locales).map(([key, value]) => `<link rel="alternate" hreflang="${value.code}" href="${origin}${route(key, slug)}"/>`).join("\n") + `\n<link rel="alternate" hreflang="x-default" href="${origin}${route("en", slug)}"/>`;
}

function cards(locale, current) {
  const copy = locales[locale];
  return `<div class="guide-cards">${articles.filter((item) => item.slug !== current).map((item, index) => `<a class="guide-card" href="${route(locale, item.slug)}"><span class="guide-number">0${index + 1}</span><h3>${escape(item.locales[locale].title)}</h3><p>${escape(item.locales[locale].description)}</p><span class="guide-read">${copy.read} →</span></a>`).join("")}</div>`;
}

function page(locale, slug, title, description, content, schema) {
  const copy = locales[locale];
  const url = `${origin}${route(locale, slug)}`;
  const languages = Object.entries(locales).map(([key, value]) => `<a href="${route(key, slug)}" lang="${value.code}" hreflang="${value.code}"${key === locale ? ' aria-current="page"' : ""}>${value.label}</a>`).join("");
  return `<!DOCTYPE html>
<html lang="${copy.code}">
<head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escape(title)} | Moodsk</title><meta name="description" content="${escape(description)}"/>
<link rel="canonical" href="${url}"/>
${alternateLinks(slug)}
<meta property="og:title" content="${escape(title)}"/><meta property="og:description" content="${escape(description)}"/>
<meta property="og:type" content="${slug ? "article" : "website"}"/><meta property="og:url" content="${url}"/><meta property="og:locale" content="${copy.og}"/>
<meta property="og:image" content="${origin}/assets/og-image.jpg"/><meta name="twitter:card" content="summary_large_image"/>
<link rel="icon" href="/assets/favicon.png"/><link rel="stylesheet" href="/styles.css?v=2"/><link rel="stylesheet" href="/tutorials.css?v=1"/>
<script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>
</head>
<body class="tutorial-page">
<header class="legal-nav"><div class="legal-nav-inner"><a class="brand" href="${copy.home}"><img class="brand-icon" src="/assets/appicon.jpg" alt="" width="34" height="34"/><span class="brand-name">Moodsk</span></a><nav class="tutorial-nav" aria-label="${copy.guides}"><a href="${route(locale)}">${copy.guides}</a><div class="tutorial-languages">${languages}</div></nav></div></header>
<main class="tutorial-main">${content}
<aside class="tutorial-cta"><h2>${copy.cta}</h2><p>${copy.ctaText}</p><a class="btn btn-primary" href="${copy.store}">${copy.download}</a></aside>
<footer class="tutorial-footer"><a href="${copy.home}">${copy.back} →</a><span>© 2026 Moodsk · Ajigu</span></footer>
</main></body></html>\n`;
}

export async function generateTutorials() {
  for (const [locale, copy] of Object.entries(locales)) {
    const directory = path.join(root, route(locale).slice(1));
    await mkdir(directory, { recursive: true });
    const indexContent = `<header class="tutorial-heading"><p class="eyebrow">${copy.eyebrow}</p><h1>${copy.title}</h1><p class="tutorial-lede">${copy.description}</p></header><figure class="guide-hero"><img src="/assets/tutorials/finder-after-detail.svg" alt="${locale === "en" ? "Four real Finder folders with illustration, emoji, music, and text icons" : "实际应用了插画、表情、音符和文字图标的四个访达文件夹"}" width="940" height="290"/></figure>${cards(locale)}`;
    const indexSchema = { "@context": "https://schema.org", "@type": "CollectionPage", name: copy.title, inLanguage: copy.code, url: `${origin}${route(locale)}`, hasPart: articles.map((item) => ({ "@type": "Article", headline: item.locales[locale].title, url: `${origin}${route(locale, item.slug)}` })) };
    await writeFile(path.join(directory, "index.html"), page(locale, "", copy.title, copy.description, indexContent, indexSchema));
    for (const article of articles) {
      const metadata = article.locales[locale];
      const body = await readFile(path.join(root, "content/tutorials", locale, `${article.slug}.html`), "utf8");
      const headings = [...body.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)];
      const contents = `<nav class="tutorial-contents" aria-label="${copy.contents}"><strong>${copy.contents}</strong><ul>${headings.map((match) => `<li><a href="#${match[1]}">${match[2]}</a></li>`).join("")}</ul></nav>`;
      const content = `<a class="tutorial-back" href="${route(locale)}">← ${copy.guides}</a><article><header class="tutorial-heading"><p class="eyebrow">${copy.eyebrow}</p><h1>${escape(metadata.title)}</h1><p class="tutorial-lede">${escape(metadata.description)}</p><p class="tutorial-byline">${copy.author}</p></header>${contents}<div class="tutorial-body">${body}</div></article><section class="related-guides"><h2>${copy.related}</h2>${cards(locale, article.slug)}</section>`;
      const schema = { "@context": "https://schema.org", "@type": "Article", headline: metadata.title, description: metadata.description, inLanguage: copy.code, mainEntityOfPage: `${origin}${route(locale, article.slug)}`, author: { "@type": "Organization", name: "Ajigu", url: "https://ajigu.com/" }, publisher: { "@type": "Organization", name: "Moodsk", url: origin }, image: imageURL };
      const articleDirectory = path.join(directory, article.slug);
      await mkdir(articleDirectory, { recursive: true });
      await writeFile(path.join(articleDirectory, "index.html"), page(locale, article.slug, metadata.title, metadata.description, content, schema));
    }
  }
  console.log(`wrote ${Object.keys(locales).length * (articles.length + 1)} tutorial pages`);
}

export function tutorialSitemapEntries() {
  return ["", ...articles.map((item) => item.slug)].flatMap((slug) => Object.keys(locales).map((locale) => `  <url>\n    <loc>${origin}${route(locale, slug)}</loc>\n${Object.entries(locales).map(([key, value]) => `    <xhtml:link rel="alternate" hreflang="${value.code}" href="${origin}${route(key, slug)}"/>`).join("\n")}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}${route("en", slug)}"/>\n  </url>`));
}
