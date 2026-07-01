import { describe, it, expect, beforeAll } from 'vitest';
import { getDb } from './db';
import * as db from './db';

describe('Blog Procedures', () => {
  let testAuthorId: number;
  let testCategoryId: number;
  let testTagId: number;
  let testPostId: number;

  beforeAll(async () => {
    const database = await getDb();
    if (!database) throw new Error('Database not available');

    // Create test author
    const authorResult = await database.insert(await import('../drizzle/schema').then(m => m.users)).values({
      openId: `test-author-${Date.now()}`,
      name: 'Test Author',
      email: `test-${Date.now()}@example.com`,
      role: 'author',
    });
    testAuthorId = Number(authorResult[0].insertId);

    // Create test category
    const timestamp = Date.now();
    const categoryResult = await db.createBlogCategory({
      name: `Test Category ${timestamp}`,
      slug: `test-category-${timestamp}`,
      description: 'Test category description',
    });
    testCategoryId = categoryResult.id;

    // Create test tag
    const tagResult = await db.createBlogTag({
      name: `Test Tag ${timestamp}`,
      slug: `test-tag-${timestamp}`,
    });
    testTagId = tagResult.id;
  });

  describe('Blog Post CRUD', () => {
    it('should create a blog post', async () => {
      const postData = {
        title: 'Test Blog Post',
        slug: `test-post-${Date.now()}`,
        content: 'This is test content for the blog post.',
        excerpt: 'Test excerpt',
        authorId: testAuthorId,
        status: 'draft' as const,
      };

      testPostId = await db.createBlogPost(postData);
      expect(testPostId).toBeTypeOf('number');
      expect(testPostId).toBeGreaterThan(0);
    });

    it('should get blog post by ID', async () => {
      const post = await db.getBlogPostById(testPostId);
      expect(post).toBeDefined();
      expect(post?.title).toBe('Test Blog Post');
      expect(post?.authorId).toBe(testAuthorId);
    });

    it('should get blog post by slug', async () => {
      const post = await db.getBlogPostById(testPostId);
      if (!post) throw new Error('Post not found');

      const postBySlug = await db.getBlogPostBySlug(post.slug, true); // includeUnpublished=true for admin
      expect(postBySlug).toBeDefined();
      expect(postBySlug?.id).toBe(testPostId);
    });

    it('should update blog post', async () => {
      const updates = {
        title: 'Updated Test Blog Post',
        status: 'published' as const,
        publishedAt: new Date(),
      };

      await db.updateBlogPost(testPostId, updates);
      const updated = await db.getBlogPostById(testPostId);
      expect(updated?.title).toBe('Updated Test Blog Post');
      expect(updated?.status).toBe('published');
    });

    it('should list all blog posts', async () => {
      const posts = await db.getAllBlogPosts();
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBeGreaterThan(0);
    });

    it('should list published blog posts', async () => {
      const posts = await db.getPublishedBlogPosts();
      expect(Array.isArray(posts)).toBe(true);
      // All returned posts should be published
      posts.forEach(post => {
        expect(post.status).toBe('published');
      });
    });
  });

  describe('Categories and Tags', () => {
    it('should assign categories to post', async () => {
      await db.assignCategoriesToPost(testPostId, [testCategoryId]);
      const categories = await db.getCategoriesForPost(testPostId);
      expect(categories.length).toBeGreaterThan(0);
      expect(categories.some(c => c.id === testCategoryId)).toBe(true);
    });

    it('should assign tags to post', async () => {
      await db.assignTagsToPost(testPostId, [testTagId]);
      const tags = await db.getTagsForPost(testPostId);
      expect(tags.length).toBeGreaterThan(0);
      expect(tags.some(t => t.id === testTagId)).toBe(true);
    });

    it('should get categories for post', async () => {
      const categories = await db.getCategoriesForPost(testPostId);
      expect(Array.isArray(categories)).toBe(true);
    });

    it('should get tags for post', async () => {
      const tags = await db.getTagsForPost(testPostId);
      expect(Array.isArray(tags)).toBe(true);
    });

    it('should list all categories', async () => {
      const categories = await db.getAllBlogCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it('should list all tags', async () => {
      const tags = await db.getAllBlogTags();
      expect(Array.isArray(tags)).toBe(true);
      expect(tags.length).toBeGreaterThan(0);
    });

    it('should update category', async () => {
      const updates = {
        name: 'Updated Test Category',
        description: 'Updated description',
      };
      await db.updateBlogCategory(testCategoryId, updates);
      const categories = await db.getAllBlogCategories();
      const updated = categories.find(c => c.id === testCategoryId);
      expect(updated?.name).toBe('Updated Test Category');
    });
  });

  describe('Blog Search', () => {
    it('should search blog posts by query', async () => {
      const results = await db.searchBlogPosts({
        query: 'Updated Test',
        page: 1,
        limit: 10,
      });
      expect(results).toBeDefined();
      expect(results.posts).toBeDefined();
      expect(Array.isArray(results.posts)).toBe(true);
    });

    it('should filter by category', async () => {
      const results = await db.searchBlogPosts({
        categoryId: testCategoryId,
        page: 1,
        limit: 10,
      });
      expect(results).toBeDefined();
      expect(results.posts).toBeDefined();
    });

    it('should filter by tag', async () => {
      const results = await db.searchBlogPosts({
        tagId: testTagId,
        page: 1,
        limit: 10,
      });
      expect(results).toBeDefined();
      expect(results.posts).toBeDefined();
    });
  });

  describe('Bulk Operations', () => {
    let bulkPostIds: number[] = [];

    it('should create multiple posts for bulk testing', async () => {
      for (let i = 0; i < 3; i++) {
        const postId = await db.createBlogPost({
          title: `Bulk Test Post ${i}`,
          slug: `bulk-test-${Date.now()}-${i}`,
          content: `Content ${i}`,
          authorId: testAuthorId,
          status: 'draft',
        });
        bulkPostIds.push(postId);
      }
      expect(bulkPostIds.length).toBe(3);
    });

    it('should bulk update post status', async () => {
      await db.bulkUpdatePostStatus(bulkPostIds, 'published');
      for (const postId of bulkPostIds) {
        const post = await db.getBlogPostById(postId);
        expect(post?.status).toBe('published');
      }
    });

    it('should bulk assign categories', async () => {
      await db.bulkAssignCategories(bulkPostIds, [testCategoryId]);
      for (const postId of bulkPostIds) {
        const categories = await db.getCategoriesForPost(postId);
        expect(categories.some(c => c.id === testCategoryId)).toBe(true);
      }
    });

    it('should bulk assign tags', async () => {
      await db.bulkAssignTags(bulkPostIds, [testTagId]);
      for (const postId of bulkPostIds) {
        const tags = await db.getTagsForPost(postId);
        expect(tags.some(t => t.id === testTagId)).toBe(true);
      }
    });

    it('should bulk delete posts', async () => {
      await db.bulkDeletePosts(bulkPostIds);
      for (const postId of bulkPostIds) {
        const post = await db.getBlogPostById(postId);
        expect(post).toBeUndefined();
      }
    });
  });

  describe('Cleanup', () => {
    it('should delete test post', async () => {
      await db.deleteBlogPost(testPostId);
      const deleted = await db.getBlogPostById(testPostId);
      expect(deleted).toBeUndefined();
    });

    it('should delete test category', async () => {
      await db.deleteBlogCategory(testCategoryId);
      const categories = await db.getAllBlogCategories();
      expect(categories.find(c => c.id === testCategoryId)).toBeUndefined();
    });

    it('should delete test tag', async () => {
      await db.deleteBlogTag(testTagId);
      const tags = await db.getAllBlogTags();
      expect(tags.find(t => t.id === testTagId)).toBeUndefined();
    });
  });
});
