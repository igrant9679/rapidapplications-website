import { describe, it, expect } from "vitest";
import { getRolePermissions, hasPermission, canEditPost, canDeletePost, getAllRoles } from "./rolePermissions";

describe("WordPress-Level Features - Part 2", () => {
  describe("User Roles & Permissions", () => {
    it("should have correct permissions for admin role", () => {
      const permissions = getRolePermissions("admin");
      expect(permissions.canPublishPosts).toBe(true);
      expect(permissions.canEditOthersPosts).toBe(true);
      expect(permissions.canDeleteOthersPosts).toBe(true);
      expect(permissions.canEditUsers).toBe(true);
      expect(permissions.canManageSettings).toBe(true);
    });

    it("should have correct permissions for editor role", () => {
      const permissions = getRolePermissions("editor");
      expect(permissions.canPublishPosts).toBe(true);
      expect(permissions.canEditOthersPosts).toBe(true);
      expect(permissions.canDeleteOthersPosts).toBe(true);
      expect(permissions.canEditUsers).toBe(false);
      expect(permissions.canManageSettings).toBe(false);
    });

    it("should have correct permissions for author role", () => {
      const permissions = getRolePermissions("author");
      expect(permissions.canPublishPosts).toBe(true);
      expect(permissions.canEditOwnPosts).toBe(true);
      expect(permissions.canEditOthersPosts).toBe(false);
      expect(permissions.canDeleteOwnPosts).toBe(true);
      expect(permissions.canDeleteOthersPosts).toBe(false);
    });

    it("should have correct permissions for contributor role", () => {
      const permissions = getRolePermissions("contributor");
      expect(permissions.canPublishPosts).toBe(false);
      expect(permissions.canEditOwnPosts).toBe(true);
      expect(permissions.canEditOthersPosts).toBe(false);
      expect(permissions.canUploadMedia).toBe(false);
    });

    it("should have correct permissions for subscriber role", () => {
      const permissions = getRolePermissions("subscriber");
      expect(permissions.canPublishPosts).toBe(false);
      expect(permissions.canEditOwnPosts).toBe(false);
      expect(permissions.canEditOthersPosts).toBe(false);
      expect(permissions.canUploadMedia).toBe(false);
    });

    it("should check specific permissions correctly", () => {
      expect(hasPermission("admin", "canPublishPosts")).toBe(true);
      expect(hasPermission("contributor", "canPublishPosts")).toBe(false);
      expect(hasPermission("author", "canEditOwnPosts")).toBe(true);
      expect(hasPermission("subscriber", "canUploadMedia")).toBe(false);
    });

    it("should correctly determine if user can edit post", () => {
      // Admin can edit anyone's posts
      expect(canEditPost("admin", 1, 2)).toBe(true);
      
      // Editor can edit anyone's posts
      expect(canEditPost("editor", 1, 2)).toBe(true);
      
      // Author can edit own posts
      expect(canEditPost("author", 1, 1)).toBe(true);
      expect(canEditPost("author", 1, 2)).toBe(false);
      
      // Contributor can edit own posts
      expect(canEditPost("contributor", 1, 1)).toBe(true);
      expect(canEditPost("contributor", 1, 2)).toBe(false);
      
      // Subscriber cannot edit posts
      expect(canEditPost("subscriber", 1, 1)).toBe(false);
    });

    it("should correctly determine if user can delete post", () => {
      // Admin can delete anyone's posts
      expect(canDeletePost("admin", 1, 2)).toBe(true);
      
      // Editor can delete anyone's posts
      expect(canDeletePost("editor", 1, 2)).toBe(true);
      
      // Author can delete own posts
      expect(canDeletePost("author", 1, 1)).toBe(true);
      expect(canDeletePost("author", 1, 2)).toBe(false);
      
      // Contributor can delete own posts
      expect(canDeletePost("contributor", 1, 1)).toBe(true);
      expect(canDeletePost("contributor", 1, 2)).toBe(false);
    });

    it("should return all available roles", () => {
      const roles = getAllRoles();
      expect(roles).toHaveLength(5);
      expect(roles[0].value).toBe("admin");
      expect(roles[1].value).toBe("editor");
      expect(roles[2].value).toBe("author");
      expect(roles[3].value).toBe("contributor");
      expect(roles[4].value).toBe("subscriber");
    });
  });

  describe("NavigationMenu Component", () => {
    it("should be importable", async () => {
      const module = await import("../client/src/components/NavigationMenu");
      expect(module.default).toBeDefined();
    });
  });

  describe("Custom Post Types UI", () => {
    it("should be importable", async () => {
      const module = await import("../client/src/pages/AdminPostTypes");
      expect(module.default).toBeDefined();
    });
  });
});
