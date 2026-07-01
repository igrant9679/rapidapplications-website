import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";

describe("SEO and Analytics Features", () => {
  const adminCaller = appRouter.createCaller({
    user: { id: 1, openId: "admin-test", role: "admin", name: "Admin", email: "admin@test.com" },
  } as any);

  const publicCaller = appRouter.createCaller({ user: null } as any);

  describe("Analytics", () => {
    it("should track page views", async () => {
      // Create a test blog post
      const post = await adminCaller.blog.create({
        title: "Analytics Test Post",
        slug: `analytics-test-${Date.now()}`,
        content: "Test content for analytics",
        status: "published",
      });

      // Create a page view
      await db.createPageView({
        pageId: post.id,
        pageType: "blog",
        visitorId: "test-visitor-1",
        sessionId: "test-session-1",
        ipAddress: "127.0.0.1",
        userAgent: "Test Browser",
        referrer: "https://google.com",
      });

      // Get analytics
      const stats = await publicCaller.analytics.getPageStats({
        pageId: post.id,
        pageType: "blog",
      });

      expect(stats.totalViews).toBeGreaterThan(0);
      expect(stats.uniqueVisitors).toBeGreaterThan(0);

      // Clean up
      await adminCaller.blog.delete({ id: post.id });
    });

    it("should count unique visitors correctly", async () => {
      // Create a test blog post
      const post = await adminCaller.blog.create({
        title: "Unique Visitors Test",
        slug: `unique-visitors-${Date.now()}`,
        content: "Test content",
        status: "published",
      });

      // Create multiple views from same visitor
      await db.createPageView({
        pageId: post.id,
        pageType: "blog",
        visitorId: "visitor-1",
        sessionId: "session-1",
        ipAddress: null,
        userAgent: null,
        referrer: null,
      });

      await db.createPageView({
        pageId: post.id,
        pageType: "blog",
        visitorId: "visitor-1",
        sessionId: "session-2",
        ipAddress: null,
        userAgent: null,
        referrer: null,
      });

      // Create view from different visitor
      await db.createPageView({
        pageId: post.id,
        pageType: "blog",
        visitorId: "visitor-2",
        sessionId: "session-3",
        ipAddress: null,
        userAgent: null,
        referrer: null,
      });

      const stats = await publicCaller.analytics.getPageStats({
        pageId: post.id,
        pageType: "blog",
      });

      expect(stats.totalViews).toBe(3);
      expect(stats.uniqueVisitors).toBe(2);

      // Clean up
      await adminCaller.blog.delete({ id: post.id });
    });
  });

  describe("Structured Data", () => {
    it("should include structured data helpers", async () => {
      // Import the structured data module
      const { generateBlogPostStructuredData, generatePageStructuredData } = await import(
        "../shared/structuredData"
      );

      // Test blog post structured data
      const blogData = generateBlogPostStructuredData({
        title: "Test Post",
        slug: "test-post",
        content: "Test content",
        author: { name: "Test Author" },
        publishedAt: new Date(),
        updatedAt: new Date(),
      });

      expect(blogData["@context"]).toBe("https://schema.org");
      expect(blogData["@type"]).toBe("BlogPosting");
      expect(blogData.headline).toBe("Test Post");

      // Test page structured data
      const pageData = generatePageStructuredData({
        title: "Test Page",
        slug: "test-page",
        content: "Test content",
        updatedAt: new Date(),
      });

      expect(pageData["@context"]).toBe("https://schema.org");
      expect(pageData["@type"]).toBe("WebPage");
      expect(pageData.name).toBe("Test Page");
    });
  });
});
