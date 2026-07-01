import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import * as db from './db';
import type { TrpcContext } from './_core/context';

type AuthenticatedUser = NonNullable<TrpcContext['user']>;

describe('CMS Page Management Features', () => {
  let adminCaller: ReturnType<typeof appRouter.createCaller>;
  let testPageId: number;

  beforeAll(async () => {
    // Create admin context
    const adminUser: AuthenticatedUser = {
      id: 1,
      openId: 'test-admin',
      name: 'Test Admin',
      email: 'admin@test.com',
      loginMethod: 'manus',
      role: 'admin' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const adminContext: TrpcContext = {
      user: adminUser,
      req: {} as any,
      res: {} as any,
    };

    adminCaller = appRouter.createCaller(adminContext);

    // Create a test page with timestamp to ensure uniqueness
    const timestamp = Date.now();
    await adminCaller.cms.create({
      title: 'Original Test Page',
      slug: `original-test-page-${timestamp}`,
      content: 'Original content',
      metaDescription: 'Original description',
      status: 'draft',
    });

    // Get the created page ID
    const pages = await adminCaller.cms.list();
    const testPage = pages.find((p: any) => p.slug === `original-test-page-${timestamp}`);
    testPageId = testPage!.id;
  });

  describe('Page Duplication', () => {
    it('should duplicate a page with unique slug', async () => {
      const result = await adminCaller.cms.duplicate({ id: testPageId });
      expect(result.success).toBe(true);
      expect(result.slug).toContain('-copy');

      // Verify the duplicated page exists
      const pages = await adminCaller.cms.list();
      const duplicatedPage = pages.find((p: any) => p.slug === result.slug);
      expect(duplicatedPage).toBeDefined();
      expect(duplicatedPage!.title).toBe('Original Test Page (Copy)');
      expect(duplicatedPage!.content).toBe('Original content');
      expect(duplicatedPage!.status).toBe('draft');
    });

    it('should handle multiple duplications with incremented suffixes', async () => {
      // Duplicate again
      const result = await adminCaller.cms.duplicate({ id: testPageId });
      expect(result.success).toBe(true);
      expect(result.slug).toContain('-copy-');

      // Verify the page exists
      const pages = await adminCaller.cms.list();
      const duplicatedPage = pages.find((p: any) => p.slug === result.slug);
      expect(duplicatedPage).toBeDefined();
    });

    it('should fail to duplicate non-existent page', async () => {
      await expect(adminCaller.cms.duplicate({ id: 99999 })).rejects.toThrow('Page not found');
    });
  });

  describe('Page Templates', () => {
    it('should create page with landing template', async () => {
      const timestamp = Date.now();
      const result = await adminCaller.cms.create({
        title: 'Landing Page',
        slug: `landing-page-test-${timestamp}`,
        content: '# Welcome to Our Platform\n\n## Transform Your Awards Management',
        metaDescription: 'Landing page',
        status: 'draft',
        template: 'landing',
      });
      expect(result.success).toBe(true);

      const pages = await adminCaller.cms.list();
      const landingPage = pages.find((p: any) => p.slug === `landing-page-test-${timestamp}`);
      expect(landingPage).toBeDefined();
      expect(landingPage!.template).toBe('landing');
    });

    it('should create page with about template', async () => {
      const timestamp = Date.now();
      const result = await adminCaller.cms.create({
        title: 'About Page',
        slug: `about-page-test-${timestamp}`,
        content: '# About Us\n\n## Our Mission',
        metaDescription: 'About page',
        status: 'draft',
        template: 'about',
      });
      expect(result.success).toBe(true);

      const pages = await adminCaller.cms.list();
      const aboutPage = pages.find((p: any) => p.slug === `about-page-test-${timestamp}`);
      expect(aboutPage).toBeDefined();
      expect(aboutPage!.template).toBe('about');
    });

    it('should default to blank template if not specified', async () => {
      const timestamp = Date.now();
      const result = await adminCaller.cms.create({
        title: 'Default Template Page',
        slug: `default-template-test-${timestamp}`,
        content: 'Content',
        metaDescription: 'Default',
        status: 'draft',
      });
      expect(result.success).toBe(true);

      const pages = await adminCaller.cms.list();
      const defaultPage = pages.find((p: any) => p.slug === `default-template-test-${timestamp}`);
      expect(defaultPage).toBeDefined();
    });
  });

  describe('Page Reordering', () => {
    let page1Id: number;
    let page2Id: number;
    let page3Id: number;

    beforeAll(async () => {
      // Create three test pages
      const timestamp = Date.now();
      await adminCaller.cms.create({
        title: 'Page 1',
        slug: `reorder-page-1-${timestamp}`,
        content: 'Content 1',
        status: 'draft',
      });
      await adminCaller.cms.create({
        title: 'Page 2',
        slug: `reorder-page-2-${timestamp}`,
        content: 'Content 2',
        status: 'draft',
      });
      await adminCaller.cms.create({
        title: 'Page 3',
        slug: `reorder-page-3-${timestamp}`,
        content: 'Content 3',
        status: 'draft',
      });

      const pages = await adminCaller.cms.list();
      page1Id = pages.find((p: any) => p.slug === `reorder-page-1-${timestamp}`)!.id;
      page2Id = pages.find((p: any) => p.slug === `reorder-page-2-${timestamp}`)!.id;
      page3Id = pages.find((p: any) => p.slug === `reorder-page-3-${timestamp}`)!.id;
    });

    it('should reorder pages successfully', async () => {
      const result = await adminCaller.cms.reorder({
        pageOrders: [
          { id: page3Id, displayOrder: 0 },
          { id: page1Id, displayOrder: 1 },
          { id: page2Id, displayOrder: 2 },
        ],
      });
      expect(result.success).toBe(true);

      // Verify the order was updated
      const page1 = await db.getCmsPageById(page1Id);
      const page2 = await db.getCmsPageById(page2Id);
      const page3 = await db.getCmsPageById(page3Id);

      expect(page3!.displayOrder).toBe(0);
      expect(page1!.displayOrder).toBe(1);
      expect(page2!.displayOrder).toBe(2);
    });

    it('should handle empty reorder array', async () => {
      const result = await adminCaller.cms.reorder({
        pageOrders: [],
      });
      expect(result.success).toBe(true);
    });

    it('should update displayOrder for single page', async () => {
      const result = await adminCaller.cms.reorder({
        pageOrders: [{ id: page1Id, displayOrder: 99 }],
      });
      expect(result.success).toBe(true);

      const page1 = await db.getCmsPageById(page1Id);
      expect(page1!.displayOrder).toBe(99);
    });
  });
});
