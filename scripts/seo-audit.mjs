import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productionOrigin = "https://weldentdental.com";
const failures = [];
const legacyRedirects = new Map([
  ["/contact", "/book"],
  ["/booking", "/book"],
  ["/blog/aligners-vs-braces", "/blog/braces-treatment-guide"],
  ["/services/emergency-dentist", "/services/check-ups"],
  ["/services/preventive-care", "/services/preventive-restorations"],
  ["/services/crown-bridge", "/services/crown-veneers-bridges"],
  ["/services/smile-correction", "/services/teeth-whitening-cosmetic"],
  ["/services/teeth-whitening", "/services/teeth-whitening-cosmetic"],
  ["/services/braces", "/services/braces-aligners"],
  ["/services/extractions", "/services/surgical-extraction"],
  ["/services/geriatric-dentistry", "/services/check-ups"],
  ["/services/gum-therapy", "/services/periodontal-gum-care"],
]);

function read(filePath) {
  return fs.readFileSync(path.join(repoRoot, filePath), "utf8");
}

function check(condition, message) {
  if (!condition) failures.push(message);
}

function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function between(source, start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  if (startIndex < 0 || endIndex < 0) return "";
  return source.slice(startIndex, endIndex);
}

function frontendFiles(directory) {
  return fs
    .readdirSync(path.join(repoRoot, directory), { withFileTypes: true })
    .flatMap((entry) => {
      const relativePath = path.join(directory, entry.name);
      if (entry.isDirectory()) return frontendFiles(relativePath);
      return /\.(?:ts|tsx)$/.test(entry.name) ? [relativePath] : [];
    });
}

