import { Request, Response } from "express";
import * as db from "./db";

export async function generateSitemap(req: Request, res: Response) {
  try {
    const baseUrl = `https://${req.get("host")}`;

    // Get all published blog posts
    const posts = await db.getAllBlogPosts();
    const publishedPosts = posts.filter((p) => p.status === "published");

    // Get all published CMS pages
    const pages = await db.getAllCmsPages();
    const publishedPages = pages.filter(
      (p) => p.status === "published" && p.visibility === "public"
    );

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
${publishedPosts
  .map(
    (post) => `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("\n")}
${publishedPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}/${page.slug}</loc>
    <lastmod>${page.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
}
