import { describe, it, expect } from "vitest";
import { logAudit, getAuditLogs } from "./auditLog";
import { appRouter } from "./routers";
import type { User } from "../drizzle/schema";

describe("Audit Log", () => {
  const adminUser: User = {
    id: 1,
    openId: "admin-audit-test",
    role: "admin",
    name: "Admin User",
    email: "admin@test.com",
    loginMethod: "oauth",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const regularUser: User = {
    id: 2,
    openId: "user-audit-test",
    role: "user",
    name: "Regular User",
    email: "user@test.com",
    loginMethod: "oauth",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  describe("Audit Logging", () => {
    it("should log audit events", async () => {
      await logAudit({
        userId: adminUser.id,
        action: "blog:create",
        entityType: "blog_post",
        entityId: 123,
        details: { title: "Test Post" },
        ipAddress: "127.0.0.1",
        userAgent: "Test Agent",
      });

      const logs = await getAuditLogs({ userId: adminUser.id, limit: 10 });
      expect(logs.length).toBeGreaterThan(0);
      
      const latestLog = logs[0];
      expect(latestLog.userId).toBe(adminUser.id);
      expect(latestLog.action).toBe("blog:create");
      expect(latestLog.entityType).toBe("blog_post");
    });

    it("should filter logs by action", async () => {
      await logAudit({
        userId: adminUser.id,
        action: "user:role_change",
        entityType: "user",
        entityId: 456,
      });

      const logs = await getAuditLogs({ action: "user:role_change", limit: 10 });
      expect(logs.every(log => log.action === "user:role_change")).toBe(true);
    });

    it("should filter logs by entity type", async () => {
      const logs = await getAuditLogs({ entityType: "blog_post", limit: 10 });
      expect(logs.every(log => log.entityType === "blog_post")).toBe(true);
    });
  });

  describe("Audit Log Router", () => {
    const adminCaller = appRouter.createCaller({
      user: adminUser,
    } as any);

    const userCaller = appRouter.createCaller({
      user: regularUser,
    } as any);

    it("should allow admin to view audit logs", async () => {
      const result = await adminCaller.auditLog.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should allow admin to view audit stats", async () => {
      const stats = await adminCaller.auditLog.stats();
      expect(stats).toHaveProperty("totalLogs");
      expect(stats).toHaveProperty("actionCounts");
      expect(stats).toHaveProperty("userCounts");
      expect(stats).toHaveProperty("recentActivityCount");
    });

    it("should deny non-admin access to audit logs", async () => {
      await expect(userCaller.auditLog.list()).rejects.toThrow();
    });

    it("should deny non-admin access to audit stats", async () => {
      await expect(userCaller.auditLog.stats()).rejects.toThrow();
    });
  });
});
