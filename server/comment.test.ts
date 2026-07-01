import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";

describe("Comment System", () => {
  let testPostId: number;
  let testCommentId: number;
  let adminContext: any;
  let publicContext: any;

  beforeAll(async () => {
    // Create a test blog post
    const testPost = await db.createBlogPost({
      title: "Test Post for Comments",
      slug: "test-post-comments-" + Date.now(),
      content: "Test content",
      excerpt: "Test excerpt",
      authorId: 1,
      status: "published",
    });
    testPostId = testPost.id;

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

  describe("Comment Creation", () => {
    it("should create a comment with valid data", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      const comment = await caller.comment.create({
        postId: testPostId,
        authorName: "John Doe",
        authorEmail: "john@example.com",
        content: "This is a great article! Very informative.",
      });

      expect(comment).toBeDefined();
      expect(comment.authorName).toBe("John Doe");
      expect(comment.authorEmail).toBe("john@example.com");
      expect(comment.content).toBe("This is a great article! Very informative.");
      
      testCommentId = comment.id;
    });

    it("should reject comment with empty name", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      await expect(
        caller.comment.create({
          postId: testPostId,
          authorName: "",
          authorEmail: "test@example.com",
          content: "Test content",
        })
      ).rejects.toThrow();
    });

    it("should reject comment with invalid email", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      await expect(
        caller.comment.create({
          postId: testPostId,
          authorName: "Test User",
          authorEmail: "invalid-email",
          content: "Test content",
        })
      ).rejects.toThrow();
    });

    it("should reject comment with empty content", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      await expect(
        caller.comment.create({
          postId: testPostId,
          authorName: "Test User",
          authorEmail: "test@example.com",
          content: "",
        })
      ).rejects.toThrow();
    });
  });

  describe("Comment Retrieval", () => {
    it("should list comments for a post", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      const comments = await caller.comment.listByPost({ postId: testPostId });
      
      expect(Array.isArray(comments)).toBe(true);
    });

    it("should get comment count for a post", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      const count = await caller.comment.getCount({ postId: testPostId });
      
      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Comment Moderation (Admin)", () => {
    it("should list all comments for admin", async () => {
      const caller = appRouter.createCaller(adminContext);
      
      const comments = await caller.comment.listAll();
      
      expect(Array.isArray(comments)).toBe(true);
    });

    it("should list pending comments for admin", async () => {
      const caller = appRouter.createCaller(adminContext);
      
      const comments = await caller.comment.listPending();
      
      expect(Array.isArray(comments)).toBe(true);
    });

    it("should approve a comment", async () => {
      const caller = appRouter.createCaller(adminContext);
      
      const result = await caller.comment.updateStatus({
        id: testCommentId,
        status: "approved",
      });
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it("should reject a comment", async () => {
      const caller = appRouter.createCaller(adminContext);
      
      const result = await caller.comment.updateStatus({
        id: testCommentId,
        status: "rejected",
      });
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it("should mark a comment as spam", async () => {
      const caller = appRouter.createCaller(adminContext);
      
      const result = await caller.comment.updateStatus({
        id: testCommentId,
        status: "spam",
      });
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it("should delete a comment", async () => {
      // Create a new comment for deletion test
      const publicCaller = appRouter.createCaller(publicContext);
      const newComment = await publicCaller.comment.create({
        postId: testPostId,
        authorName: "Delete Test",
        authorEmail: "delete@test.com",
        content: "This comment will be deleted",
      });

      const caller = appRouter.createCaller(adminContext);
      const result = await caller.comment.delete({ id: newComment.id });
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });

  describe("Comment Moderation (Non-Admin)", () => {
    it("should not allow non-admin to list all comments", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      await expect(caller.comment.listAll()).rejects.toThrow();
    });

    it("should not allow non-admin to update comment status", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      await expect(
        caller.comment.updateStatus({
          id: 1,
          status: "approved",
        })
      ).rejects.toThrow();
    });

    it("should not allow non-admin to delete comments", async () => {
      const caller = appRouter.createCaller(publicContext);
      
      await expect(
        caller.comment.delete({ id: 1 })
      ).rejects.toThrow();
    });
  });
});
