import type { APIRoute } from "astro";
import { absoluteUrl, projectSitemapEntries, resourceSitemapEntries, serviceSitemapEntries, staticSitemapEntries } from "../lib/seo";
import { WORK_HERO_IMAGE_CAPTION, WORK_HERO_POSTER_SRC } from "../lib/work-sequence";

const lastmod = new Date().toISOString();
const imageEntriesByPath: Record<string, Array<{ loc: string; title?: string; caption?: string }>> = {
  "/work": [
    {
      loc: absoluteUrl(WORK_HERO_POSTER_SRC),
      title: "Dubai skyline motherboard sequence poster",
      caption: WORK_HERO_IMAGE_CAPTION,
    },
  ],
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const GET: APIRoute = () => {
  const entries = [...staticSitemapEntries, ...serviceSitemapEntries, ...resourceSitemapEntries, ...projectSitemapEntries];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries
  .map((entry) => {
    const imageXml = (imageEntriesByPath[entry.path] || [])
      .map(
        (image) => `    <image:image>
      <image:loc>${escapeXml(image.loc)}</image:loc>${image.title ? `
      <image:title>${escapeXml(image.title)}</image:title>` : ""}${image.caption ? `
      <image:caption>${escapeXml(image.caption)}</image:caption>` : ""}
    </image:image>`,
      )
      .join("\n");

    return `  <url>
    <loc>${absoluteUrl(entry.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>${imageXml ? `
${imageXml}` : ""}
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
