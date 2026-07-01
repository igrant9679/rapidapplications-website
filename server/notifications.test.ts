import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("Notification System", () => {
  let testUserId: number;
  let testNotificationId: number;

  beforeAll(async () => {
    // Get or create a test user
    const users = await db.getAllUsers();
    if (users.length > 0) {
      testUserId = users[0].id;
    } else {
      throw new Error("No users found in database for testing");
    }
  });

  it("should create a notification", async () => {
    await db.createNotification({
      userId: testUserId,
      type: "comment",
      title: "Test Notification",
      message: "This is a test notification",
      link: "/test",
      isRead: 0,
    });

    const notifications = await db.getNotifications(testUserId, 1);
    expect(notifications.length).toBeGreaterThan(0);
    expect(notifications[0].title).toBe("Test Notification");
    testNotificationId = notifications[0].id;
  });

  it("should get unread count", async () => {
    const count = await db.getUnreadCount(testUserId);
    expect(count).toBeGreaterThan(0);
  });

  it("should mark notification as read", async () => {
    await db.markNotificationRead(testNotificationId);
    const notifications = await db.getNotifications(testUserId, 1);
    const readNotification = notifications.find(n => n.id === testNotificationId);
    expect(readNotification?.isRead).toBe(1);
  });

  it("should mark all notifications as read", async () => {
    // Create another unread notification
    await db.createNotification({
      userId: testUserId,
      type: "system",
      title: "Another Test",
      message: "Another test notification",
      link: "/test2",
      isRead: 0,
    });

    await db.markAllNotificationsRead(testUserId);
    const count = await db.getUnreadCount(testUserId);
    expect(count).toBe(0);
  });

  it("should get admin users", async () => {
    const adminUsers = await db.getAdminUsers();
    expect(Array.isArray(adminUsers)).toBe(true);
    // Each admin should have role of admin or editor
    adminUsers.forEach(user => {
      expect(['admin', 'editor']).toContain(user.role);
    });
  });

  it("should retrieve notifications with proper structure", async () => {
    const notifications = await db.getNotifications(testUserId, 10);
    expect(Array.isArray(notifications)).toBe(true);
    
    if (notifications.length > 0) {
      const notification = notifications[0];
      expect(notification).toHaveProperty('id');
      expect(notification).toHaveProperty('userId');
      expect(notification).toHaveProperty('type');
      expect(notification).toHaveProperty('title');
      expect(notification).toHaveProperty('message');
      expect(notification).toHaveProperty('isRead');
      expect(notification).toHaveProperty('createdAt');
    }
  });
});
