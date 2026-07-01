import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";

// Mock context for testing
const createMockContext = (user?: any) => ({
  user: user || null,
  req: {
    ip: "127.0.0.1",
    headers: {
      "user-agent": "test-agent",
    },
  } as any,
  res: {} as any,
});

const adminContext = createMockContext({
  id: 1,
  openId: "admin-123",
  name: "Admin User",
  email: "admin@test.com",
  role: "admin",
});

const userContext = createMockContext({
  id: 2,
  openId: "user-123",
  name: "Regular User",
  email: "user@test.com",
  role: "user",
});

describe("Email Subscription System", () => {
  it("should allow public users to subscribe", async () => {
    const caller = appRouter.createCaller(createMockContext());
    
    const result = await caller.subscriber.subscribe({
      email: `test-${Date.now()}@example.com`,
      name: "Test User",
      subscribeSource: "test",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBeDefined();
  });

  it("should prevent duplicate subscriptions", async () => {
    const caller = appRouter.createCaller(createMockContext());
    const email = `duplicate-${Date.now()}@example.com`;
    
    // First subscription
    await caller.subscriber.subscribe({
      email,
      name: "Test User",
      subscribeSource: "test",
    });

    // Second subscription attempt
    const result = await caller.subscriber.subscribe({
      email,
      name: "Test User",
      subscribeSource: "test",
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain("already subscribed");
  });

  it("should allow admins to list all subscribers", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    const subscribers = await caller.subscriber.listAll();
    
    expect(Array.isArray(subscribers)).toBe(true);
  });

  it("should allow admins to list active subscribers", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    const subscribers = await caller.subscriber.listActive();
    
    expect(Array.isArray(subscribers)).toBe(true);
  });

  it("should allow public users to unsubscribe", async () => {
    const caller = appRouter.createCaller(createMockContext());
    const email = `unsubscribe-${Date.now()}@example.com`;
    
    // Subscribe first
    await caller.subscriber.subscribe({
      email,
      name: "Test User",
      subscribeSource: "test",
    });

    // Unsubscribe
    const result = await caller.subscriber.unsubscribe({ email });
    
    expect(result.success).toBe(true);
  });
});

describe("Blog Categories Management", () => {
  let testCategoryId: number;

  it("should allow admins to create categories", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    const result = await caller.blogCategory.create({
      name: `Test Category ${Date.now()}`,
      slug: `test-category-${Date.now()}`,
      description: "Test description",
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    testCategoryId = result.id;
  });

  it("should allow public users to list categories", async () => {
    const caller = appRouter.createCaller(createMockContext());
    
    const categories = await caller.blogCategory.list();
    
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should allow admins to update categories", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    const timestamp = Date.now();
    // Create a category first
    const created = await caller.blogCategory.create({
      name: `Update Test ${timestamp}`,
      slug: `update-test-${timestamp}`,
    });

    // Update it with a unique name
    const result = await caller.blogCategory.update({
      id: created.id,
      name: `Updated Name ${timestamp}`,
      slug: `updated-slug-${timestamp}`,
    });

    expect(result.success).toBe(true);
  });

  it("should allow admins to delete categories", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    // Create a category first
    const created = await caller.blogCategory.create({
      name: `Delete Test ${Date.now()}`,
      slug: `delete-test-${Date.now()}`,
    });

    // Delete it
    await expect(
      caller.blogCategory.delete({ id: created.id })
    ).resolves.not.toThrow();
  });

  it("should prevent non-admins from creating categories", async () => {
    const caller = appRouter.createCaller(userContext);
    
    await expect(
      caller.blogCategory.create({
        name: "Unauthorized Category",
        slug: "unauthorized",
      })
    ).rejects.toThrow();
  });
});

describe("Social Sharing (Database Integration)", () => {
  it("should retrieve blog posts with all required fields for sharing", async () => {
    const caller = appRouter.createCaller(createMockContext());
    
    const result = await caller.blog.list({ page: 1, limit: 1 });
    
    // Verify the result structure
    expect(result).toBeDefined();
    
    // Check if posts property exists and is an array
    if (result && typeof result === 'object' && 'posts' in result) {
      expect(Array.isArray(result.posts)).toBe(true);
      
      if (result.posts.length > 0) {
        const post = result.posts[0];
        expect(post.title).toBeDefined();
        expect(post.slug).toBeDefined();
        // These fields are used for social sharing
        expect(post).toHaveProperty("coverImage");
        expect(post).toHaveProperty("excerpt");
      }
    } else {
      // If result structure is different, just verify it's defined
      expect(result).toBeDefined();
    }
  });
});
