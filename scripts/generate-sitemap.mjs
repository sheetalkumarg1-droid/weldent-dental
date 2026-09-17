import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://weldentdental.com";

function read(filePath) {
  return fs.readFileSync(path.join(repoRoot, filePath), "utf8");
}

function quotedValues(source, key) {
  return [...source.matchAll(new RegExp(`${key}\\s*:\\s*"([^"]+)"`, "g"))].map((match) => match[1]);
}

function between(source, start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  if (startIndex < 0 || endIndex < 0) throw new Error(`Could not parse section: ${start}`);
  return source.slice(startIndex, endIndex);
}

const staticRoutes = JSON.parse(read("src/lib/indexable-pages.json")).map(
  ({ path: route, lastModified }) => [route, lastModified],
);

const servicesSource = read("src/lib/services.ts");
const serviceDate = servicesSource.match(/const dateModified = "([^"]+)"/)?.[1];
if (!serviceDate) throw new Error("Service dateModified was not found");
const serviceRoutes = [...new Set(quotedValues(servicesSource, "slug"))].map((slug) => [
  `/services/${slug}`,
  serviceDate,
]);

const siteSource = read("src/lib/site.ts");
const doctorSection = between(siteSource, "export const doctors", "const galleryCases");
const doctorRoutes = [...new Set(quotedValues(doctorSection, "slug"))].map((slug) => [
  `/doctors/${slug}`,
  "2026-09-09",
]);

const postSection = between(siteSource, "export const posts", "export const faqs");
const postRoutes = [
  ...postSection.matchAll(/slug:\s*"([^"]+)"[\s\S]*?dateModified:\s*"([^"]+)"/g),
].map((match) => [`/blog/${match[1]}`, match[2]]);

const routes = [...staticRoutes, ...serviceRoutes, ...doctorRoutes, ...postRoutes];
const seen = new Set();
for (const [route] of routes) {
  if (seen.has(route)) throw new Error(`Duplicate sitemap route: ${route}`);
  seen.add(route);
}

const entries = routes
  .map(
    ([route, lastmod]) =>
      `  <url>\n    <loc>${siteUrl}${route}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
const outputPath = path.join(repoRoot, "public", "sitemap.xml");
fs.writeFileSync(outputPath, sitemap, "utf8");
console.log(`Wrote ${outputPath} with ${routes.length} canonical URLs.`);
