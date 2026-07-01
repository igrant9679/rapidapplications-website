import { describe, it, expect } from "vitest";
import { hasPermission, requirePermission, canEdit, canDelete } from "./permissions";
import { appRouter } from "./routers";
import type { User } from "../drizzle/schema";

describe("User Roles & Permissions", () => {
  const adminUser: User = {
    id: 1,
    openId: "admin-test",
    role: "admin",
    name: "Admin User",
    email: "admin@test.com",
    loginMethod: "oauth",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const editorUser: User = {
    id: 2,
    openId: "editor-test",
    role: "editor",
    name: "Editor User",
    email: "editor@test.com",
    loginMethod: "oauth",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const contributorUser: User = {
    id: 3,
    openId: "contributor-test",
    role: "contributor",
    name: "Contributor User",
    email: "contributor@test.com",
    loginMethod: "oauth",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const viewerUser: User = {
    id: 4,
    openId: "viewer-test",
    role: "viewer",
    name: "Viewer User",
    email: "viewer@test.com",
    loginMethod: "oauth",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  describe("Permission Checks", () => {
    it("admin should have all permissions", () => {
      expect(hasPermission(adminUser, "blog:create")).toBe(true);
      expect(hasPermission(adminUser, "blog:edit:any")).toBe(true);
      expect(hasPermission(adminUser, "blog:delete:any")).toBe(true);
      expect(hasPermission(adminUser, "users:manage")).toBe(true);
    });

    it("editor should have content permissions but not user management", () => {
      expect(hasPermission(editorUser, "blog:create")).toBe(true);
      expect(hasPermission(editorUser, "blog:edit:any")).toBe(true);
      expect(hasPermission(editorUser, "blog:publish")).toBe(true);
      expect(hasPermission(editorUser, "users:manage")).toBe(false);
    });

    it("contributor should only edit own content", () => {
      expect(hasPermission(contributorUser, "blog:create")).toBe(true);
      expect(hasPermission(contributorUser, "blog:edit:own")).toBe(true);
      expect(hasPermission(contributorUser, "blog:edit:any")).toBe(false);
      expect(hasPermission(contributorUser, "blog:publish")).toBe(false);
    });

    it("viewer should only have analytics access", () => {
      expect(hasPermission(viewerUser, "analytics:view")).toBe(true);
      expect(hasPermission(viewerUser, "blog:create")).toBe(false);
      expect(hasPermission(viewerUser, "blog:edit:own")).toBe(false);
    });
  });

  describe("Resource Ownership", () => {
    it("should allow owner to edit own content", () => {
      expect(canEdit(contributorUser, contributorUser.id, "blog")).toBe(true);
    });

    it("should not allow contributor to edit others content", () => {
      expect(canEdit(contributorUser, adminUser.id, "blog")).toBe(false);
    });

    it("should allow editor to edit any content", () => {
      expect(canEdit(editorUser, contributorUser.id, "blog")).toBe(true);
    });

    it("should allow owner to delete own content", () => {
      expect(canDelete(contributorUser, contributorUser.id, "blog")).toBe(true);
    });

    it("should not allow contributor to delete others content", () => {
      expect(canDelete(contributorUser, adminUser.id, "blog")).toBe(false);
    });
  });

  describe("User Management Router", () => {
    const adminCaller = appRouter.createCaller({
      user: adminUser,
    } as any);

    it("should allow admin to list users", async () => {
      const users = await adminCaller.userManagement.listUsers();
      expect(Array.isArray(users)).toBe(true);
    });

    it("should throw error when non-admin tries to list users", async () => {
      const contributorCaller = appRouter.createCaller({
        user: contributorUser,
      } as any);

      await expect(contributorCaller.userManagement.listUsers()).rejects.toThrow();
    });
  });
});
