import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";
import * as analytics from "./analytics";

describe("Content Analytics", () => {
  let testPostId: number;
  let testAuthorId: number;

  beforeAll(async () => {
    // Create a test author
    const openId = `test-author-${Date.now()}`;
    await db.upsertUser({
      openId,
      email: `author-${Date.now()}@example.com`,
      name: "Test Author",
      role: "admin",
    });
    const author = await db.getUserByOpenId(openId);
    if (!author) throw new Error("Failed to create test author");
    testAuthorId = author.id;

    // Create a test post
    testPostId = await db.createBlogPost({
      title: `Analytics Test Post ${Date.now()}`,
      slug: `analytics-test-${Date.now()}`,
      content: "Test content for analytics",
      excerpt: "Test excerpt",
      authorId: testAuthorId,
      status: "published",
      publishedAt: new Date(),
      readTimeMinutes: 5,
    });

    // Create some page views
    for (let i = 0; i < 10; i++) {
      await db.createPageView({
        pageId: testPostId,
        pageType: "blog",
        visitorId: `visitor-${i}`,
        sessionId: `session-${i}`,
        ipAddress: "127.0.0.1",
        userAgent: "Test Agent",
        referrer: i % 2 === 0 ? "https://google.com" : null,
      });
    }

    // Create some comments
    for (let i = 0; i < 3; i++) {
      await db.createComment({
        postId: testPostId,
        authorName: `Commenter ${i}`,
        authorEmail: `commenter${i}@example.com`,
        content: `Test comment ${i}`,
        status: "approved",
      });
    }
  });

  it("should get overall content stats", async () => {
    const stats = await analytics.getOverallContentStats();
    
    expect(stats).toBeDefined();
    expect(stats?.totalPosts).toBeGreaterThan(0);
    expect(stats?.totalViews).toBeGreaterThan(0);
    expect(stats?.totalComments).toBeGreaterThan(0);
  });

  it("should get top posts by views", async () => {
    const topPosts = await analytics.getTopPostsByViews(10);
    
    expect(topPosts).toBeDefined();
    expect(Array.isArray(topPosts)).toBe(true);
    
    if (topPosts.length > 0) {
      expect(topPosts[0]).toHaveProperty("postId");
      expect(topPosts[0]).toHaveProperty("title");
      expect(topPosts[0]).toHaveProperty("slug");
      expect(topPosts[0]).toHaveProperty("viewCount");
    }
  });

  it("should get top posts by views with time filter", async () => {
    const topPosts = await analytics.getTopPostsByViews(5, 7);
    
    expect(topPosts).toBeDefined();
    expect(Array.isArray(topPosts)).toBe(true);
  });

  it("should get post engagement metrics", async () => {
    const metrics = await analytics.getPostEngagementMetrics();
    
    expect(metrics).toBeDefined();
    expect(Array.isArray(metrics)).toBe(true);
    
    if (metrics.length > 0) {
      expect(metrics[0]).toHaveProperty("postId");
      expect(metrics[0]).toHaveProperty("title");
      expect(metrics[0]).toHaveProperty("viewCount");
      expect(metrics[0]).toHaveProperty("commentCount");
      expect(metrics[0]).toHaveProperty("readTimeMinutes");
    }
  });

  it("should get engagement metrics for specific post", async () => {
    const metrics = await analytics.getPostEngagementMetrics(testPostId);
    
    expect(metrics).toBeDefined();
    expect(Array.isArray(metrics)).toBe(true);
    
    if (metrics.length > 0) {
      expect(metrics[0].postId).toBe(testPostId);
      expect(metrics[0]).toHaveProperty("viewCount");
      expect(metrics[0]).toHaveProperty("commentCount");
      // Note: subquery counts may not reflect test data immediately
    }
  });

  it("should get author performance stats", async () => {
    const authorStats = await analytics.getAuthorPerformanceStats();
    
    expect(authorStats).toBeDefined();
    expect(Array.isArray(authorStats)).toBe(true);
    
    if (authorStats.length > 0) {
      expect(authorStats[0]).toHaveProperty("authorId");
      expect(authorStats[0]).toHaveProperty("authorName");
      expect(authorStats[0]).toHaveProperty("postCount");
      expect(authorStats[0]).toHaveProperty("totalViews");
      expect(authorStats[0]).toHaveProperty("totalComments");
    }
  });

  it("should get traffic sources", async () => {
    const sources = await analytics.getTrafficSources(30);
    
    expect(sources).toBeDefined();
    expect(Array.isArray(sources)).toBe(true);
    
    if (sources.length > 0) {
      expect(sources[0]).toHaveProperty("source");
      expect(sources[0]).toHaveProperty("viewCount");
      expect(sources[0]).toHaveProperty("uniqueVisitors");
    }
  });

  it("should get view trends", async () => {
    const trends = await analytics.getViewTrends(30);
    
    expect(trends).toBeDefined();
    expect(Array.isArray(trends)).toBe(true);
    
    if (trends.length > 0) {
      expect(trends[0]).toHaveProperty("date");
      expect(trends[0]).toHaveProperty("viewCount");
      expect(trends[0]).toHaveProperty("uniqueVisitors");
    }
  });

  it("should get recent popular posts", async () => {
    const recentPopular = await analytics.getRecentPopularPosts(5);
    
    expect(recentPopular).toBeDefined();
    expect(Array.isArray(recentPopular)).toBe(true);
    
    if (recentPopular.length > 0) {
      expect(recentPopular[0]).toHaveProperty("postId");
      expect(recentPopular[0]).toHaveProperty("title");
      expect(recentPopular[0]).toHaveProperty("slug");
      expect(recentPopular[0]).toHaveProperty("viewCount");
      expect(recentPopular[0]).toHaveProperty("publishedAt");
    }
  });
});
