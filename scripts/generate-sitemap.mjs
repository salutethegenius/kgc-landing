import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const SITE_URL = "https://thekemisgroup.com";

const urls = [
  "/", // Primary homepage
];

const sitemapEntries = urls
  .map(
    (path) => `
  <url>
    <loc>${SITE_URL}${path}</loc>
  </url>`
  )
  .join("");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;

const projectRoot = resolve(new URL("..", import.meta.url).pathname);
const outPath = resolve(projectRoot, "public", "sitemap.xml");

await writeFile(outPath, sitemap.trim() + "\n", "utf8");

console.log(`sitemap.xml generated at ${outPath}`);

