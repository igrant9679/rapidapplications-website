import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as menuMgmt from "../menuManagement";

export const menuRouter = router({
  // Menu Management (Admin only)
  createMenu: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      slug: z.string().min(1).max(100),
      description: z.string().optional(),
      location: z.string().max(50).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can create menus");
      }
      return await menuMgmt.createMenu(input);
    }),

  getAllMenus: publicProcedure
    .query(async () => {
      return await menuMgmt.getAllMenus();
    }),

  getMenuById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await menuMgmt.getMenuById(input.id);
    }),

  getMenuBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return await menuMgmt.getMenuBySlug(input.slug);
    }),

  getMenuByLocation: publicProcedure
    .input(z.object({ location: z.string() }))
    .query(async ({ input }) => {
      return await menuMgmt.getMenuByLocation(input.location);
    }),

  updateMenu: protectedProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        name: z.string().min(1).max(100).optional(),
        slug: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
        location: z.string().max(50).optional(),
      }),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can update menus");
      }
      return await menuMgmt.updateMenu(input.id, input.data);
    }),

  deleteMenu: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can delete menus");
      }
      return await menuMgmt.deleteMenu(input.id);
    }),

  // Menu Item Management
  createMenuItem: protectedProcedure
    .input(z.object({
      menuId: z.number(),
      parentId: z.number().optional().nullable(),
      label: z.string().min(1).max(100),
      type: z.enum(["custom", "page", "post", "category", "tag", "post-type"]),
      url: z.string().max(500).optional(),
      targetId: z.number().optional(),
      targetType: z.string().max(50).optional(),
      cssClasses: z.string().max(255).optional(),
      target: z.string().max(20).default("_self"),
      menuOrder: z.number().default(0),
      isVisible: z.number().default(1),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can create menu items");
      }
      return await menuMgmt.createMenuItem(input);
    }),

  getMenuItems: publicProcedure
    .input(z.object({ menuId: z.number() }))
    .query(async ({ input }) => {
      return await menuMgmt.getMenuItems(input.menuId);
    }),

  getMenuItemsHierarchical: publicProcedure
    .input(z.object({ menuId: z.number() }))
    .query(async ({ input }) => {
      return await menuMgmt.getMenuItemsHierarchical(input.menuId);
    }),

  getMenuItemById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await menuMgmt.getMenuItemById(input.id);
    }),

  updateMenuItem: protectedProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        parentId: z.number().optional().nullable(),
        label: z.string().min(1).max(100).optional(),
        type: z.enum(["custom", "page", "post", "category", "tag", "post-type"]).optional(),
        url: z.string().max(500).optional(),
        targetId: z.number().optional(),
        targetType: z.string().max(50).optional(),
        cssClasses: z.string().max(255).optional(),
        target: z.string().max(20).optional(),
        menuOrder: z.number().optional(),
        isVisible: z.number().optional(),
      }),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can update menu items");
      }
      return await menuMgmt.updateMenuItem(input.id, input.data);
    }),

  deleteMenuItem: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can delete menu items");
      }
      return await menuMgmt.deleteMenuItem(input.id);
    }),

  reorderMenuItems: protectedProcedure
    .input(z.object({
      items: z.array(z.object({
        id: z.number(),
        menuOrder: z.number(),
        parentId: z.number().optional().nullable(),
      })),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can reorder menu items");
      }
      return await menuMgmt.reorderMenuItems(input.items);
    }),

  bulkDeleteMenuItems: protectedProcedure
    .input(z.object({
      ids: z.array(z.number()),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can bulk delete menu items");
      }
      return await menuMgmt.bulkDeleteMenuItems(input.ids);
    }),

  // Helper procedures for getting menu with items
  getMenuWithItems: publicProcedure
    .input(z.object({ menuId: z.number() }))
    .query(async ({ input }) => {
      return await menuMgmt.getMenuWithItems(input.menuId);
    }),

  getMenuWithItemsBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return await menuMgmt.getMenuWithItemsBySlug(input.slug);
    }),

  getMenuWithItemsByLocation: publicProcedure
    .input(z.object({ location: z.string() }))
    .query(async ({ input }) => {
      return await menuMgmt.getMenuWithItemsByLocation(input.location);
    }),
});
