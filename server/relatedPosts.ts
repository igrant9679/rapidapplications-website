import { getDb } from './db';
import { blogPosts, blogPostCategories, blogPostTags, users } from '../drizzle/schema';
import { eq, and, inArray, ne, desc } from 'drizzle-orm';

/**
 * Get related posts based on shared categories and tags
 * Returns posts that share the most categories/tags with the given post
 */
export async function getRelatedPosts(postId: number, limit: number = 3) {
  const db = await getDb();
  if (!db) return [];

  // First, get the categories and tags of the current post
  const postCategories = await db
    .select({ categoryId: blogPostCategories.categoryId })
    .from(blogPostCategories)
    .where(eq(blogPostCategories.blogPostId, postId));

  const postTags = await db
    .select({ tagId: blogPostTags.tagId })
    .from(blogPostTags)
    .where(eq(blogPostTags.blogPostId, postId));

  const categoryIds = postCategories.map(pc => pc.categoryId);
  const tagIds = postTags.map(pt => pt.tagId);

  // If no categories or tags, return empty array
  if (categoryIds.length === 0 && tagIds.length === 0) {
    return [];
  }

  // Find posts that share categories or tags
  const relatedByCategory = categoryIds.length > 0
    ? await db
        .select({ blogPostId: blogPostCategories.blogPostId })
        .from(blogPostCategories)
        .where(
          and(
            inArray(blogPostCategories.categoryId, categoryIds),
            ne(blogPostCategories.blogPostId, postId)
          )
        )
    : [];

  const relatedByTag = tagIds.length > 0
    ? await db
        .select({ blogPostId: blogPostTags.blogPostId })
        .from(blogPostTags)
        .where(
          and(
            inArray(blogPostTags.tagId, tagIds),
            ne(blogPostTags.blogPostId, postId)
          )
        )
    : [];

  // Combine and count occurrences (posts with more shared categories/tags rank higher)
  const relatedPostIds = [
    ...relatedByCategory.map(r => r.blogPostId),
    ...relatedByTag.map(r => r.blogPostId),
  ];

  // Count occurrences and sort by frequency
  const postIdCounts = relatedPostIds.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Get top N post IDs sorted by relevance
  const topPostIds = Object.entries(postIdCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([id]) => Number(id));

  if (topPostIds.length === 0) {
    return [];
  }

  // Fetch full post data
  const relatedPosts = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      coverImage: blogPosts.coverImage,
      authorId: blogPosts.authorId,
      authorName: users.name,
      publishedAt: blogPosts.publishedAt,
      readTimeMinutes: blogPosts.readTimeMinutes,
      createdAt: blogPosts.createdAt,
    })
    .from(blogPosts)
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .where(
      and(
        inArray(blogPosts.id, topPostIds),
        eq(blogPosts.status, 'published')
      )
    )
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);

  return relatedPosts;
}
