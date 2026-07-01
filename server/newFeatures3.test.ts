import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

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

const publicContext = createMockContext();

describe("Blog Search Functionality", () => {
  it("should search blog posts by query", async () => {
    const caller = appRouter.createCaller(publicContext);
    
    const result = await caller.blog.search({
      query: "test",
      page: 1,
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("posts");
    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("page");
    expect(result).toHaveProperty("limit");
    expect(Array.isArray(result.posts)).toBe(true);
  });

  it("should search blog posts by category", async () => {
    const caller = appRouter.createCaller(publicContext);
    
    // Get first category
    const categories = await caller.blogCategory.list();
    
    if (categories.length > 0) {
      const result = await caller.blog.search({
        categoryId: categories[0].id,
        page: 1,
        limit: 10,
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result.posts)).toBe(true);
    }
  });

  it("should return empty results for non-existent search", async () => {
    const caller = appRouter.createCaller(publicContext);
    
    const result = await caller.blog.search({
      query: "nonexistentquerythatshouldfindnothing12345",
      page: 1,
      limit: 10,
    });

    expect(result.total).toBe(0);
    expect(result.posts.length).toBe(0);
  });
});

describe("Admin Tags Management", () => {
  it("should allow admins to create tags", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    const tag = await caller.blogTag.create({
      name: `Test Tag ${Date.now()}`,
      slug: `test-tag-${Date.now()}`,
    });

    expect(tag).toBeDefined();
    expect(tag.id).toBeDefined();
    expect(tag.name).toBeDefined();
  });

  it("should allow public users to list tags", async () => {
    const caller = appRouter.createCaller(publicContext);
    
    const tags = await caller.blogTag.list();
    
    expect(Array.isArray(tags)).toBe(true);
  });

  it("should allow admins to delete tags", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    // Create a tag first
    const tag = await caller.blogTag.create({
      name: `Delete Test ${Date.now()}`,
      slug: `delete-test-${Date.now()}`,
    });

    // Delete it
    await expect(
      caller.blogTag.delete({ id: tag.id })
    ).resolves.not.toThrow();
  });

  it("should prevent non-admins from creating tags", async () => {
    const caller = appRouter.createCaller(publicContext);
    
    await expect(
      caller.blogTag.create({
        name: "Unauthorized Tag",
        slug: "unauthorized",
      })
    ).rejects.toThrow();
  });
});

describe("Email Digest System", () => {
  it("should allow admins to generate digest", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    const result = await caller.subscriber.generateDigest();
    
    expect(result).toBeDefined();
    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("message");
  });

  it("should prevent non-admins from generating digest", async () => {
    const caller = appRouter.createCaller(publicContext);
    
    await expect(
      caller.subscriber.generateDigest()
    ).rejects.toThrow();
  });

  it("should handle digest generation with no subscribers", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    // This should succeed even with no subscribers
    const result = await caller.subscriber.generateDigest();
    
    expect(result.success).toBe(true);
  });
});
