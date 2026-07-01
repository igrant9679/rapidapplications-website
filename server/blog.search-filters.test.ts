import { describe, it, expect, beforeEach } from "vitest";
import * as db from "./db";

describe("Blog Search Filters", () => {
  let testUserId1: number;
  let testUserId2: number;
  let testCategoryId1: number;
  let testCategoryId2: number;
  let testTagId1: number;
  let testTagId2: number;
  let testPostId1: number;
  let testPostId2: number;
  let testPostId3: number;

  beforeEach(async () => {
    // Create test users
    await db.upsertUser({
      openId: "test-search-filter-user-1",
      name: "Test Author 1",
      email: "author1-search-filter@test.com",
      role: "author",
    });
    await db.upsertUser({
      openId: "test-search-filter-user-2",
      name: "Test Author 2",
      email: "author2-search-filter@test.com",
      role: "author",
    });

    const user1 = await db.getUserByOpenId("test-search-filter-user-1");
    const user2 = await db.getUserByOpenId("test-search-filter-user-2");
    testUserId1 = user1!.id;
    testUserId2 = user2!.id;

    // Create test categories with unique names
    const timestamp = Date.now();
    const category1 = await db.createBlogCategory({
      name: `Technology-${timestamp}`,
      slug: `technology-${timestamp}`,
      description: "Tech posts",
    });
    testCategoryId1 = category1.id;
    
    const category2 = await db.createBlogCategory({
      name: `Education-${timestamp}`,
      slug: `education-${timestamp}`,
      description: "Education posts",
    });
    testCategoryId2 = category2.id;

    // Create test tags with unique names
    const tag1 = await db.createBlogTag({
      name: `AI-${timestamp}`,
      slug: `ai-${timestamp}`,
    });
    testTagId1 = tag1.id;
    
    const tag2 = await db.createBlogTag({
      name: `Grants-${timestamp}`,
      slug: `grants-${timestamp}`,
    });
    testTagId2 = tag2.id;

    // Create test posts with different dates
    testPostId1 = await db.createBlogPost({
      title: `AI in Education ${timestamp}`,
      slug: `ai-in-education-${timestamp}`,
      content: "Content about AI in education",
      excerpt: "AI transforms education",
      authorId: testUserId1,
      status: "published",
      publishedAt: new Date("2024-01-15"),
    });

    testPostId2 = await db.createBlogPost({
      title: `Grant Management Technology ${timestamp}`,
      slug: `grant-management-tech-${timestamp}`,
      content: "Content about grant management",
      excerpt: "Modern grant management",
      authorId: testUserId2,
      status: "published",
      publishedAt: new Date("2024-02-20"),
    });

    testPostId3 = await db.createBlogPost({
      title: `Future of AI ${timestamp}`,
      slug: `future-of-ai-${timestamp}`,
      content: "Content about future AI",
      excerpt: "AI predictions",
      authorId: testUserId1,
      status: "published",
      publishedAt: new Date("2024-03-10"),
    });

    // Assign categories
    await db.assignCategoriesToPost(testPostId1, [testCategoryId2]); // Education
    await db.assignCategoriesToPost(testPostId2, [testCategoryId1]); // Technology
    await db.assignCategoriesToPost(testPostId3, [testCategoryId1]); // Technology

    // Assign tags
    await db.assignTagsToPost(testPostId1, [testTagId1]); // AI
    await db.assignTagsToPost(testPostId2, [testTagId2]); // Grants
    await db.assignTagsToPost(testPostId3, [testTagId1]); // AI
  });

  it("should filter posts by author", async () => {
    const result = await db.searchBlogPosts({
      authorId: testUserId1,
    });

    // All posts should be by this author
    expect(result.posts.every((p) => p.authorId === testUserId1)).toBe(true);
    // Should have at least our 2 test posts
    expect(result.posts.length).toBeGreaterThanOrEqual(2);
  });

  it("should filter posts by category", async () => {
    const result = await db.searchBlogPosts({
      categoryId: testCategoryId1, // Technology
    });

    expect(result.posts).toHaveLength(2);
    const titles = result.posts.map((p) => p.title);
    expect(titles.some((t) => t.includes("Grant Management Technology"))).toBe(true);
    expect(titles.some((t) => t.includes("Future of AI"))).toBe(true);
  });

  it("should filter posts by tag", async () => {
    const result = await db.searchBlogPosts({
      tagId: testTagId1, // AI
    });

    expect(result.posts).toHaveLength(2);
    const titles = result.posts.map((p) => p.title);
    expect(titles.some((t) => t.includes("AI in Education"))).toBe(true);
    expect(titles.some((t) => t.includes("Future of AI"))).toBe(true);
  });

  it("should filter posts by date range", async () => {
    const result = await db.searchBlogPosts({
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-02-28"),
    });

    // Should include our test post from Feb 20
    const testPost = result.posts.find(p => p.title.includes("Grant Management Technology"));
    expect(testPost).toBeDefined();
  });

  it("should filter posts by start date only", async () => {
    const result = await db.searchBlogPosts({
      startDate: new Date("2024-02-15"),
      authorId: testUserId1, // Also filter by author to isolate our test data
    });

    // Should include Future of AI (March 10)
    const testPost = result.posts.find(p => p.title.includes("Future of AI"));
    expect(testPost).toBeDefined();
  });

  it("should filter posts by end date only", async () => {
    const result = await db.searchBlogPosts({
      endDate: new Date("2024-02-15"),
    });

    // Filter to only our test posts
    const testPosts = result.posts.filter(p => p.title.includes("AI in Education"));
    expect(testPosts.length).toBeGreaterThanOrEqual(1);
    expect(testPosts[0].title).toContain("AI in Education");
  });

  it("should combine multiple filters (author + category)", async () => {
    const result = await db.searchBlogPosts({
      authorId: testUserId1,
      categoryId: testCategoryId1, // Technology
    });

    expect(result.posts).toHaveLength(1);
    expect(result.posts[0].title).toContain("Future of AI");
  });

  it("should combine multiple filters (author + tag + date)", async () => {
    const result = await db.searchBlogPosts({
      authorId: testUserId1,
      tagId: testTagId1, // AI
      startDate: new Date("2024-03-01"),
    });

    expect(result.posts).toHaveLength(1);
    expect(result.posts[0].title).toContain("Future of AI");
  });

  it("should return empty results when filters match nothing", async () => {
    const result = await db.searchBlogPosts({
      authorId: testUserId2,
      categoryId: testCategoryId2, // Education (but author2 has no education posts)
    });

    expect(result.posts).toHaveLength(0);
  });

  it("should handle pagination with filters", async () => {
    const result = await db.searchBlogPosts({
      authorId: testUserId1,
      page: 1,
      limit: 1,
    });

    expect(result.posts).toHaveLength(1);
    expect(result.total).toBeGreaterThanOrEqual(2); // At least our 2 test posts
    expect(result.page).toBe(1);
    expect(result.limit).toBe(1);
  });

  it("should return all posts when no filters are applied", async () => {
    const result = await db.searchBlogPosts({});

    // Should include at least our 3 test posts
    expect(result.posts.length).toBeGreaterThanOrEqual(3);
  });
});
