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

describe("Bulk Actions for CMS Pages", () => {
  it("should allow bulk publishing of multiple pages", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    // Create multiple draft pages
    const pageIds: number[] = [];
    for (let i = 0; i < 3; i++) {
      await caller.cms.create({
        title: `Bulk Publish Test ${Date.now()}-${i}`,
        slug: `bulk-publish-${Date.now()}-${i}`,
        content: "Content for bulk publish",
        status: "draft",
      });
    }

    // Get created pages
    const pages = await caller.cms.list();
    const testPages = pages.slice(-3);

    // Bulk publish
    for (const page of testPages) {
      const result = await caller.cms.update({
        id: page.id,
        status: "published",
      });
      expect(result.success).toBe(true);
    }

    // Verify all are published
    const updatedPages = await caller.cms.list();
    const publishedPages = updatedPages.filter((p: any) => 
      testPages.some((tp: any) => tp.id === p.id)
    );
    
    expect(publishedPages.every((p: any) => p.status === "published")).toBe(true);
  });

  it("should allow bulk archiving of multiple pages", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    // Create multiple published pages
    for (let i = 0; i < 3; i++) {
      await caller.cms.create({
        title: `Bulk Archive Test ${Date.now()}-${i}`,
        slug: `bulk-archive-${Date.now()}-${i}`,
        content: "Content for bulk archive",
        status: "published",
      });
    }

    // Get created pages
    const pages = await caller.cms.list();
    const testPages = pages.slice(-3);

    // Bulk archive
    for (const page of testPages) {
      const result = await caller.cms.update({
        id: page.id,
        status: "archived",
      });
      expect(result.success).toBe(true);
    }

    // Verify all are archived
    const updatedPages = await caller.cms.list();
    const archivedPages = updatedPages.filter((p: any) => 
      testPages.some((tp: any) => tp.id === p.id)
    );
    
    expect(archivedPages.every((p: any) => p.status === "archived")).toBe(true);
  });

  it("should allow bulk deletion of multiple pages", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    // Create multiple pages
    const pageIds: number[] = [];
    for (let i = 0; i < 3; i++) {
      await caller.cms.create({
        title: `Bulk Delete Test ${Date.now()}-${i}`,
        slug: `bulk-delete-${Date.now()}-${i}`,
        content: "Content for bulk delete",
        status: "draft",
      });
    }

    // Get created pages
    const pagesBefore = await caller.cms.list();
    const testPages = pagesBefore.slice(-3);
    const initialCount = pagesBefore.length;

    // Bulk delete
    for (const page of testPages) {
      const result = await caller.cms.delete({ id: page.id });
      expect(result.success).toBe(true);
    }

    // Verify pages are deleted
    const pagesAfter = await caller.cms.list();
    expect(pagesAfter.length).toBe(initialCount - 3);
  });

  it("should handle mixed status bulk operations", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    // Create pages with different statuses
    await caller.cms.create({
      title: `Mixed Status 1 ${Date.now()}`,
      slug: `mixed-1-${Date.now()}`,
      content: "Draft content",
      status: "draft",
    });

    await caller.cms.create({
      title: `Mixed Status 2 ${Date.now()}`,
      slug: `mixed-2-${Date.now()}`,
      content: "Published content",
      status: "published",
    });

    // Get created pages
    const pages = await caller.cms.list();
    const testPages = pages.slice(-2);

    // Bulk update to same status
    for (const page of testPages) {
      const result = await caller.cms.update({
        id: page.id,
        status: "archived",
      });
      expect(result.success).toBe(true);
    }

    // Verify all have same status
    const updatedPages = await caller.cms.list();
    const archivedPages = updatedPages.filter((p: any) => 
      testPages.some((tp: any) => tp.id === p.id)
    );
    
    expect(archivedPages.every((p: any) => p.status === "archived")).toBe(true);
  });

  it("should maintain data integrity during bulk operations", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    // Create test page
    await caller.cms.create({
      title: `Integrity Test ${Date.now()}`,
      slug: `integrity-${Date.now()}`,
      content: "Original content",
      metaDescription: "Original description",
      status: "draft",
    });

    // Get created page
    const pages = await caller.cms.list();
    const testPage = pages[pages.length - 1];

    // Update status without changing other fields
    await caller.cms.update({
      id: testPage.id,
      status: "published",
    });

    // Verify other fields unchanged
    const updatedPages = await caller.cms.list();
    const updatedPage = updatedPages.find((p: any) => p.id === testPage.id);
    
    expect(updatedPage.title).toBe(testPage.title);
    expect(updatedPage.content).toBe(testPage.content);
    expect(updatedPage.metaDescription).toBe(testPage.metaDescription);
    expect(updatedPage.status).toBe("published");
  });
});
