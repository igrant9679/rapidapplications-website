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

describe("CMS Page Management", () => {
  let testPageId: number;

  it("should allow admins to create CMS pages", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    const result = await caller.cms.create({
      title: `Test Page ${Date.now()}`,
      slug: `test-page-${Date.now()}`,
      content: "Test content for CMS page",
      metaDescription: "Test meta description",
      status: "draft",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  it("should allow admins to list all CMS pages", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    const pages = await caller.cms.list();
    
    expect(Array.isArray(pages)).toBe(true);
  });

  it("should allow admins to update CMS page status", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    // Create a page first
    await caller.cms.create({
      title: `Update Test ${Date.now()}`,
      slug: `update-test-${Date.now()}`,
      content: "Content to update",
      status: "draft",
    });

    // Get the page
    const pages = await caller.cms.list();
    const testPage = pages[pages.length - 1];

    // Update status to published
    const result = await caller.cms.update({
      id: testPage.id,
      status: "published",
    });

    expect(result.success).toBe(true);
  });

  it("should allow admins to schedule CMS page publishing", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    // Create a page
    await caller.cms.create({
      title: `Schedule Test ${Date.now()}`,
      slug: `schedule-test-${Date.now()}`,
      content: "Content to schedule",
      status: "draft",
    });

    // Get the page
    const pages = await caller.cms.list();
    const testPage = pages[pages.length - 1];

    // Schedule for future
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const result = await caller.cms.update({
      id: testPage.id,
      status: "scheduled",
      scheduledPublishAt: futureDate,
    });

    expect(result.success).toBe(true);
  });

  it("should allow admins to delete CMS pages", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    // Create a page first
    await caller.cms.create({
      title: `Delete Test ${Date.now()}`,
      slug: `delete-test-${Date.now()}`,
      content: "Content to delete",
      status: "draft",
    });

    // Get the page
    const pages = await caller.cms.list();
    const testPage = pages[pages.length - 1];

    // Delete it
    const result = await caller.cms.delete({ id: testPage.id });
    
    expect(result.success).toBe(true);
  });

  it("should prevent non-admins from creating CMS pages", async () => {
    const caller = appRouter.createCaller(publicContext);
    
    await expect(
      caller.cms.create({
        title: "Unauthorized Page",
        slug: "unauthorized",
        content: "Should not work",
        status: "draft",
      })
    ).rejects.toThrow();
  });

  it("should prevent non-admins from listing CMS pages", async () => {
    const caller = appRouter.createCaller(publicContext);
    
    await expect(caller.cms.list()).rejects.toThrow();
  });

  it("should prevent non-admins from updating CMS pages", async () => {
    const caller = appRouter.createCaller(publicContext);
    
    await expect(
      caller.cms.update({
        id: 1,
        status: "published",
      })
    ).rejects.toThrow();
  });

  it("should prevent non-admins from deleting CMS pages", async () => {
    const caller = appRouter.createCaller(publicContext);
    
    await expect(
      caller.cms.delete({ id: 1 })
    ).rejects.toThrow();
  });

  it("should allow admins to archive CMS pages", async () => {
    const caller = appRouter.createCaller(adminContext);
    
    // Create a page
    await caller.cms.create({
      title: `Archive Test ${Date.now()}`,
      slug: `archive-test-${Date.now()}`,
      content: "Content to archive",
      status: "published",
    });

    // Get the page
    const pages = await caller.cms.list();
    const testPage = pages[pages.length - 1];

    // Archive it
    const result = await caller.cms.update({
      id: testPage.id,
      status: "archived",
    });

    expect(result.success).toBe(true);
  });
});
