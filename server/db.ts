import { eq, desc, and, or, like, sql, lt, inArray, isNull } from "drizzle-orm";
import type { InsertPageView, InsertNotification } from "../drizzle/schema";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  blogPosts, 
  blogCategories,
  pageViews, 
  blogTags, 
  blogPostCategories, 
  blogPostTags,
  blogComments,
  emailSubscribers,
  cmsPages,
  pageVersions,
  media,
  mediaTags,
  mediaImageTags,
  mediaCollections,
  collectionImages,
  importHistory,
  InsertBlogPost, 
  InsertBlogCategory,
  InsertBlogTag,
  InsertCmsPage,
  InsertMedia,
  InsertMediaTag,
  InsertMediaCollection,
  InsertUser, 
  users,
  notifications,
  blogSeries,
  blogSeriesPosts,
  InsertBlogSeries,
  InsertBlogSeriesPost
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========================================
// Blog Post Queries
// ========================================

/**
 * Get all published blog posts, ordered by publish date (newest first)
 */
export async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  
  const posts = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      content: blogPosts.content,
      coverImage: blogPosts.coverImage,
      authorId: blogPosts.authorId,
      authorName: users.name,
      authorEmail: users.email,
      status: blogPosts.status,
      publishedAt: blogPosts.publishedAt,
      scheduledPublishAt: blogPosts.scheduledPublishAt,
      tags: blogPosts.tags,
      metaDescription: blogPosts.metaDescription,
      readTimeMinutes: blogPosts.readTimeMinutes,
      metaTitle: blogPosts.metaTitle,
      ogTitle: blogPosts.ogTitle,
      ogDescription: blogPosts.ogDescription,
      ogImage: blogPosts.ogImage,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
    })
    .from(blogPosts)
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt));
  
  return posts;
}

/**
 * Get a single blog post by slug (published only for public, any status for admin)
 */
export async function getBlogPostBySlug(slug: string, includeUnpublished = false) {
  const db = await getDb();
  if (!db) return undefined;
  
  const conditions = includeUnpublished
    ? eq(blogPosts.slug, slug)
    : and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published"));
  
  const result = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      content: blogPosts.content,
      coverImage: blogPosts.coverImage,
      authorId: blogPosts.authorId,
      authorName: users.name,
      authorEmail: users.email,
      status: blogPosts.status,
      publishedAt: blogPosts.publishedAt,
      scheduledPublishAt: blogPosts.scheduledPublishAt,
      tags: blogPosts.tags,
      metaDescription: blogPosts.metaDescription,
      readTimeMinutes: blogPosts.readTimeMinutes,
      metaTitle: blogPosts.metaTitle,
      ogTitle: blogPosts.ogTitle,
      ogDescription: blogPosts.ogDescription,
      ogImage: blogPosts.ogImage,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
    })
    .from(blogPosts)
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .where(conditions)
    .limit(1);
  
  if (result.length === 0) return undefined;
  
  const post = result[0];
  
  // Fetch categories for this post
  const categories = await getCategoriesForPost(post.id);
  
  // Fetch tags for this post
  const tags = await getTagsForPost(post.id);
  
  return {
    ...post,
    categories,
    tags
  };
}

/**
 * Get all blog posts (including drafts) - admin only
 */
export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.updatedAt));
}

/**
 * Create a new blog post
 */
