import { getDb } from "./db";
import { blogPosts, blogCategories, blogTags, blogPostCategories, blogPostTags } from "../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

const SITE_URL = process.env.VITE_APP_URL || "https://communityforce.manus.space";
const SITE_TITLE = "CommunityForce Blog";
const SITE_DESCRIPTION = "Latest insights on awards management, grants, scholarships, and government solutions";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

export async function generateBlogRSS(): Promise<string> {
  const db = await getDb();
  if (!db) return generateEmptyFeed(SITE_TITLE, `${SITE_URL}/blog`, SITE_DESCRIPTION);
  
  const posts = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(50);

  const items = posts.map((post: any) => {
    const pubDate = new Date(post.publishedAt || post.createdAt).toUTCString();
    const link = `${SITE_URL}/blog/${post.slug}`;
    const description = escapeXml(post.excerpt || stripHtml(post.content).substring(0, 200));

    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      ${post.featuredImage ? `<enclosure url="${escapeXml(post.featuredImage)}" type="image/jpeg" />` : ""}
    </item>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
}

export async function generateCategoryRSS(categorySlug: string): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  
  const category = await db
    .select()
    .from(blogCategories)
    .where(eq(blogCategories.slug, categorySlug))
    .limit(1);

  if (category.length === 0) return null;

  const categoryData = category[0];

  // Get posts in this category
  const postIds = await db
    .select({ postId: blogPostCategories.blogPostId })
    .from(blogPostCategories)
    .where(eq(blogPostCategories.categoryId, categoryData.id));

  if (postIds.length === 0) {
    return generateEmptyFeed(
      `${SITE_TITLE} - ${categoryData.name}`,
      `${SITE_URL}/blog?category=${categorySlug}`,
      `Posts in category: ${categoryData.name}`
    );
  }

  const posts = await db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.status, "published"),
        // @ts-ignore - inArray type issue
        db.inArray(blogPosts.id, postIds.map(p => p.postId))
      )
    )
    .orderBy(desc(blogPosts.publishedAt))
    .limit(50);

  const items = posts.map((post: any) => {
    const pubDate = new Date(post.publishedAt || post.createdAt).toUTCString();
    const link = `${SITE_URL}/blog/${post.slug}`;
    const description = escapeXml(post.excerpt || stripHtml(post.content).substring(0, 200));

    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      <category>${escapeXml(categoryData.name)}</category>
    </item>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)} - ${escapeXml(categoryData.name)}</title>
    <link>${SITE_URL}/blog?category=${categorySlug}</link>
    <description>Posts in category: ${escapeXml(categoryData.name)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed/category/${categorySlug}.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
}

export async function generateTagRSS(tagSlug: string): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  
  const tag = await db
    .select()
    .from(blogTags)
    .where(eq(blogTags.slug, tagSlug))
    .limit(1);

  if (tag.length === 0) return null;

  const tagData = tag[0];

  // Get posts with this tag
  const postIds = await db
    .select({ postId: blogPostTags.blogPostId })
    .from(blogPostTags)
    .where(eq(blogPostTags.tagId, tagData.id));

  if (postIds.length === 0) {
    return generateEmptyFeed(
      `${SITE_TITLE} - ${tagData.name}`,
      `${SITE_URL}/blog?tag=${tagSlug}`,
      `Posts tagged with: ${tagData.name}`
    );
  }

  const posts = await db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.status, "published"),
        // @ts-ignore - inArray type issue
        db.inArray(blogPosts.id, postIds.map(p => p.postId))
      )
    )
    .orderBy(desc(blogPosts.publishedAt))
    .limit(50);

  const items = posts.map((post: any) => {
    const pubDate = new Date(post.publishedAt || post.createdAt).toUTCString();
    const link = `${SITE_URL}/blog/${post.slug}`;
    const description = escapeXml(post.excerpt || stripHtml(post.content).substring(0, 200));

    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      <category>${escapeXml(tagData.name)}</category>
    </item>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)} - ${escapeXml(tagData.name)}</title>
    <link>${SITE_URL}/blog?tag=${tagSlug}</link>
    <description>Posts tagged with: ${escapeXml(tagData.name)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed/tag/${tagSlug}.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
}

function generateEmptyFeed(title: string, link: string, description: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${link}</link>
    <description>${escapeXml(description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`;
}
