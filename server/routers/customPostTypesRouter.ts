import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as cpt from "../customPostTypes";

export const customPostTypesRouter = router({
  // Custom Post Type Management (Admin only)
  createPostType: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      slug: z.string().min(1).max(100),
      singularName: z.string().min(1).max(100),
      pluralName: z.string().min(1).max(100),
      description: z.string().optional(),
      icon: z.string().optional(),
      isPublic: z.number().default(1),
      hasArchive: z.number().default(1),
      hierarchical: z.number().default(0),
      supportsTitle: z.number().default(1),
      supportsContent: z.number().default(1),
      supportsExcerpt: z.number().default(1),
      supportsFeaturedImage: z.number().default(1),
      supportsCategories: z.number().default(0),
      supportsTags: z.number().default(0),
      supportsComments: z.number().default(0),
      menuPosition: z.number().default(20),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can create custom post types");
      }
      return await cpt.createCustomPostType(input);
    }),

  getAllPostTypes: publicProcedure
    .query(async () => {
      return await cpt.getAllCustomPostTypes();
    }),

  getPostTypeById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await cpt.getCustomPostTypeById(input.id);
    }),

  getPostTypeBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return await cpt.getCustomPostTypeBySlug(input.slug);
    }),

  updatePostType: protectedProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        name: z.string().min(1).max(100).optional(),
        slug: z.string().min(1).max(100).optional(),
        singularName: z.string().min(1).max(100).optional(),
        pluralName: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
        isPublic: z.number().optional(),
        hasArchive: z.number().optional(),
        hierarchical: z.number().optional(),
        supportsTitle: z.number().optional(),
        supportsContent: z.number().optional(),
        supportsExcerpt: z.number().optional(),
        supportsFeaturedImage: z.number().optional(),
        supportsCategories: z.number().optional(),
        supportsTags: z.number().optional(),
        supportsComments: z.number().optional(),
        menuPosition: z.number().optional(),
      }),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can update custom post types");
      }
      return await cpt.updateCustomPostType(input.id, input.data);
    }),

  deletePostType: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can delete custom post types");
      }
      return await cpt.deleteCustomPostType(input.id);
    }),

  // Custom Post Item Management
  createItem: protectedProcedure
    .input(z.object({
      postTypeId: z.number(),
      title: z.string().min(1).max(255),
      slug: z.string().min(1).max(255),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      featuredImage: z.string().optional(),
      parentId: z.number().optional(),
      status: z.enum(["draft", "published", "scheduled", "archived"]).default("draft"),
      publishedAt: z.date().optional(),
      scheduledPublishAt: z.date().optional(),
      menuOrder: z.number().default(0),
    }))
    .mutation(async ({ input, ctx }) => {
      return await cpt.createCustomPostItem({
        ...input,
        authorId: ctx.user.id,
      });
    }),

  getItemsByType: publicProcedure
    .input(z.object({
      postTypeId: z.number(),
      status: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return await cpt.getCustomPostItemsByType(input.postTypeId, input.status);
    }),

  getItemById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await cpt.getCustomPostItemById(input.id);
    }),

  getItemBySlug: publicProcedure
    .input(z.object({
      postTypeSlug: z.string(),
      itemSlug: z.string(),
    }))
    .query(async ({ input }) => {
      return await cpt.getCustomPostItemBySlug(input.postTypeSlug, input.itemSlug);
    }),

  updateItem: protectedProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        title: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(255).optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        featuredImage: z.string().optional(),
        parentId: z.number().optional(),
        status: z.enum(["draft", "published", "scheduled", "archived"]).optional(),
        publishedAt: z.date().optional(),
        scheduledPublishAt: z.date().optional(),
        menuOrder: z.number().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      return await cpt.updateCustomPostItem(input.id, input.data);
    }),

  deleteItem: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await cpt.deleteCustomPostItem(input.id);
    }),

  searchItems: publicProcedure
    .input(z.object({
      postTypeId: z.number(),
      query: z.string(),
    }))
    .query(async ({ input }) => {
      return await cpt.searchCustomPostItems(input.postTypeId, input.query);
    }),

  bulkUpdateItemStatus: protectedProcedure
    .input(z.object({
      ids: z.array(z.number()),
      status: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can bulk update items");
      }
      return await cpt.bulkUpdateCustomPostItemStatus(input.ids, input.status);
    }),

  bulkDeleteItems: protectedProcedure
    .input(z.object({
      ids: z.array(z.number()),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can bulk delete items");
      }
      return await cpt.bulkDeleteCustomPostItems(input.ids);
    }),
});
