import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";

describe("New Features", () => {
  let testPostId: number;
  let testCommentId: number;
  let adminContext: any;
  let publicContext: any;

  beforeAll(async () => {
    // Create test blog posts with tags
    const testPost1 = await db.createBlogPost({
      title: "Test Post 1 - AI and Automation",
      slug: "test-post-1-" + Date.now(),
      content: "Content about AI and automation",
      excerpt: "AI excerpt",
      authorId: 1,
      status: "published",
      tags: "AI, Automation, Technology",
    });
    testPostId = testPost1.id;

    await db.createBlogPost({
      title: "Test Post 2 - AI and Machine Learning",
      slug: "test-post-2-" + Date.now(),
      content: "Content about AI and ML",
      excerpt: "ML excerpt",
      authorId: 1,
      status: "published",
      tags: "AI, Machine Learning, Technology",
    });

    await db.createBlogPost({
      title: "Test Post 3 - Cloud Computing",
      slug: "test-post-3-" + Date.now(),
      content: "Content about cloud",
      excerpt: "Cloud excerpt",
      authorId: 1,
      status: "published",
      tags: "Cloud, Infrastructure",
    });

    // Mock contexts
    adminContext = {
      user: { id: 1, role: "admin", openId: "test-admin", name: "Admin", email: "admin@test.com" },
      req: { ip: "127.0.0.1", headers: { "user-agent": "test" } },
      res: {},
    };

    publicContext = {
      user: null,
      req: { ip: "127.0.0.1", headers: { "user-agent": "test" } },
      res: {},
    };
  });

  describe("Related Posts Feature", () => {
    it("should return related posts based on tag matching", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      const relatedPosts = await caller.blog.getRelated({
        postId: testPostId,
        limit: 3,
      });

      expect(Array.isArray(relatedPosts)).toBe(true);
      // Should find at least one related post with matching tags
      expect(relatedPosts.length).toBeGreaterThan(0);
    });

    it("should not include the current post in related posts", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      const relatedPosts = await caller.blog.getRelated({
        postId: testPostId,
        limit: 3,
      });

      const currentPostInResults = relatedPosts.find((p: any) => p.id === testPostId);
      expect(currentPostInResults).toBeUndefined();
    });

    it("should respect the limit parameter", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      const relatedPosts = await caller.blog.getRelated({
        postId: testPostId,
        limit: 1,
      });

      expect(relatedPosts.length).toBeLessThanOrEqual(1);
    });

    it("should return empty array for non-existent post", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      const relatedPosts = await caller.blog.getRelated({
        postId: 999999,
        limit: 3,
      });

      expect(relatedPosts).toEqual([]);
    });
  });

  describe("Threaded Comment Replies", () => {
    it("should create a top-level comment", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      const comment = await caller.comment.create({
        postId: testPostId,
        authorName: "Test User",
        authorEmail: "test@example.com",
        content: "This is a top-level comment",
      });

      expect(comment).toBeDefined();
      expect(comment.parentId).toBeNull();
      testCommentId = comment.id;
    });

    it("should create a reply to a comment", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      const reply = await caller.comment.create({
        postId: testPostId,
        authorName: "Reply User",
        authorEmail: "reply@example.com",
        content: "This is a reply",
        parentId: testCommentId,
      });

      expect(reply).toBeDefined();
      expect(reply.parentId).toBe(testCommentId);
    });

    it("should list comments with proper parent-child relationships", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      const comments = await caller.comment.listByPost({ postId: testPostId });
      
      expect(Array.isArray(comments)).toBe(true);
      
      // Should have both parent and child comments
      const parentComments = comments.filter((c: any) => c.parentId === null);
      const childComments = comments.filter((c: any) => c.parentId !== null);
      
      expect(parentComments.length).toBeGreaterThan(0);
      expect(childComments.length).toBeGreaterThan(0);
    });

    it("should create nested replies (3 levels deep)", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      // Create first level comment
      const level1 = await caller.comment.create({
        postId: testPostId,
        authorName: "Level 1",
        authorEmail: "level1@example.com",
        content: "Level 1 comment",
      });

      // Create second level reply
      const level2 = await caller.comment.create({
        postId: testPostId,
        authorName: "Level 2",
        authorEmail: "level2@example.com",
        content: "Level 2 reply",
        parentId: level1.id,
      });

      // Create third level reply
      const level3 = await caller.comment.create({
        postId: testPostId,
        authorName: "Level 3",
        authorEmail: "level3@example.com",
        content: "Level 3 reply",
        parentId: level2.id,
      });

      expect(level1.parentId).toBeNull();
      expect(level2.parentId).toBe(level1.id);
      expect(level3.parentId).toBe(level2.id);
    });
  });

  describe("Analytics Dashboard Data", () => {
    it("should list all posts for analytics", async () => {
      const caller = appRouter.createCaller(adminContext);
      
      const posts = await caller.blog.listAll();
      
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBeGreaterThan(0);
    });

    it("should list all comments for analytics", async () => {
      const caller = appRouter.createCaller(adminContext);
      
      const comments = await caller.comment.listAll();
      
      expect(Array.isArray(comments)).toBe(true);
      expect(comments.length).toBeGreaterThan(0);
    });

    it("should calculate comment count correctly", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      const count = await caller.comment.getCount({ postId: testPostId });
      
      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThan(0);
    });
  });
});
