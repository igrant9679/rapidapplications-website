import { getDb } from "./db";
import { blogPosts, blogCategories, blogTags, blogPostCategories, blogPostTags } from "../drizzle/schema";
import { eq, and, inArray, desc } from "drizzle-orm";

/**
 * Get blog posts by category slug with pagination
 */
export async function getPostsByCategory(categorySlug: string, page: number = 1, pageSize: number = 10) {
  const db = await getDb();
  if (!db) return { posts: [], total: 0, category: null };

  // Get category by slug
  const categories = await db
    .select()
    .from(blogCategories)
    .where(eq(blogCategories.slug, categorySlug))
    .limit(1);

  if (categories.length === 0) {
    return { posts: [], total: 0, category: null };
  }

  const category = categories[0];

  // Get all post IDs in this category
  const postCategories = await db
    .select({ blogPostId: blogPostCategories.blogPostId })
    .from(blogPostCategories)
    .where(eq(blogPostCategories.categoryId, category.id));

  const postIds = postCategories.map(pc => pc.blogPostId);

  if (postIds.length === 0) {
    return { posts: [], total: 0, category };
  }

  // Get total count
  const allPosts = await db
    .select()
    .from(blogPosts)
    .where(
      and(
        inArray(blogPosts.id, postIds),
        eq(blogPosts.status, "published")
      )
    );

  const total = allPosts.length;

  // Get paginated posts
  const offset = (page - 1) * pageSize;
  const posts = await db
    .select()
    .from(blogPosts)
    .where(
      and(
        inArray(blogPosts.id, postIds),
        eq(blogPosts.status, "published")
      )
    )
    .orderBy(desc(blogPosts.publishedAt))
    .limit(pageSize)
    .offset(offset);

  return { posts, total, category };
}

/**
 * Get blog posts by tag slug with pagination
 */
export async function getPostsByTag(tagSlug: string, page: number = 1, pageSize: number = 10) {
  const db = await getDb();
  if (!db) return { posts: [], total: 0, tag: null };

  // Get tag by slug
  const tags = await db
    .select()
    .from(blogTags)
    .where(eq(blogTags.slug, tagSlug))
    .limit(1);

  if (tags.length === 0) {
    return { posts: [], total: 0, tag: null };
  }

  const tag = tags[0];

  // Get all post IDs with this tag
  const postTags = await db
    .select({ blogPostId: blogPostTags.blogPostId })
    .from(blogPostTags)
    .where(eq(blogPostTags.tagId, tag.id));

  const postIds = postTags.map(pt => pt.blogPostId);

  if (postIds.length === 0) {
    return { posts: [], total: 0, tag };
  }

  // Get total count
  const allPosts = await db
    .select()
    .from(blogPosts)
    .where(
      and(
        inArray(blogPosts.id, postIds),
        eq(blogPosts.status, "published")
      )
    );

  const total = allPosts.length;

  // Get paginated posts
  const offset = (page - 1) * pageSize;
  const posts = await db
    .select()
    .from(blogPosts)
    .where(
      and(
        inArray(blogPosts.id, postIds),
        eq(blogPosts.status, "published")
      )
    )
    .orderBy(desc(blogPosts.publishedAt))
    .limit(pageSize)
    .offset(offset);

  return { posts, total, tag };
}

/**
 * Get subcategories of a category
 */
export async function getSubcategories(categoryId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(blogCategories)
    .where(eq(blogCategories.parentId, categoryId))
    .orderBy(blogCategories.name);
}