export async function createBlogPost(post: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(blogPosts).values(post);
  return Number((result as any).insertId || (result as any)[0]?.insertId || 0);
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(id: number, updates: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // If status is changing to published and publishedAt is not set, set it now
  if (updates.status === "published" && !updates.publishedAt) {
    updates.publishedAt = new Date();
  }
  
  await db.update(blogPosts).set(updates).where(eq(blogPosts.id, id));
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

/**
 * Get blog post by ID
 */
export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Search blog posts with filters
 */
export async function searchBlogPosts(params: {
  query?: string;
  categoryId?: number;
  tagId?: number;
  authorId?: number;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return { posts: [], total: 0, page: 1, limit: 10 };

  const { query, categoryId, tagId, authorId, startDate, endDate, page = 1, limit = 10 } = params;
  const offset = (page - 1) * limit;

  // Build WHERE conditions
  const conditions = [eq(blogPosts.status, "published")];

  // Text search in title, excerpt, and content with relevance scoring
  let relevanceScore = sql`0`;
  if (query && query.trim()) {
    const searchTerm = `%${query.trim()}%`;
    const lowerQuery = query.trim().toLowerCase();
    
    conditions.push(
      sql`(
        LOWER(${blogPosts.title}) LIKE ${searchTerm} OR
        LOWER(${blogPosts.excerpt}) LIKE ${searchTerm} OR
        LOWER(${blogPosts.content}) LIKE ${searchTerm}
      )`
    );
    
    // Calculate relevance score:
    // - Exact title match: 100 points
    // - Title contains query: 50 points
    // - Excerpt contains query: 20 points
    // - Content contains query: 10 points
    relevanceScore = sql`(
      CASE WHEN LOWER(${blogPosts.title}) = ${lowerQuery} THEN 100 ELSE 0 END +
      CASE WHEN LOWER(${blogPosts.title}) LIKE ${searchTerm} THEN 50 ELSE 0 END +
      CASE WHEN LOWER(${blogPosts.excerpt}) LIKE ${searchTerm} THEN 20 ELSE 0 END +
      CASE WHEN LOWER(${blogPosts.content}) LIKE ${searchTerm} THEN 10 ELSE 0 END
    )`;
  }

  // Author filter
  if (authorId) {
    conditions.push(eq(blogPosts.authorId, authorId));
  }

  // Date range filter
  if (startDate) {
    conditions.push(sql`${blogPosts.publishedAt} >= ${startDate}`);
  }
  if (endDate) {
    conditions.push(sql`${blogPosts.publishedAt} <= ${endDate}`);
  }

  // Base query with relevance score
  let postsQuery = db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      coverImage: blogPosts.coverImage,
      publishedAt: blogPosts.publishedAt,
      readTimeMinutes: blogPosts.readTimeMinutes,
      authorId: blogPosts.authorId,
      authorName: users.name,
      relevance: relevanceScore,
    })
    .from(blogPosts)
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .where(and(...conditions));

  // Category filter
  if (categoryId) {
    postsQuery = db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        coverImage: blogPosts.coverImage,
        publishedAt: blogPosts.publishedAt,
        readTimeMinutes: blogPosts.readTimeMinutes,
        authorId: blogPosts.authorId,
        authorName: users.name,
        relevance: relevanceScore,
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .innerJoin(blogPostCategories, eq(blogPosts.id, blogPostCategories.blogPostId))
      .where(and(...conditions, eq(blogPostCategories.categoryId, categoryId)));
  }

  // Tag filter
  if (tagId) {
    postsQuery = db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        coverImage: blogPosts.coverImage,
        publishedAt: blogPosts.publishedAt,
        readTimeMinutes: blogPosts.readTimeMinutes,
        authorId: blogPosts.authorId,
        authorName: users.name,
        relevance: relevanceScore,
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .innerJoin(blogPostTags, eq(blogPosts.id, blogPostTags.blogPostId))
      .where(and(...conditions, eq(blogPostTags.tagId, tagId)));
  }

  // Get total count
  const allResults = await postsQuery;
  const total = allResults.length;

  // Apply pagination and ordering
  // If search query exists, order by relevance first, then by date
  // Otherwise, just order by date
  const posts = query && query.trim()
    ? await postsQuery
        .orderBy(desc(relevanceScore), desc(blogPosts.publishedAt))
        .limit(limit)
        .offset(offset)
    : await postsQuery
        .orderBy(desc(blogPosts.publishedAt))
        .limit(limit)
        .offset(offset);

  return {
    posts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// ========================================
// Blog Category Queries
// ========================================

/**
 * Get all blog categories with hierarchical structure
 */
export async function getAllBlogCategories() {
  const db = await getDb();
  if (!db) return [];
  
  const allCategories = await db.select().from(blogCategories).orderBy(blogCategories.name);
  
  // Build hierarchical structure
  const categoryMap = new Map();
  const rootCategories: any[] = [];
  
  // First pass: create map of all categories
  allCategories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });
  
  // Second pass: build tree structure
  allCategories.forEach(cat => {
    const category = categoryMap.get(cat.id);
    if (cat.parentId) {
      const parent = categoryMap.get(cat.parentId);
      if (parent) {
        parent.children.push(category);
      } else {
        // Parent doesn't exist, treat as root
        rootCategories.push(category);
      }
    } else {
      rootCategories.push(category);
    }
  });
  
  return rootCategories;
}

/**
 * Create a new blog category
 */
export async function createBlogCategory(category: InsertBlogCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(blogCategories).values(category);
  const insertId = Number((result as any).insertId || (result as any)[0]?.insertId || 0);
  return { id: insertId, ...category };
}

/**
 * Update a blog category
 */
export async function updateBlogCategory(id: number, updates: Partial<InsertBlogCategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(blogCategories).set(updates).where(eq(blogCategories.id, id));
  return { success: true };
}

/**
 * Delete a blog category
 */
export async function deleteBlogCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(blogCategories).where(eq(blogCategories.id, id));
}

/**
 * Get all blog categories as flat list (for dropdowns/selects)
 */
export async function getAllBlogCategoriesFlat() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(blogCategories).orderBy(blogCategories.name);
}

// ========================================
// Blog Tag Queries
// ========================================

/**
 * Get all blog tags
 */
export async function getAllBlogTags() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(blogTags).orderBy(blogTags.name);
}

/**
 * Create a new blog tag
 */
export async function createBlogTag(tag: InsertBlogTag) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(blogTags).values(tag);
  const insertId = Number((result as any).insertId || (result as any)[0]?.insertId || 0);
  return { id: insertId, ...tag };
}

/**
 * Delete a blog tag
 */
export async function deleteBlogTag(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(blogTags).where(eq(blogTags.id, id));
}

/**
 * Assign categories to a blog post
 */
export async function assignCategoriesToPost(postId: number, categoryIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Delete existing categories
  await db.delete(blogPostCategories).where(eq(blogPostCategories.blogPostId, postId));
  
  // Insert new categories
  if (categoryIds.length > 0) {
    await db.insert(blogPostCategories).values(
      categoryIds.map(categoryId => ({ blogPostId: postId, categoryId }))
    );
  }
}

/**
 * Assign tags to a blog post
 */
