import { describe, it, expect } from "vitest";
import { generateOGImage } from "./ogImageGenerator";
import { appRouter } from "./routers";

describe("Final Features", () => {
  const adminCaller = appRouter.createCaller({
    user: { id: 1, openId: "admin-test", role: "admin", name: "Admin", email: "admin@test.com" },
  } as any);

  describe("OG Image Generator", () => {
    it("should generate OG image for blog post", async () => {
      const result = await generateOGImage({
        title: "Test Blog Post Title",
        subtitle: "This is a test subtitle",
        type: "blog",
      });

      expect(result.url).toBeDefined();
      expect(result.key).toContain("og-images/blog-");
      expect(result.url).toContain(".png");
    }, 30000); // Increase timeout for image generation

    it("should generate OG image for page", async () => {
      const result = await generateOGImage({
        title: "Test Page Title",
        type: "page",
      });

      expect(result.url).toBeDefined();
      expect(result.key).toContain("og-images/page-");
    }, 30000);
  });

  describe("Blog Post with OG Image", () => {
    it("should create blog post with auto-generated OG image", async () => {
      const post = await adminCaller.blog.create({
        title: "OG Image Test Post",
        slug: `og-test-${Date.now()}`,
        content: "Test content",
        excerpt: "Test excerpt",
        status: "draft",
        generateOGImage: true,
      });

      expect(post.id).toBeDefined();
      expect(post.ogImage).toBeDefined();
      expect(post.ogImage).toContain("og-images/blog-");

      // Clean up
      await adminCaller.blog.delete({ id: post.id });
    }, 30000);
  });

  describe("Robots.txt", () => {
    it("should have robots.txt file accessible", async () => {
      // This test verifies the file exists in the public directory
      const fs = await import("fs");
      const path = await import("path");
      
      const robotsPath = path.join(process.cwd(), "client", "public", "robots.txt");
      const exists = fs.existsSync(robotsPath);
      
      expect(exists).toBe(true);
      
      if (exists) {
        const content = fs.readFileSync(robotsPath, "utf-8");
        expect(content).toContain("User-agent:");
        expect(content).toContain("Sitemap:");
        expect(content).toContain("/sitemap.xml");
      }
    });
  });
});
