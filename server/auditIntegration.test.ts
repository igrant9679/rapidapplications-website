import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';

describe('Audit Logging Integration', () => {
  const adminCaller = appRouter.createCaller({
    user: { id: 1, openId: 'admin-1', name: 'Admin User', email: 'admin@test.com', role: 'admin' },
  });

  it('should log blog post creation', async () => {
    const postId = await adminCaller.blog.create({
      title: 'Test Post for Audit',
      slug: `test-audit-${Date.now()}`,
      content: 'Content for audit test',
      status: 'draft',
    });

    expect(postId).toBeTypeOf('number');

    // Check audit log
    const logs = await adminCaller.auditLog.list({
      action: 'blog:create',
      entityId: postId,
    });

    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].action).toBe('blog:create');
    expect(logs[0].entityType).toBe('blog_post');
    expect(logs[0].entityId).toBe(postId);
  });

  it('should log blog post update', async () => {
    // Create a post first
    const postId = await adminCaller.blog.create({
      title: 'Test Post for Update Audit',
      slug: `test-update-audit-${Date.now()}`,
      content: 'Original content',
      status: 'draft',
    });

    // Update the post
    await adminCaller.blog.update({
      id: postId,
      title: 'Updated Title',
    });

    // Check audit log
    const logs = await adminCaller.auditLog.list({
      action: 'blog:update',
      entityId: postId,
    });

    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].action).toBe('blog:update');
    expect(logs[0].entityId).toBe(postId);
  });

  it('should log blog post deletion', async () => {
    // Create a post first
    const postId = await adminCaller.blog.create({
      title: 'Test Post for Delete Audit',
      slug: `test-delete-audit-${Date.now()}`,
      content: 'Content to be deleted',
      status: 'draft',
    });

    // Delete the post
    await adminCaller.blog.delete({ id: postId });

    // Check audit log
    const logs = await adminCaller.auditLog.list({
      action: 'blog:delete',
      entityId: postId,
    });

    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].action).toBe('blog:delete');
    expect(logs[0].entityId).toBe(postId);
  });

  it('should export audit logs to CSV', async () => {
    const result = await adminCaller.auditLog.export({
      format: 'csv',
    });

    expect(result.format).toBe('csv');
    expect(result.data).toContain('"ID","User ID","User Name"');
    expect(result.filename).toMatch(/audit-log-.*\.csv/);
  });

  it('should export audit logs to JSON', async () => {
    const result = await adminCaller.auditLog.export({
      format: 'json',
    });

    expect(result.format).toBe('json');
    const parsed = JSON.parse(result.data);
    expect(Array.isArray(parsed)).toBe(true);
    expect(result.filename).toMatch(/audit-log-.*\.json/);
  });

  it('should filter exported logs by action', async () => {
    const result = await adminCaller.auditLog.export({
      format: 'json',
      action: 'blog:create',
    });

    const parsed = JSON.parse(result.data);
    expect(Array.isArray(parsed)).toBe(true);
    
    // All logs should be blog:create
    parsed.forEach((log: any) => {
      expect(log.action).toBe('blog:create');
    });
  });
});