export async function assignTagsToPost(postId: number, tagIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Delete existing tags
  await db.delete(blogPostTags).where(eq(blogPostTags.blogPostId, postId));
  
  // Insert new tags
  if (tagIds.length > 0) {
    await db.insert(blogPostTags).values(
      tagIds.map(tagId => ({ blogPostId: postId, tagId }))
    );
  }
}

/**
 * Get categories for a blog post
 */
export async function getCategoriesForPost(postId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({ category: blogCategories })
    .from(blogPostCategories)
    .innerJoin(blogCategories, eq(blogPostCategories.categoryId, blogCategories.id))
    .where(eq(blogPostCategories.blogPostId, postId));
  
  return result.map(r => r.category);
}

/**
 * Get tags for a blog post
 */
export async function getTagsForPost(postId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({ tag: blogTags })
    .from(blogPostTags)
    .innerJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
    .where(eq(blogPostTags.blogPostId, postId));
  
  return result.map(r => r.tag);
}

/**
 * CMS Pages Queries
 */

/**
 * Get all CMS pages
 */
export async function getAllCmsPages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cmsPages).orderBy(cmsPages.slug);
}

/**
 * Get CMS page by slug
 */
export async function getCmsPageBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(cmsPages).where(eq(cmsPages.slug, slug)).limit(1);
  return result[0] || null;
}

/**
 * Get CMS page by ID
 */
export async function getCmsPageById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(cmsPages).where(eq(cmsPages.id, id)).limit(1);
  return result[0] || null;
}

/**
 * Create CMS page
 */
export async function createCmsPage(page: InsertCmsPage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result: any = await db.insert(cmsPages).values(page);
  const insertId = Number(result[0]?.insertId || result.insertId);
  if (isNaN(insertId)) throw new Error("Failed to get insert ID");
  const inserted = await db.select().from(cmsPages).where(eq(cmsPages.id, insertId));
  return inserted[0];
}

/**
 * Update CMS page
 */
export async function updateCmsPage(id: number, updates: Partial<InsertCmsPage>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(cmsPages).set(updates).where(eq(cmsPages.id, id));
}

/**
 * Delete CMS page
 */
export async function deleteCmsPage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(cmsPages).where(eq(cmsPages.id, id));
}

/**
 * Create page version snapshot
 */
export async function createPageVersion(pageId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Get current page data
  const page = await getCmsPageById(pageId);
  if (!page) throw new Error("Page not found");
  
  // Get current version count
  const versions = await db.select().from(pageVersions).where(eq(pageVersions.pageId, pageId));
  const versionNumber = versions.length + 1;
  
  // Create version snapshot
  return db.insert(pageVersions).values({
    pageId,
    versionNumber,
    title: page.title,
    slug: page.slug,
    content: page.content,
    metaDescription: page.metaDescription,
    metaKeywords: page.metaKeywords,
    status: page.status,
    template: page.template,
    authorId: page.authorId,
    createdBy: userId,
  });
}

/**
 * Get page version history
 */
export async function getPageVersions(pageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(pageVersions)
    .where(eq(pageVersions.pageId, pageId))
    .orderBy(desc(pageVersions.versionNumber));
}

/**
 * Get specific page version
 */
export async function getPageVersion(versionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(pageVersions).where(eq(pageVersions.id, versionId));
  return result[0];
}

/**
 * Get CMS page by preview token
 */
export async function getCmsPageByPreviewToken(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(cmsPages)
    .where(and(
      eq(cmsPages.previewToken, token),
      sql`${cmsPages.previewExpiresAt} > NOW()`
    ));
  return result[0];
}

/**
 * Restore page from version
 */
export async function restorePageFromVersion(pageId: number, versionId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Get version data
  const version = await getPageVersion(versionId);
  if (!version) throw new Error("Version not found");
  
  // Create snapshot of current state before restoring
  await createPageVersion(pageId, userId);
  
  // Restore page to version state
  return db.update(cmsPages).set({
    title: version.title,
    content: version.content,
    metaDescription: version.metaDescription,
    metaKeywords: version.metaKeywords,
    status: version.status,
    template: version.template,
  }).where(eq(cmsPages.id, pageId));
}

/**
 * ===================
 * MEDIA LIBRARY QUERIES
 * ===================
 */

/**
 * Create media record
 */
export async function createMedia(mediaData: InsertMedia) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(media).values(mediaData);
  return result;
}

/**
 * Get all media with optional search, including tags
 */
export async function getAllMedia(searchTerm?: string) {
  const db = await getDb();
  if (!db) return [];
  
  let mediaResults;
  
  // If search term provided, filter by filename
  if (searchTerm) {
    const { like } = await import('drizzle-orm');
    mediaResults = await db.select().from(media)
      .where(like(media.fileName, `%${searchTerm}%`))
      .orderBy(desc(media.createdAt));
  } else {
    mediaResults = await db.select().from(media).orderBy(desc(media.createdAt));
  }
  
  // Fetch tags for each media item
  const mediaWithTags = await Promise.all(
    mediaResults.map(async (m) => {
      const tags = await getTagsForMedia(m.id);
      return { ...m, tags };
    })
  );
  
  return mediaWithTags;
}

/**
 * Get media by ID
 */
export async function getMediaById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(media).where(eq(media.id, id)).limit(1);
  return result[0] || null;
}

/**
 * Get media by user ID
 */
export async function getMediaByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(media).where(eq(media.uploadedBy, userId)).orderBy(desc(media.createdAt));
}

