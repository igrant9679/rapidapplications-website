import { describe, it, expect, beforeEach } from "vitest";
import * as db from "./db";

describe("Notification Preferences", () => {
  let testEmail: string;
  let subscriberId: number;

  beforeEach(async () => {
    // Generate unique email for each test
    testEmail = `test-prefs-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
    
    // Create a test subscriber
    const result = await db.createSubscriber({
      email: testEmail,
      name: "Test User",
      subscribeSource: "test",
    });
    subscriberId = result.id;
  });

  it("should create subscriber with default preferences", async () => {
    const subscriber = await db.getSubscriberByEmail(testEmail);
    
    expect(subscriber).toBeDefined();
    expect(subscriber?.digestFrequency).toBe("weekly");
    expect(subscriber?.contentTypes).toBe("blog,news,updates");
    expect(subscriber?.lastDigestSentAt).toBeNull();
  });

  it("should get subscriber preferences", async () => {
    const preferences = await db.getSubscriberPreferences(testEmail);
    
    expect(preferences).toBeDefined();
    expect(preferences?.email).toBe(testEmail);
    expect(preferences?.digestFrequency).toBe("weekly");
    expect(preferences?.contentTypes).toBe("blog,news,updates");
  });

  it("should update digest frequency", async () => {
    await db.updateSubscriberPreferences(testEmail, {
      digestFrequency: "daily",
    });
    
    const preferences = await db.getSubscriberPreferences(testEmail);
    expect(preferences?.digestFrequency).toBe("daily");
  });

  it("should update content types", async () => {
    await db.updateSubscriberPreferences(testEmail, {
      contentTypes: "blog,events",
    });
    
    const preferences = await db.getSubscriberPreferences(testEmail);
    expect(preferences?.contentTypes).toBe("blog,events");
  });

  it("should update multiple preferences at once", async () => {
    await db.updateSubscriberPreferences(testEmail, {
      digestFrequency: "monthly",
      contentTypes: "news",
    });
    
    const preferences = await db.getSubscriberPreferences(testEmail);
    expect(preferences?.digestFrequency).toBe("monthly");
    expect(preferences?.contentTypes).toBe("news");
  });

  it("should update last digest sent timestamp", async () => {
    await db.updateSubscriberLastDigest(subscriberId);
    
    const subscriber = await db.getSubscriberByEmail(testEmail);
    expect(subscriber?.lastDigestSentAt).not.toBeNull();
  });

  it("should get subscribers ready for daily digest", async () => {
    // Update to daily frequency
    await db.updateSubscriberPreferences(testEmail, {
      digestFrequency: "daily",
    });
    
    const subscribers = await db.getSubscribersForDigest("daily");
    
    // Should include our test subscriber
    const found = subscribers.find((s) => s.email === testEmail);
    expect(found).toBeDefined();
  });

  it("should get subscribers ready for weekly digest", async () => {
    // Default is weekly
    const subscribers = await db.getSubscribersForDigest("weekly");
    
    // Should include our test subscriber
    const found = subscribers.find((s) => s.email === testEmail);
    expect(found).toBeDefined();
  });

  it("should not include subscribers who recently received digest", async () => {
    // Update to daily and mark as sent
    await db.updateSubscriberPreferences(testEmail, {
      digestFrequency: "daily",
    });
    await db.updateSubscriberLastDigest(subscriberId);
    
    const subscribers = await db.getSubscribersForDigest("daily");
    
    // Should NOT include our test subscriber (just sent)
    const found = subscribers.find((s) => s.email === testEmail);
    expect(found).toBeUndefined();
  });

  it("should not include subscribers with 'never' frequency", async () => {
    await db.updateSubscriberPreferences(testEmail, {
      digestFrequency: "never",
    });
    
    const subscribers = await db.getSubscribersForDigest("never" as any);
    
    // Should be empty or not include our subscriber
    const found = subscribers.find((s) => s.email === testEmail);
    expect(found).toBeUndefined();
  });

  it("should handle non-existent email gracefully", async () => {
    const preferences = await db.getSubscriberPreferences("nonexistent@example.com");
    expect(preferences).toBeNull();
  });
});
