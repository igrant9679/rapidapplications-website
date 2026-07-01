import { describe, it, expect } from "vitest";

describe("Author Attribution System", () => {
  describe("Blog Post Author Information", () => {
    it("should include author information in getPublishedBlogPosts", async () => {
      const module = await import("./db");
      const posts = await module.getPublishedBlogPosts();
      
      if (posts.length > 0) {
        const post = posts[0];
        expect(post).toHaveProperty("authorId");
        expect(post).toHaveProperty("authorName");
        expect(post).toHaveProperty("authorEmail");
      }
    });
  });

  describe("Default Menu", () => {
    it("should have header menu created", async () => {
      const module = await import("./menuManagement");
      const menus = await module.getAllMenus();
      
      const headerMenu = menus.find(m => m.location === "header");
      expect(headerMenu).toBeDefined();
    });
  });
});