/**
 * Update media metadata
 */
export async function updateMedia(id: number, updates: Partial<InsertMedia>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(media).set(updates).where(eq(media.id, id));
}

/**
 * Delete media record
 */
export async function deleteMedia(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(media).where(eq(media.id, id));
}

/**
 * ===================
 * MEDIA TAG QUERIES
 * ===================
 */

/**
 * Create media tag
 */
export async function createMediaTag(tagData: InsertMediaTag) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(mediaTags).values(tagData);
}

/**
 * Get all media tags
 */
export async function getAllMediaTags() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(mediaTags).orderBy(mediaTags.name);
}

/**
 * Get media tag by ID
 */
export async function getMediaTagById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(mediaTags).where(eq(mediaTags.id, id)).limit(1);
  return result[0] || null;
}

/**
 * Delete media tag
 */
export async function deleteMediaTag(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(mediaTags).where(eq(mediaTags.id, id));
}

/**
 * Assign tag to media
 */
export async function assignTagToMedia(mediaId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(mediaImageTags).values({ mediaId, tagId });
}

/**
 * Unassign tag from media
 */
export async function unassignTagFromMedia(mediaId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(mediaImageTags).where(
    and(
      eq(mediaImageTags.mediaId, mediaId),
      eq(mediaImageTags.tagId, tagId)
    )
  );
}

/**
 * Get tags for a media item
 */
export async function getTagsForMedia(mediaId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: mediaTags.id,
      name: mediaTags.name,
      slug: mediaTags.slug,
      color: mediaTags.color,
      createdAt: mediaTags.createdAt,
    })
    .from(mediaImageTags)
    .innerJoin(mediaTags, eq(mediaImageTags.tagId, mediaTags.id))
    .where(eq(mediaImageTags.mediaId, mediaId));
  
  return result;
}

/**
 * Get media by tag ID, including tags for each image
 */
export async function getMediaByTagId(tagId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: media.id,
      fileName: media.fileName,
      fileKey: media.fileKey,
      url: media.url,
      mimeType: media.mimeType,
      fileSize: media.fileSize,
      width: media.width,
      height: media.height,
      uploadedBy: media.uploadedBy,
      altText: media.altText,
      caption: media.caption,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    })
    .from(mediaImageTags)
    .innerJoin(media, eq(mediaImageTags.mediaId, media.id))
    .where(eq(mediaImageTags.tagId, tagId))
    .orderBy(desc(media.createdAt));
  
  // Fetch tags for each media item
  const mediaWithTags = await Promise.all(
    result.map(async (m) => {
      const tags = await getTagsForMedia(m.id);
      return { ...m, tags };
    })
  );
  
  return mediaWithTags;
}

/**
 * Bulk delete media by IDs
 */
export async function bulkDeleteMedia(ids: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (ids.length === 0) return;
  
  const { inArray } = await import('drizzle-orm');
  return db.delete(media).where(inArray(media.id, ids));
}

/**
 * Get image usage - find where an image is referenced in blog posts and CMS pages
 */
export async function getImageUsage(imageUrl: string) {
  const db = await getDb();
  if (!db) return { blogPosts: [], cmsPages: [] };
  
  const { like } = await import('drizzle-orm');
  
  // Find blog posts that reference this image
  const blogPostResults = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
    })
    .from(blogPosts)
    .where(like(blogPosts.content, `%${imageUrl}%`));
  
  // Find CMS pages that reference this image
  const cmsPageResults = await db
    .select({
      id: cmsPages.id,
      title: cmsPages.title,
      slug: cmsPages.slug,
    })
    .from(cmsPages)
    .where(like(cmsPages.content, `%${imageUrl}%`));
  
  return {
    blogPosts: blogPostResults,
    cmsPages: cmsPageResults,
  };
}

/**
 * Create a new media collection
 */
export async function createCollection(collection: InsertMediaCollection) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(mediaCollections).values(collection);
}

/**
 * Get all collections
 */
export async function getAllCollections() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(mediaCollections).orderBy(desc(mediaCollections.createdAt));
}

/**
 * Get collection by ID
 */
export async function getCollectionById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(mediaCollections).where(eq(mediaCollections.id, id));
  return results[0] || null;
}

/**
 * Delete a collection
 */
export async function deleteCollection(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(mediaCollections).where(eq(mediaCollections.id, id));
}

/**
 * Assign media to collection
 */
export async function assignMediaToCollection(collectionId: number, mediaId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(collectionImages).values({ collectionId, mediaId });
}

/**
 * Remove media from collection
 */
export async function removeMediaFromCollection(collectionId: number, mediaId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(collectionImages).where(
    and(
      eq(collectionImages.collectionId, collectionId),
      eq(collectionImages.mediaId, mediaId)
    )
  );
}

/**
 * Get media by collection ID
 */
export async function getMediaByCollectionId(collectionId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: media.id,
      fileName: media.fileName,
      fileKey: media.fileKey,
      url: media.url,
      mimeType: media.mimeType,
      fileSize: media.fileSize,
      width: media.width,
      height: media.height,
      uploadedBy: media.uploadedBy,
      altText: media.altText,
      caption: media.caption,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    })
    .from(collectionImages)
    .innerJoin(media, eq(collectionImages.mediaId, media.id))
    .where(eq(collectionImages.collectionId, collectionId))
    .orderBy(desc(media.createdAt));
  
  // Fetch tags for each media item
  const mediaWithTags = await Promise.all(
    result.map(async (m) => {
      const tags = await getTagsForMedia(m.id);
      return { ...m, tags };
    })
  );
  
  return mediaWithTags;
}

