import type { APIRoute } from "astro";
import { absoluteUrl, projectSitemapEntries, resourceSitemapEntries, serviceSitemapEntries, staticSitemapEntries } from "../lib/seo";

const lastmod = new Date().toISOString();

export const GET: APIRoute = () => {
  const entries = [...staticSitemapEntries, ...serviceSitemapEntries, ...resourceSitemapEntries, ...projectSitemapEntries];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${absoluteUrl(entry.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