function sourceAudit() {
  const services = read("src/lib/services.ts");
  const siteCore = read("src/lib/site-core.ts");
  const site = read("src/lib/site.ts");
  const server = read("src/server.ts");
  const rootRoute = read("src/routes/__root.tsx");
  const viteConfig = read("vite.config.ts");
  const sitemapEntries = sitemapUrls(read("public/sitemap.xml"));
  const staticPages = JSON.parse(read("src/lib/indexable-pages.json"));
  const slugs = [...services.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
  const doctorSection = between(site, "export const doctors", "const galleryCases");
  const doctorSlugs = [...doctorSection.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
  const postSection = between(site, "export const posts", "export const faqs");
  const postSlugs = [...postSection.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);

  check(slugs.length === new Set(slugs).size, "Duplicate service slug found");
  check(!slugs.includes("emergency-dentist"), "Emergency service was reintroduced");
  check(
    !services.toLowerCase().includes("conscious sedation"),
    "Service-level sedation claim found",
  );

  check(!viteConfig.includes('{ path: "/contact" }'), "/contact is being prerendered");
  check(!viteConfig.includes('{ path: "/booking" }'), "/booking is being prerendered");

  check(
    !viteConfig.includes('{ path: "/" }'),
    "Homepage must remain runtime SSR so year-dependent statistics are not frozen at build time",
  );

  check(!rootRoute.includes('foundingDate: "2023"'), "Unverified clinic foundingDate found");
  check(!rootRoute.includes('name: "Smiles treated"'), "Generated smile count found in schema");

  check(siteCore.includes("+91 90359 95828"), "Canonical display phone is missing");
  check(siteCore.includes("sheetal@weldentdental.com"), "Canonical email is missing");
  check(
    server.includes('import staticIndexablePages from "./lib/indexable-pages.json"'),
    "Runtime sitemap is not using the shared static-page source",
  );

  const forbiddenSitemapUrls = new Set(
    [...legacyRedirects.keys()].map((route) => `${productionOrigin}${route}`),
  );
  const expectedSitemapUrls = new Set([
    ...staticPages.map(({ path: route }) => `${productionOrigin}${route}`),
    ...slugs.map((slug) => `${productionOrigin}/services/${slug}`),
    ...doctorSlugs.map((slug) => `${productionOrigin}/doctors/${slug}`),
    ...postSlugs.map((slug) => `${productionOrigin}/blog/${slug}`),
  ]);

  check(sitemapEntries.length === new Set(sitemapEntries).size, "Duplicate sitemap URL found");

  for (const url of sitemapEntries) {
    check(
      url.startsWith(`${productionOrigin}/`) || url === `${productionOrigin}/`,
      `Wrong sitemap host: ${url}`,
    );

    check(!forbiddenSitemapUrls.has(url), `Forbidden sitemap URL: ${url}`);
    check(!url.includes(".workers.dev"), `Preview URL found in sitemap: ${url}`);
    check(!url.startsWith("https://www."), `www URL found in sitemap: ${url}`);
    const parsed = new URL(url);
    check(!parsed.search && !parsed.hash, `Parameterized sitemap URL found: ${url}`);
    check(
      parsed.pathname === "/" || !parsed.pathname.endsWith("/"),
      `Trailing-slash sitemap URL found: ${url}`,
    );
    check(expectedSitemapUrls.has(url), `Unexpected sitemap URL: ${url}`);
  }

  for (const url of expectedSitemapUrls) {
    check(sitemapEntries.includes(url), `Canonical URL missing from sitemap: ${url}`);
  }

  const filesToCheck = [
    ...frontendFiles("src/components"),
    ...frontendFiles("src/routes"),
    ...frontendFiles("src/lib"),
  ];
  const linkPrefixes = ['to="', 'href="', 'to: "', 'url: "', 'absoluteUrl("'];

  for (const file of filesToCheck) {
    const content = read(file);

    for (const target of legacyRedirects.keys()) {
      for (const prefix of linkPrefixes) {
        check(!content.includes(`${prefix}${target}`), `${file} links to legacy route ${target}`);
      }
    }
  }
}

async function buildAudit() {
  const serverOutputPath = "dist/server/server.js";
  const serverOutput = path.join(repoRoot, serverOutputPath);

  check(
    fs.existsSync(serverOutput),
    `${serverOutputPath} is missing; runtime SSR cannot serve the homepage`,
  );

  for (const url of sitemapUrls(read("public/sitemap.xml"))) {
    const pathname = new URL(url).pathname;

    // Homepage is intentionally runtime SSR.
    // Year-dependent statistics such as "Smiles treated" must be calculated
    // when the request arrives instead of being frozen during deployment.
    if (pathname === "/") continue;

    const pagePath = `${pathname.slice(1)}/index.html`;

    check(
      fs.existsSync(path.join(repoRoot, "dist/client", pagePath)),
      `Prerendered page is missing: ${pathname}`,
    );
  }

  if (!fs.existsSync(serverOutput)) return;

  const serverModule = await import(pathToFileURL(serverOutput).href);
  const app = serverModule.default;
  const runtimeSitemap = await app.fetch(new Request(`${productionOrigin}/sitemap.xml`));
  const runtimeUrls = sitemapUrls(await runtimeSitemap.text());
  const staticUrls = sitemapUrls(read("public/sitemap.xml"));

  check(runtimeSitemap.status === 200, `Built runtime sitemap returned ${runtimeSitemap.status}`);
  check(
    JSON.stringify(runtimeUrls) === JSON.stringify(staticUrls),
    "Built runtime sitemap differs from public/sitemap.xml",
  );

  const representativeRedirects = [
    ["https://www.weldentdental.com/services/braces/", `${productionOrigin}/services/braces`],
    [
      `${productionOrigin}/services/extractions?ref=seo-audit`,
      `${productionOrigin}/services/surgical-extraction?ref=seo-audit`,
    ],
    [`${productionOrigin}/about/`, `${productionOrigin}/about`],
  ];

  for (const [from, to] of representativeRedirects) {
    const response = await app.fetch(new Request(from));
    check(response.status === 301, `Built redirect ${from} returned ${response.status}`);
    check(response.headers.get("location") === to, `Built redirect ${from} points incorrectly`);
  }
}

function htmlValue(html, expression) {
  return html.match(expression)?.[1]?.trim() ?? "";
}

async function fetchManual(url) {
  return fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
  });
}