/**
 * Get collections for a media item
 */
export async function getCollectionsForMedia(mediaId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: mediaCollections.id,
      name: mediaCollections.name,
    })
    .from(collectionImages)
    .innerJoin(mediaCollections, eq(collectionImages.collectionId, mediaCollections.id))
    .where(eq(collectionImages.mediaId, mediaId));
  
  return result;
}

/**
 * Bulk update post status
 */
export async function bulkUpdatePostStatus(postIds: number[], status: "draft" | "published" | "archived") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  for (const postId of postIds) {
    const updates: any = { status };
    if (status === "published") {
      updates.publishedAt = new Date();
    }
    await db.update(blogPosts).set(updates).where(eq(blogPosts.id, postId));
  }
  
  return { success: true, updated: postIds.length };
}

/**
 * Bulk assign categories to posts
 */
export async function bulkAssignCategories(postIds: number[], categoryIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  for (const postId of postIds) {
    // Remove existing categories
    await db.delete(blogPostCategories).where(eq(blogPostCategories.blogPostId, postId));
    
    // Add new categories
    if (categoryIds.length > 0) {
      await db.insert(blogPostCategories).values(
        categoryIds.map(categoryId => ({ blogPostId: postId, categoryId }))
      );
    }
  }
  
  return { success: true, updated: postIds.length };
}

/**
 * Bulk assign tags to posts
 */
export async function bulkAssignTags(postIds: number[], tagIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  for (const postId of postIds) {
    // Remove existing tags
    await db.delete(blogPostTags).where(eq(blogPostTags.blogPostId, postId));
    
    // Add new tags
    if (tagIds.length > 0) {
      await db.insert(blogPostTags).values(
        tagIds.map(tagId => ({ blogPostId: postId, tagId }))
      );
    }
  }
  
  return { success: true, updated: postIds.length };
}

/**
 * Bulk delete posts
 */
export async function bulkDeletePosts(postIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  for (const postId of postIds) {
    await deleteBlogPost(postId);
  }
  
  return { success: true, deleted: postIds.length };
}

/**
 * Import History Queries
 */

/**
 * Create import history record
 */
export async function createImportHistory(data: {
  sourceUrl: string;
  importedBy: number;
  transformationRules?: any;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(importHistory).values(data) as any;
  return Number(result.insertId);
}

/**
 * Update import history record
 */
export async function updateImportHistory(id: number, updates: {
  status?: "in_progress" | "completed" | "failed";
  totalPosts?: number;
  importedPosts?: number;
  skippedPosts?: number;
  failedPosts?: number;
  errorMessage?: string;
  completedAt?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(importHistory).set(updates).where(eq(importHistory.id, id));
  return { success: true };
}

/**
 * Get all import history records
 */
export async function getAllImportHistory() {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select({
      id: importHistory.id,
      sourceUrl: importHistory.sourceUrl,
      importedBy: importHistory.importedBy,
      importerName: users.name,
      status: importHistory.status,
      totalPosts: importHistory.totalPosts,
      importedPosts: importHistory.importedPosts,
      skippedPosts: importHistory.skippedPosts,
      failedPosts: importHistory.failedPosts,
      errorMessage: importHistory.errorMessage,
      transformationRules: importHistory.transformationRules,
      startedAt: importHistory.startedAt,
      completedAt: importHistory.completedAt,
    })
    .from(importHistory)
    .leftJoin(users, eq(importHistory.importedBy, users.id))
    .orderBy(desc(importHistory.startedAt));
}

/**
 * Get import history by ID
 */
export async function getImportHistoryById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db
    .select({
      id: importHistory.id,
      sourceUrl: importHistory.sourceUrl,
      importedBy: importHistory.importedBy,
      importerName: users.name,
      status: importHistory.status,
      totalPosts: importHistory.totalPosts,
      importedPosts: importHistory.importedPosts,
      skippedPosts: importHistory.skippedPosts,
      failedPosts: importHistory.failedPosts,
      errorMessage: importHistory.errorMessage,
      transformationRules: importHistory.transformationRules,
      startedAt: importHistory.startedAt,
      completedAt: importHistory.completedAt,
    })
    .from(importHistory)
    .leftJoin(users, eq(importHistory.importedBy, users.id))
    .where(eq(importHistory.id, id));
  
  return results[0] || null;
}

/**
 * Create a new comment
 */
export async function createComment(data: {
  postId: number;
  authorName: string;
  authorEmail: string;
  content: string;
  ipAddress?: string;
  userAgent?: string;
  parentId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(blogComments).values(data) as any;
  const insertId = Number(result.insertId || result[0]?.insertId);
  return { id: insertId, ...data };
}

/**
 * Get comment by ID
 */
export async function getCommentById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(blogComments)
    .where(eq(blogComments.id, id))
    .limit(1);
  
  return result[0] || null;
}

/**
 * Get all comments for a blog post (approved only for public view)
 */
export async function getCommentsByPostId(postId: number, includeAll = false) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = includeAll 
    ? eq(blogComments.postId, postId)
    : and(eq(blogComments.postId, postId), eq(blogComments.status, "approved"));
  
  return db
    .select()
    .from(blogComments)
    .where(conditions)
    .orderBy(blogComments.createdAt);
}

