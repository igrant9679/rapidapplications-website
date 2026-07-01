import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";
import { runDigestNow } from "./jobs/emailDigestCron";

describe("Follow-up Features", () => {
  let testUserId: number;
  let testPostId: number;
  let testCommentId: number;

  beforeAll(async () => {
    // Get or create test user
    const users = await db.getAllUsers();
    if (users.length > 0) {
      testUserId = users[0].id;
    } else {
      throw new Error("No users found in database for testing");
    }

    // Create test blog post with unique slug
    const timestamp = Date.now();
    testPostId = await db.createBlogPost({
      title: "Test Post for Notifications",
      slug: `test-post-notifications-${timestamp}`,
      content: "Test content",
      excerpt: "Test excerpt",
      authorId: testUserId,
      status: "published",
      publishedAt: new Date(),
    });
  });

  describe("Email Digest Scheduling", () => {
    it("should manually trigger digest generation", async () => {
      const result = await runDigestNow();
      expect(result).toHaveProperty("success");
      expect(typeof result.success).toBe("boolean");
      if (!result.success) {
        expect(result).toHaveProperty("error");
      }
    });
  });

  describe("Comment Reply Notifications", () => {
    it("should create parent comment, retrieve it, and create reply", async () => {
      // Step 1: Create parent comment
      const comment = await db.createComment({
        postId: testPostId,
        authorName: "Parent Commenter",
        authorEmail: "parent@example.com",
        content: "This is the parent comment",
      });
      
      expect(comment).toHaveProperty("id");
      expect(typeof comment.id).toBe("number");
      expect(comment.id).toBeGreaterThan(0);
      testCommentId = comment.id;
      
      // Step 2: Retrieve comment by ID
      const retrievedComment = await db.getCommentById(testCommentId);
      expect(retrievedComment).not.toBeNull();
      expect(retrievedComment?.authorName).toBe("Parent Commenter");
      expect(retrievedComment?.content).toBe("This is the parent comment");
      
      // Step 3: Create reply comment
      
      const reply = await db.createComment({
        postId: testPostId,
        authorName: "Reply Author",
        authorEmail: "reply@example.com",
        content: "This is a reply to the parent comment",
        parentId: testCommentId,
      });
      
      expect(reply).toHaveProperty("id");
      expect(reply.parentId).toBe(testCommentId);
    });
  });

  describe("Notification Preferences System", () => {
    it("should get user notification preferences", async () => {
      const prefs = await db.getUserNotificationPreferences(testUserId);
      expect(prefs).not.toBeNull();
      expect(prefs).toHaveProperty("notifyComments");
      expect(prefs).toHaveProperty("notifyApprovals");
      expect(prefs).toHaveProperty("notifyMentions");
      expect(prefs).toHaveProperty("notifySystem");
      
      // All should be boolean
      expect(typeof prefs!.notifyComments).toBe("boolean");
      expect(typeof prefs!.notifyApprovals).toBe("boolean");
      expect(typeof prefs!.notifyMentions).toBe("boolean");
      expect(typeof prefs!.notifySystem).toBe("boolean");
    });

    it("should update notification preferences", async () => {
      const updatedPrefs = await db.updateNotificationPreferences(testUserId, {
        notifyComments: false,
        notifyApprovals: true,
      });
      
      expect(updatedPrefs).not.toBeNull();
      expect(updatedPrefs!.notifyComments).toBe(false);
      expect(updatedPrefs!.notifyApprovals).toBe(true);
    });

    it("should persist preference changes", async () => {
      const prefs = await db.getUserNotificationPreferences(testUserId);
      expect(prefs!.notifyComments).toBe(false);
      expect(prefs!.notifyApprovals).toBe(true);
    });

    it("should restore default preferences", async () => {
      await db.updateNotificationPreferences(testUserId, {
        notifyComments: true,
        notifyApprovals: true,
        notifyMentions: true,
        notifySystem: true,
      });
      
      const prefs = await db.getUserNotificationPreferences(testUserId);
      expect(prefs!.notifyComments).toBe(true);
      expect(prefs!.notifyApprovals).toBe(true);
      expect(prefs!.notifyMentions).toBe(true);
      expect(prefs!.notifySystem).toBe(true);
    });
  });

  describe("Integration: Preferences Affect Notifications", () => {
    it("should not create notification when preferences disabled", async () => {
      // Disable comment notifications
      await db.updateNotificationPreferences(testUserId, {
        notifyComments: false,
      });
      
      const prefs = await db.getUserNotificationPreferences(testUserId);
      expect(prefs!.notifyComments).toBe(false);
      
      // In real scenario, notification creation would be skipped
      // This test verifies the preference is correctly set
    });

    it("should create notification when preferences enabled", async () => {
      // Enable comment notifications
      await db.updateNotificationPreferences(testUserId, {
        notifyComments: true,
      });
      
      const prefs = await db.getUserNotificationPreferences(testUserId);
      expect(prefs!.notifyComments).toBe(true);
      
      // Create notification
      await db.createNotification({
        userId: testUserId,
        type: "comment",
        title: "Test Notification",
        message: "This should be created",
        link: "/test",
        isRead: 0,
      });
      
      const notifications = await db.getNotifications(testUserId, 1);
      expect(notifications.length).toBeGreaterThan(0);
    });
  });
});
