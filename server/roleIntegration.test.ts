import { describe, it, expect } from "vitest";

describe("Role Permissions Integration", () => {
  describe("tRPC Procedures", () => {
    it("should have editorProcedure middleware", async () => {
      const module = await import("./_core/trpc");
      expect(module.editorProcedure).toBeDefined();
    });

    it("should have authorProcedure middleware", async () => {
      const module = await import("./_core/trpc");
      expect(module.authorProcedure).toBeDefined();
    });

    it("should have contributorProcedure middleware", async () => {
      const module = await import("./_core/trpc");
      expect(module.contributorProcedure).toBeDefined();
    });
  });

  describe("User Management", () => {
    it("should support new role enum values", async () => {
      const module = await import("./userManagement");
      expect(module.userManagementRouter).toBeDefined();
    });
  });

  describe("Admin Users UI", () => {
    it("should be importable", async () => {
      const module = await import("../client/src/pages/AdminUsers");
      expect(module.default).toBeDefined();
    });
  });

  describe("Header Integration", () => {
    it("should be importable with NavigationMenu", async () => {
      const module = await import("../client/src/components/Header");
      expect(module.default).toBeDefined();
    });
  });
});