/**
 * Get all pending comments for moderation
 */
export async function getPendingComments() {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select({
      id: blogComments.id,
      postId: blogComments.postId,
      postTitle: blogPosts.title,
      postSlug: blogPosts.slug,
      authorName: blogComments.authorName,
      authorEmail: blogComments.authorEmail,
      content: blogComments.content,
      status: blogComments.status,
      ipAddress: blogComments.ipAddress,
      createdAt: blogComments.createdAt,
    })
    .from(blogComments)
    .leftJoin(blogPosts, eq(blogComments.postId, blogPosts.id))
    .where(eq(blogComments.status, "pending"))
    .orderBy(desc(blogComments.createdAt));
}

/**
 * Get all comments (for admin view)
 */
export async function getAllComments() {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select({
      id: blogComments.id,
      postId: blogComments.postId,
      postTitle: blogPosts.title,
      postSlug: blogPosts.slug,
      authorName: blogComments.authorName,
      authorEmail: blogComments.authorEmail,
      content: blogComments.content,
      status: blogComments.status,
      ipAddress: blogComments.ipAddress,
      createdAt: blogComments.createdAt,
    })
    .from(blogComments)
    .leftJoin(blogPosts, eq(blogComments.postId, blogPosts.id))
    .orderBy(desc(blogComments.createdAt));
}

/**
 * Update comment status (approve, reject, mark as spam)
 */
export async function updateCommentStatus(id: number, status: "approved" | "rejected" | "spam") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(blogComments).set({ status }).where(eq(blogComments.id, id));
  return { success: true };
}

/**
 * Delete a comment
 */
export async function deleteComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(blogComments).where(eq(blogComments.id, id));
  return { success: true };
}

/**
 * Get comment count for a post
 */
export async function getCommentCount(postId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  const results = await db
    .select()
    .from(blogComments)
    .where(and(eq(blogComments.postId, postId), eq(blogComments.status, "approved")));
  
  return results.length;
}

/**
 * Create a new email subscriber
 */
export async function createSubscriber(data: {
  email: string;
  name?: string;
  subscribeSource?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(emailSubscribers).values(data);
  const insertId = Number((result as any).insertId || (result as any)[0]?.insertId || 0);
  return { id: insertId, ...data };
}

/**
 * Get subscriber by email
 */
export async function getSubscriberByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db
    .select()
    .from(emailSubscribers)
    .where(eq(emailSubscribers.email, email));
  
  return results[0] || null;
}

/**
 * Get all active subscribers
 */
export async function getActiveSubscribers() {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(emailSubscribers)
    .where(eq(emailSubscribers.status, "active"))
    .orderBy(desc(emailSubscribers.subscribedAt));
}

/**
 * Get all subscribers (for admin view)
 */
export async function getAllSubscribers() {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(emailSubscribers)
    .orderBy(desc(emailSubscribers.subscribedAt));
}

/**
 * Unsubscribe an email
 */
export async function unsubscribeEmail(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(emailSubscribers)
    .set({ 
      status: "unsubscribed",
      unsubscribedAt: new Date(),
    })
    .where(eq(emailSubscribers.email, email));
  
  return { success: true };
}

/**
 * Delete a subscriber
 */
export async function deleteSubscriber(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(emailSubscribers).where(eq(emailSubscribers.id, id));
  return { success: true };
}

/**
 * Update last email sent timestamp
 */
export async function updateSubscriberLastEmail(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(emailSubscribers)
    .set({ lastEmailSentAt: new Date() })
    .where(eq(emailSubscribers.id, id));
  
  return { success: true };
}

/**
 * Get subscriber notification preferences
 */
export async function getSubscriberPreferences(email: string) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db
    .select({
      email: emailSubscribers.email,
      name: emailSubscribers.name,
      digestFrequency: emailSubscribers.digestFrequency,
      contentTypes: emailSubscribers.contentTypes,
      lastDigestSentAt: emailSubscribers.lastDigestSentAt,
    })
    .from(emailSubscribers)
    .where(eq(emailSubscribers.email, email));
  
  return results[0] || null;
}

/**
 * Update subscriber notification preferences
 */
export async function updateSubscriberPreferences(email: string, preferences: {
  digestFrequency?: "daily" | "weekly" | "monthly" | "never";
  contentTypes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(emailSubscribers)
    .set(preferences)
    .where(eq(emailSubscribers.email, email));
  
  return { success: true };
}

/**
 * Update last digest sent timestamp
 */
export async function updateSubscriberLastDigest(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(emailSubscribers)
    .set({ lastDigestSentAt: new Date() })
    .where(eq(emailSubscribers.id, id));
  
  return { success: true };
}

/**
 * Get subscribers ready for digest (based on frequency and last sent time)
 */
export async function getSubscribersForDigest(frequency: "daily" | "weekly" | "monthly") {
  const db = await getDb();
  if (!db) return [];
  
  // Never frequency should return empty array
  if (frequency === "never" as any) {
    return [];
  }
  
  const now = new Date();
  let cutoffDate: Date;
  
  switch (frequency) {
    case "daily":
      cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
      break;
    case "weekly":
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
      break;
    case "monthly":
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      break;
    default:
      return [];
  }
  
  return db
    .select()
    .from(emailSubscribers)
    .where(
      and(
        eq(emailSubscribers.status, "active"),
        eq(emailSubscribers.digestFrequency, frequency),
        or(
          isNull(emailSubscribers.lastDigestSentAt),
          sql`${emailSubscribers.lastDigestSentAt} < ${cutoffDate}`
        )
      )
    );
}

/**
 * Create page view
 */
export async function createPageView(view: InsertPageView) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(pageViews).values(view);
}

