import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";

describe("CMS Advanced Features", () => {
  let adminCaller: any;
  let testPageId: number;

  beforeAll(async () => {
    // Create admin caller
    adminCaller = appRouter.createCaller({
      user: { id: 1, openId: "test-admin", name: "Admin", role: "admin" },
    });

    // Create a test page
    const result = await adminCaller.cms.create({
      title: "Test Version Page",
      slug: `test-version-${Date.now()}`,
      content: "Initial content",
      metaDescription: "Test page for version history",
      status: "draft",
    });
    testPageId = result.id;
  });

  describe("Version History", () => {
    it("should create version snapshot on update", async () => {
      // Update the page
      await adminCaller.cms.update({
        id: testPageId,
        title: "Updated Title",
        content: "Updated content",
      });

      // Get version history
      const versions = await adminCaller.cms.versions({ pageId: testPageId });
      expect(versions.length).toBeGreaterThan(0);
      expect(versions[0].title).toBe("Test Version Page");
    });

    it("should restore page from version", async () => {
      // Get versions
      const versions = await adminCaller.cms.versions({ pageId: testPageId });
      const versionId = versions[0].id;

      // Restore from version
      await adminCaller.cms.restore({ pageId: testPageId, versionId });

      // Verify restoration
      const page = await adminCaller.cms.getById({ id: testPageId });
      expect(page.title).toBe("Test Version Page");
    });
  });

  describe("Preview Mode", () => {
    it("should generate preview token", async () => {
      const result = await adminCaller.cms.generatePreviewToken({
        pageId: testPageId,
      });
      expect(result.token).toBeDefined();
      expect(result.token.length).toBeGreaterThan(0);
      expect(result.expiresAt).toBeInstanceOf(Date);
    });

    it("should access page via preview token", async () => {
      // Generate token
      const { token } = await adminCaller.cms.generatePreviewToken({
        pageId: testPageId,
      });

      // Create public caller
      const publicCaller = appRouter.createCaller({ user: null });

      // Access via token
      const page = await publicCaller.cms.getByPreviewToken({ token });
      expect(page).toBeDefined();
      expect(page.id).toBe(testPageId);
    });
  });

  describe("Access Control", () => {
    it("should enforce private page access", async () => {
      // Create private page
      const privatePage = await adminCaller.cms.create({
        title: "Private Page",
        slug: `private-${Date.now()}`,
        content: "Private content",
        status: "published",
        visibility: "private",
        requiredRole: "admin",
      });

      // Try to access as public user
      const publicCaller = appRouter.createCaller({ user: null });
      await expect(
        publicCaller.cms.getBySlug({ slug: privatePage.slug })
      ).rejects.toThrow();

      // Try to access as regular user
      const userCaller = appRouter.createCaller({
        user: { id: 2, openId: "test-user", name: "User", role: "user" },
      });
      await expect(
        userCaller.cms.getBySlug({ slug: privatePage.slug })
      ).rejects.toThrow();

      // Admin should bypass access control
      const page = await adminCaller.cms.getBySlug({ slug: privatePage.slug });
      expect(page.id).toBe(privatePage.id);
      
      // Clean up
      await adminCaller.cms.delete({ id: privatePage.id });
    });

    it("should enforce password protection", async () => {
      // Create password-protected page
      const protectedPage = await adminCaller.cms.create({
        title: "Password Protected",
        slug: `protected-${Date.now()}`,
        content: "Protected content",
        status: "published",
        visibility: "password",
        password: "secret123",
      });

      const publicCaller = appRouter.createCaller({ user: null });

      // Try without password
      await expect(
        publicCaller.cms.getBySlug({ slug: protectedPage.slug })
      ).rejects.toThrow();

      // Try with wrong password
      await expect(
        publicCaller.cms.getBySlug({
          slug: protectedPage.slug,
          password: "wrong",
        })
      ).rejects.toThrow();

      // Access with correct password
      const page = await publicCaller.cms.getBySlug({
        slug: protectedPage.slug,
        password: "secret123",
      });
      expect(page.id).toBe(protectedPage.id);
      
      // Clean up
      await adminCaller.cms.delete({ id: protectedPage.id });
    });

    it("should allow public access to public pages", async () => {
      // Create public page
      const publicPage = await adminCaller.cms.create({
        title: "Public Page",
        slug: `public-${Date.now()}`,
        content: "Public content",
        status: "published",
        visibility: "public",
      });

      const publicCaller = appRouter.createCaller({ user: null });

      // Should access successfully
      const page = await publicCaller.cms.getBySlug({ slug: publicPage.slug });
      expect(page.id).toBe(publicPage.id);
      
      // Clean up
      await adminCaller.cms.delete({ id: publicPage.id });
    });
  });
});
