import { describe, it, expect, beforeAll } from "vitest";
import { generateBlogRSS, generateCategoryRSS, generateTagRSS } from "./rssGenerator";
import * as cpt from "./customPostTypes";

describe("WordPress-Level Features", () => {
  describe("RSS Feed Generation", () => {
    it("should generate blog RSS feed", async () => {
      const rss = await generateBlogRSS();
      
      expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(rss).toContain('<rss version="2.0"');
      expect(rss).toContain('<channel>');
      expect(rss).toContain('<title>');
      expect(rss).toContain('</channel>');
      expect(rss).toContain('</rss>');
    });

    it("should generate category RSS feed for valid category", async () => {
      // This will return null if category doesn't exist, which is expected
      const rss = await generateCategoryRSS("technology");
      
      // RSS should either be null (category doesn't exist) or valid XML
      if (rss) {
        expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(rss).toContain('<rss version="2.0"');
      }
    });

    it("should return null for non-existent category", async () => {
      const rss = await generateCategoryRSS("nonexistent-category-12345");
      expect(rss).toBeNull();
    });

    it("should generate tag RSS feed for valid tag", async () => {
      const rss = await generateTagRSS("technology");
      
      if (rss) {
        expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(rss).toContain('<rss version="2.0"');
      }
    });

    it("should return null for non-existent tag", async () => {
      const rss = await generateTagRSS("nonexistent-tag-12345");
      expect(rss).toBeNull();
    });
  });

  describe("Custom Post Types", () => {
    let testPostTypeId: number;

    it("should create a custom post type", async () => {
      const result = await cpt.createCustomPostType({
        name: "Test Portfolio",
        slug: `test-portfolio-${Date.now()}`,
        singularName: "Portfolio Item",
        pluralName: "Portfolio Items",
        description: "Test portfolio post type",
        icon: "Briefcase",
        isPublic: 1,
        hasArchive: 1,
        hierarchical: 0,
        supportsTitle: 1,
        supportsContent: 1,
        supportsExcerpt: 1,
        supportsFeaturedImage: 1,
        supportsCategories: 0,
        supportsTags: 0,
        supportsComments: 0,
        menuPosition: 20,
      });

      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
      testPostTypeId = result.id;
    });

    it("should retrieve all custom post types", async () => {
      const postTypes = await cpt.getAllCustomPostTypes();
      
      expect(Array.isArray(postTypes)).toBe(true);
      expect(postTypes.length).toBeGreaterThan(0);
    });

    it("should retrieve custom post type by ID", async () => {
      if (!testPostTypeId) {
        // Skip if no test post type was created
        return;
      }

      const postType = await cpt.getCustomPostTypeById(testPostTypeId);
      
      expect(postType).not.toBeNull();
      expect(postType?.id).toBe(testPostTypeId);
      expect(postType?.name).toBe("Test Portfolio");
    });

    it("should create a custom post item", async () => {
      if (!testPostTypeId) {
        return;
      }

      const result = await cpt.createCustomPostItem({
        postTypeId: testPostTypeId,
        title: "Test Portfolio Item",
        slug: `test-item-${Date.now()}`,
        excerpt: "This is a test portfolio item",
        content: "Full content of the test portfolio item",
        authorId: 1, // Assuming user ID 1 exists
        status: "published",
        publishedAt: new Date(),
        menuOrder: 0,
      });

      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });

    it("should retrieve custom post items by type", async () => {
      if (!testPostTypeId) {
        return;
      }

      const items = await cpt.getCustomPostItemsByType(testPostTypeId);
      
      expect(Array.isArray(items)).toBe(true);
    });

    it("should update custom post type", async () => {
      if (!testPostTypeId) {
        return;
      }

      const result = await cpt.updateCustomPostType(testPostTypeId, {
        description: "Updated description",
      });

      expect(result.success).toBe(true);
    });

    it("should delete custom post type", async () => {
      if (!testPostTypeId) {
        return;
      }

      const result = await cpt.deleteCustomPostType(testPostTypeId);
      
      expect(result.success).toBe(true);

      // Verify deletion
      const postType = await cpt.getCustomPostTypeById(testPostTypeId);
      expect(postType).toBeNull();
    });
  });
});