/**
 * Get page views
 */
export async function getPageViews(pageId: number, pageType: "blog" | "cms") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(pageViews).where(
    and(
      eq(pageViews.pageId, pageId),
      eq(pageViews.pageType, pageType)
    )
  );
}

/**
 * Get all users
 */
export async function getAllUsers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(users);
}

/**
 * Get user by ID
 */
export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(users).where(eq(users.id, userId));
  return result[0] || null;
}

/**
 * Update user role
 */
export async function updateUserRole(userId: number, role: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ role: role as any }).where(eq(users.id, userId));
  return getUserById(userId);
}

/**
 * Get admin users (admin and editor roles)
 */
export async function getAdminUsers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select()
    .from(users)
    .where(
      or(
        eq(users.role, "admin"),
        eq(users.role, "editor")
      )
    );
}

/**
 * Create a notification
 */
export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(notifications).values(notification);
}

/**
 * Get notifications for a user
 */
export async function getNotifications(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, 0)
      )
    );
  return result[0]?.count || 0;
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications)
    .set({ isRead: 1 })
    .where(eq(notifications.id, notificationId));
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsRead(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications)
    .set({ isRead: 1 })
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, 0)
      )
    );
}

/**
 * Delete old notifications (older than 30 days)
 */
export async function deleteOldNotifications() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  await db.delete(notifications)
    .where(lt(notifications.createdAt, thirtyDaysAgo));
}

/**
 * Get user notification preferences
 */
export async function getUserNotificationPreferences(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const user = await getUserById(userId);
  if (!user) return null;
  
  return {
    notifyComments: user.notifyComments === 1,
    notifyApprovals: user.notifyApprovals === 1,
    notifyMentions: user.notifyMentions === 1,
    notifySystem: user.notifySystem === 1,
  };
}

/**
 * Update user notification preferences
 */
export async function updateNotificationPreferences(userId: number, preferences: {
  notifyComments?: boolean;
  notifyApprovals?: boolean;
  notifyMentions?: boolean;
  notifySystem?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updates: any = {};
  if (preferences.notifyComments !== undefined) updates.notifyComments = preferences.notifyComments ? 1 : 0;
  if (preferences.notifyApprovals !== undefined) updates.notifyApprovals = preferences.notifyApprovals ? 1 : 0;
  if (preferences.notifyMentions !== undefined) updates.notifyMentions = preferences.notifyMentions ? 1 : 0;
  if (preferences.notifySystem !== undefined) updates.notifySystem = preferences.notifySystem ? 1 : 0;
  
  await db.update(users).set(updates).where(eq(users.id, userId));
  return getUserNotificationPreferences(userId);
}

/**
 * Get published posts by author
 */
export async function getPostsByAuthor(authorId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.authorId, authorId),
        eq(blogPosts.status, "published")
      )
    )
    .orderBy(desc(blogPosts.publishedAt));
}

/**
 * Get author statistics
 */
export async function getAuthorStats(authorId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const posts = await db.select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.authorId, authorId),
        eq(blogPosts.status, "published")
      )
    );
  
  // Get total views for author's posts
  const postIds = posts.map(p => p.id);
  let totalViews = 0;
  
  if (postIds.length > 0) {
    const views = await db.select()
      .from(pageViews)
      .where(
        and(
          inArray(pageViews.pageId, postIds),
          eq(pageViews.pageType, "blog")
        )
      );
    totalViews = views.length;
  }
  
  return {
    totalPosts: posts.length,
    totalViews,
  };
}

/**
 * Update user profile (bio, avatar, social links)
 */
export async function updateUserProfile(userId: number, profile: {
  avatar?: string;
  bio?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updates: any = {};
  if (profile.avatar !== undefined) updates.avatar = profile.avatar;
  if (profile.bio !== undefined) updates.bio = profile.bio;
  if (profile.twitterUrl !== undefined) updates.twitterUrl = profile.twitterUrl;
  if (profile.linkedinUrl !== undefined) updates.linkedinUrl = profile.linkedinUrl;
  if (profile.githubUrl !== undefined) updates.githubUrl = profile.githubUrl;
  if (profile.websiteUrl !== undefined) updates.websiteUrl = profile.websiteUrl;
  
  await db.update(users).set(updates).where(eq(users.id, userId));
  return getUserById(userId);
}

// TODO: add feature queries here as your schema grows.

/**
 * ============================================================================
 * BLOG SERIES FUNCTIONS
 * ============================================================================
 */

/**
 * Create a new blog series
 */
export async function createBlogSeries(series: InsertBlogSeries) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(blogSeries).values(series);
  return Number((result as any).insertId || (result as any)[0]?.insertId || 0);
}

/**
 * Update a blog series
 */
export async function updateBlogSeries(id: number, updates: Partial<InsertBlogSeries>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(blogSeries).set(updates).where(eq(blogSeries.id, id));
}