async function liveAudit(baseUrl) {
  const origin = new URL(baseUrl).origin;

  const robots = await fetch(`${origin}/robots.txt`);
  const robotsText = await robots.text();

  check(robots.status === 200, `robots.txt returned ${robots.status}`);

  check(
    robots.headers.get("content-type")?.includes("text/plain"),
    "robots.txt content type is wrong",
  );

  check(
    robotsText.includes("User-agent: *\nAllow: /"),
    "Production robots does not allow crawling",
  );

  check(
    robotsText.includes(`Sitemap: ${productionOrigin}/sitemap.xml`),
    "robots.txt sitemap is wrong",
  );

  const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
  const urls = sitemapUrls(await sitemapResponse.text());

  check(sitemapResponse.status === 200, `sitemap.xml returned ${sitemapResponse.status}`);

  check(
    sitemapResponse.headers.get("content-type")?.includes("xml"),
    "sitemap content type is wrong",
  );

  for (const url of urls) {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15_000),
    });

    const html = await response.text();

    const canonicals = [
      ...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/gi),
    ].map((match) => match[1]?.trim() ?? "");
    const canonical = canonicals[0] ?? "";

    check(response.status === 200, `${url} returned ${response.status}`);

    check(!response.headers.get("x-robots-tag")?.includes("noindex"), `${url} has noindex header`);

    check(Boolean(htmlValue(html, /<title[^>]*>([^<]+)/i)), `${url} is missing a title`);

    check(
      Boolean(htmlValue(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i)),
      `${url} is missing a description`,
    );

    check(Boolean(htmlValue(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)), `${url} is missing an H1`);

    check(canonical === url, `${url} canonical is ${canonical || "missing"}`);
    check(canonicals.length === 1, `${url} has ${canonicals.length} canonical tags`);
  }

  for (const [from, to] of legacyRedirects) {
    const response = await fetchManual(`${origin}${from}`);

    check(response.status === 301, `${from} did not return 301`);

    check(
      response.headers.get("location") === `${productionOrigin}${to}`,
      `${from} redirects incorrectly`,
    );
  }

  const queryRedirect = await fetchManual(`${origin}/services/braces?utm_source=seo-audit`);
  check(
    queryRedirect.headers.get("location") ===
      `${productionOrigin}/services/braces-aligners?utm_source=seo-audit`,
    "Legacy redirect does not preserve its query string",
  );

  for (const route of [
    "/about/",
    "/services/braces-aligners/",
    "/doctors/dr-sheetal-kumar-g/",
    "/blog/braces-treatment-guide/",
  ]) {
    const response = await fetchManual(`${origin}${route}?utm_source=seo-audit`);
    const normalized = route.replace(/\/+$/, "");
    check(response.status === 301, `${route} did not return 301`);
    check(
      response.headers.get("location") === `${productionOrigin}${normalized}?utm_source=seo-audit`,
      `${route} does not redirect directly to its canonical URL`,
    );
  }

  if (origin === productionOrigin) {
    const www = await fetchManual("https://www.weldentdental.com/about/?utm_source=seo-audit");
    check(www.status === 301, `www hostname returned ${www.status}, expected 301`);
    check(
      www.headers.get("location") === `${productionOrigin}/about?utm_source=seo-audit`,
      "www hostname does not redirect directly to the normalized canonical URL",
    );
  }

  const missing = await fetch(`${origin}/seo-audit-definitely-missing-page`);

  check(missing.status === 404, `Random missing URL returned ${missing.status}, expected 404`);

  const api = await fetch(`${origin}/api/book`);

  check(api.headers.get("x-robots-tag")?.includes("noindex"), "/api/book is not marked noindex");
}

sourceAudit();

const buildArg = process.argv.includes("--build");

if (buildArg) {
  await buildAudit();
}

const baseArg = process.argv.find((value) => value.startsWith("--base-url="));

if (baseArg) {
  await liveAudit(baseArg.slice("--base-url=".length));
}

if (failures.length) {
  console.error(`SEO audit failed with ${failures.length} issue(s):`);

  failures.forEach((failure) => {
    console.error(`- ${failure}`);
  });

  process.exitCode = 1;
} else {
  const scope = ["source", buildArg && "build", baseArg && "live URLs"]
    .filter(Boolean)
    .join(" and ");

  console.log(`SEO audit passed for ${scope}.`);
}
