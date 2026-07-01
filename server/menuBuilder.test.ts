import { describe, it, expect } from "vitest";
import * as menuMgmt from "./menuManagement";

describe("Menu Builder", () => {
  let testMenuId: number;
  let testItemId: number;

  describe("Menu Management", () => {
    it("should create a menu", async () => {
      const result = await menuMgmt.createMenu({
        name: `Test Menu ${Date.now()}`,
        slug: `test-menu-${Date.now()}`,
        description: "Test menu description",
        location: "header",
      });

      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
      testMenuId = result.id;
    });

    it("should retrieve all menus", async () => {
      const menus = await menuMgmt.getAllMenus();
      
      expect(Array.isArray(menus)).toBe(true);
      expect(menus.length).toBeGreaterThan(0);
    });

    it("should retrieve menu by ID", async () => {
      if (!testMenuId) return;

      const menu = await menuMgmt.getMenuById(testMenuId);
      
      expect(menu).not.toBeNull();
      expect(menu?.id).toBe(testMenuId);
    });

    it("should retrieve menu by slug", async () => {
      if (!testMenuId) return;

      const menu = await menuMgmt.getMenuById(testMenuId);
      if (!menu) return;

      const menuBySlug = await menuMgmt.getMenuBySlug(menu.slug);
      
      expect(menuBySlug).not.toBeNull();
      expect(menuBySlug?.id).toBe(testMenuId);
    });

    it("should update menu", async () => {
      if (!testMenuId) return;

      const result = await menuMgmt.updateMenu(testMenuId, {
        description: "Updated description",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("Menu Item Management", () => {
    it("should create a menu item", async () => {
      if (!testMenuId) return;

      const result = await menuMgmt.createMenuItem({
        menuId: testMenuId,
        label: "Home",
        type: "custom",
        url: "/",
        menuOrder: 0,
        isVisible: 1,
        target: "_self",
      });

      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
      testItemId = result.id;
    });

    it("should retrieve menu items", async () => {
      if (!testMenuId) return;

      const items = await menuMgmt.getMenuItems(testMenuId);
      
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
    });

    it("should retrieve menu items hierarchically", async () => {
      if (!testMenuId) return;

      const items = await menuMgmt.getMenuItemsHierarchical(testMenuId);
      
      expect(Array.isArray(items)).toBe(true);
    });

    it("should create nested menu item", async () => {
      if (!testMenuId || !testItemId) return;

      const result = await menuMgmt.createMenuItem({
        menuId: testMenuId,
        parentId: testItemId,
        label: "Submenu Item",
        type: "custom",
        url: "/submenu",
        menuOrder: 0,
        isVisible: 1,
        target: "_self",
      });

      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });

    it("should update menu item", async () => {
      if (!testItemId) return;

      const result = await menuMgmt.updateMenuItem(testItemId, {
        label: "Updated Home",
      });

      expect(result.success).toBe(true);
    });

    it("should reorder menu items", async () => {
      if (!testMenuId || !testItemId) return;

      const items = await menuMgmt.getMenuItems(testMenuId);
      const reorderedItems = items.map((item, index) => ({
        id: item.id,
        menuOrder: items.length - index - 1, // Reverse order
        parentId: item.parentId,
      }));

      const result = await menuMgmt.reorderMenuItems(reorderedItems);
      
      expect(result.success).toBe(true);
    });

    it("should get menu with items", async () => {
      if (!testMenuId) return;

      const menuWithItems = await menuMgmt.getMenuWithItems(testMenuId);
      
      expect(menuWithItems).not.toBeNull();
      expect(menuWithItems).toHaveProperty("items");
      expect(Array.isArray(menuWithItems?.items)).toBe(true);
    });

    it("should delete menu item", async () => {
      if (!testItemId) return;

      const result = await menuMgmt.deleteMenuItem(testItemId);
      
      expect(result.success).toBe(true);
    });
  });

  describe("Menu Cleanup", () => {
    it("should delete menu", async () => {
      if (!testMenuId) return;

      const result = await menuMgmt.deleteMenu(testMenuId);
      
      expect(result.success).toBe(true);

      // Verify deletion
      const menu = await menuMgmt.getMenuById(testMenuId);
      expect(menu).toBeNull();
    });
  });
});