/**
 * Delete a blog series
 */
export async function deleteBlogSeries(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(blogSeries).where(eq(blogSeries.id, id));
}

/**
 * Get all blog series
 */
export async function getAllBlogSeries() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(blogSeries).orderBy(desc(blogSeries.createdAt));
}

/**
 * Get published blog series
 */
export async function getPublishedBlogSeries() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(blogSeries)
    .where(eq(blogSeries.status, "published"))
    .orderBy(desc(blogSeries.createdAt));
}

/**
 * Get blog series by ID
 */
export async function getBlogSeriesById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [series] = await db.select().from(blogSeries).where(eq(blogSeries.id, id));
  return series || null;
}

/**
 * Get blog series by slug
 */
export async function getBlogSeriesBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [series] = await db.select().from(blogSeries).where(eq(blogSeries.slug, slug));
  return series || null;
}

/**
 * Add post to series
 */
export async function addPostToSeries(seriesId: number, postId: number, orderIndex: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(blogSeriesPosts).values({
    seriesId,
    postId,
    orderIndex,
  });
}

/**
 * Remove post from series
 */
export async function removePostFromSeries(seriesId: number, postId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(blogSeriesPosts).where(
    and(
      eq(blogSeriesPosts.seriesId, seriesId),
      eq(blogSeriesPosts.postId, postId)
    )
  );
}

/**
 * Update post order in series
 */
export async function updatePostOrderInSeries(seriesId: number, postId: number, newOrderIndex: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(blogSeriesPosts)
    .set({ orderIndex: newOrderIndex })
    .where(
      and(
        eq(blogSeriesPosts.seriesId, seriesId),
        eq(blogSeriesPosts.postId, postId)
      )
    );
}

/**
 * Get posts in a series (ordered)
 */
export async function getSeriesPosts(seriesId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    id: blogPosts.id,
    title: blogPosts.title,
    slug: blogPosts.slug,
    excerpt: blogPosts.excerpt,
    coverImage: blogPosts.coverImage,
    status: blogPosts.status,
    publishedAt: blogPosts.publishedAt,
    orderIndex: blogSeriesPosts.orderIndex,
  })
    .from(blogSeriesPosts)
    .innerJoin(blogPosts, eq(blogSeriesPosts.postId, blogPosts.id))
    .where(eq(blogSeriesPosts.seriesId, seriesId))
    .orderBy(blogSeriesPosts.orderIndex);
}

/**
 * Get series for a specific post
 */
export async function getPostSeries(postId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.select({
    id: blogSeries.id,
    title: blogSeries.title,
    slug: blogSeries.slug,
    description: blogSeries.description,
    coverImage: blogSeries.coverImage,
    status: blogSeries.status,
    orderIndex: blogSeriesPosts.orderIndex,
  })
    .from(blogSeriesPosts)
    .innerJoin(blogSeries, eq(blogSeriesPosts.seriesId, blogSeries.id))
    .where(eq(blogSeriesPosts.postId, postId));
  
  return result || null;
}

/**
 * Get previous and next posts in series
 */
export async function getSeriesNavigation(seriesId: number, currentOrderIndex: number) {
  const db = await getDb();
  if (!db) return { prev: null, next: null };
  
  // Get previous post
  const [prev] = await db.select({
    id: blogPosts.id,
    title: blogPosts.title,
    slug: blogPosts.slug,
    orderIndex: blogSeriesPosts.orderIndex,
  })
    .from(blogSeriesPosts)
    .innerJoin(blogPosts, eq(blogSeriesPosts.postId, blogPosts.id))
    .where(
      and(
        eq(blogSeriesPosts.seriesId, seriesId),
        sql`${blogSeriesPosts.orderIndex} < ${currentOrderIndex}`,
        eq(blogPosts.status, "published")
      )
    )
    .orderBy(desc(blogSeriesPosts.orderIndex))
    .limit(1);
  
  // Get next post
  const [next] = await db.select({
    id: blogPosts.id,
    title: blogPosts.title,
    slug: blogPosts.slug,
    orderIndex: blogSeriesPosts.orderIndex,
  })
    .from(blogSeriesPosts)
    .innerJoin(blogPosts, eq(blogSeriesPosts.postId, blogPosts.id))
    .where(
      and(
        eq(blogSeriesPosts.seriesId, seriesId),
        sql`${blogSeriesPosts.orderIndex} > ${currentOrderIndex}`,
        eq(blogPosts.status, "published")
      )
    )
    .orderBy(blogSeriesPosts.orderIndex)
    .limit(1);
  
  return {
    prev: prev || null,
    next: next || null,
  };
}

/**
 * Get series with post count
 */
export async function getSeriesWithPostCount() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    id: blogSeries.id,
    title: blogSeries.title,
    slug: blogSeries.slug,
    description: blogSeries.description,
    coverImage: blogSeries.coverImage,
    status: blogSeries.status,
    createdAt: blogSeries.createdAt,
    postCount: sql<number>`COUNT(${blogSeriesPosts.postId})`.as("postCount"),
  })
    .from(blogSeries)
    .leftJoin(blogSeriesPosts, eq(blogSeries.id, blogSeriesPosts.seriesId))
    .groupBy(blogSeries.id)
    .orderBy(desc(blogSeries.createdAt));
}
