/**
 * Reproducible, dependency-free Search Console remediation checks.
 * Run at repository root: node scripts/check-seo-indexing.mjs
 * These static checks cannot confirm Google's indexing decisions or live WAF access.
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import assert from "node:assert/strict";

const root = resolve("artifacts/comfortline-website");
const read = (relative) => readFileSync(join(root, relative), "utf8");
const sitemap = read("public/sitemap.xml");
const server = read("server.mjs");
const app = read("src/App.tsx");
const ssr = read("src/ssr-entry.tsx");
const routes = read("src/pages/route-landing-page.tsx");

const blocks = [...sitemap.matchAll(/<url>\s*([\s\S]*?)<\/url>/g)].map((m) => m[1]);
const entries = blocks.map((block) => {
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
  const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
  assert(loc, "Sitemap URL with no <loc>");
  const url = new URL(loc);
  assert.equal(url.origin, "https://comfortline.by", "Other domain in sitemap: " + loc);
  assert(!url.search && !url.hash, "Query/hash in canonical sitemap URL: " + loc);
  assert(url.pathname === "/" || !url.pathname.endsWith("/"), "Redirecting slash in sitemap: " + loc);
  return { pathname: decodeURIComponent(url.pathname), lastmod };
});
assert(entries.length >= 100, "Unexpectedly small sitemap, expected 100+ entries");
assert.equal(new Set(entries.map((x) => x.pathname)).size, entries.length, "Duplicate canonical URLs in sitemap");
const set = new Set(entries.map((x) => x.pathname));

const changedRoutePages = [
  ["ski-transfer.tsx", "/лыжный-трансфер", "/ski-transfer"],
  ["minsk-jurmala-transfer.tsx", "/трансфер-минск-юрмала", "/minsk-jurmala-transfer"],
  ["minsk-krakow-transfer.tsx", "/трансфер-минск-краков", "/minsk-krakow-transfer"],
  ["minsk-wroclaw-transfer.tsx", "/трансфер-минск-вроцлав", "/minsk-wroclaw-transfer"],
  ["minsk-katowice-transfer.tsx", "/трансфер-минск-катовице", "/minsk-katowice-transfer"],
  ["minsk-gdansk-transfer.tsx", "/трансфер-минск-гданьск", "/minsk-gdansk-transfer"],
  ["minsk-lodz-transfer.tsx", "/трансфер-минск-лодзь", "/minsk-lodz-transfer"],
  ["minsk-poznan-transfer.tsx", "/трансфер-минск-познань", "/minsk-poznan-transfer"],
  ["minsk-liepaja-transfer.tsx", "/трансфер-минск-лиепая", "/minsk-liepaja-transfer"],
  ["minsk-ventspils-transfer.tsx", "/трансфер-минск-вентспилс", "/minsk-ventspils-transfer"],
  ["minsk-daugavpils-transfer.tsx", "/трансфер-минск-даугавпилс", "/minsk-daugavpils-transfer"],
  ["minsk-riga-airport.tsx", "/трансфер-минск-рига-аэропорт", "/minsk-riga-airport"],
  ["riga-transfer.tsx", "/трансфер-рига", "/riga-transfer"],
  ["warsaw-transfer.tsx", "/трансфер-варшава", "/warsaw-transfer"],
  ["latvia-transfer-country.tsx", "/трансфер-в-латвию", "/latvia-transfer"],
  ["poland-transfer-country.tsx", "/трансфер-в-польшу", "/poland-transfer"],
  ["minsk-druskininkai-transfer.tsx", "/трансфер-минск-друскининкай", "/minsk-druskininkai-transfer"],
];

for (const [filename, ru, en] of changedRoutePages) {
  const src = read("src/pages/" + filename);
  for (const slug of [ru, en]) {
    assert(set.has(slug), "Missing canonical from sitemap: " + slug);
    assert(src.includes(slug), "Route's page missing slug: " + slug);
    assert(server.includes(slug), "Production server does not recognize route: " + slug);
    assert(app.includes(slug), "Client router missing route: " + slug);
    assert(ssr.includes(slug), "SSR router missing route: " + slug);
    assert.equal(entries.find((x) => x.pathname === slug)?.lastmod, "2026-10-22", "Outdated lastmod: " + slug);
  }
}

const sitePages = readdirSync(join(root, "src/pages")).filter((f) => f.endsWith(".tsx"));
for (const file of sitePages) {
  const src = read("src/pages/" + file);
  for (const bad of ["Урбаны / Патарниеки", "Urbany / Pāternieki", "Берёза / Половцы", "Berёza / Połowce", "Песчатка–Половцы или Кукурыки"]) {
    assert(!src.includes(bad), "Outdated or mismatched crossing text in " + file + ": " + bad);
  }
}
for (const route of ["/трансфер-минск-юрмала", "/трансфер-минск-краков", "/трансфер-минск-вроцлав", "/трансфер-минск-друскининкай", "/лыжный-трансфер"]) {
  assert(routes.includes('"' + route + '": ['), "Missing contextual links for " + route);
}
assert(server.includes("must-revalidate"), "Crawl control documents must revalidate");
assert(server.includes('"X-Robots-Tag": "noindex"'), "RSS and 404 must be noindex");
console.log("PASS:", entries.length, "sitemap URLs;", changedRoutePages.length * 2, "updated canonical URLs; 404/cache rules; bilingual route links; checkpoint wording.");
