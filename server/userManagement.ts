import { router, adminProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { requirePermission } from "./permissions";

export const userManagementRouter = router({
  /**
   * List all users (admin only)
   */
  listUsers: adminProcedure
    .query(async ({ ctx }) => {
      requirePermission(ctx.user, "users:manage");
      return db.getAllUsers();
    }),

  /**
   * Update user role (admin only)
   */
  updateUserRole: adminProcedure
    .input(z.object({
      userId: z.number(),
      role: z.enum(["admin", "editor", "author", "contributor", "subscriber"]),
    }))
    .mutation(async ({ input, ctx }) => {
      requirePermission(ctx.user, "users:manage");
      
      // Prevent users from changing their own role
      if (input.userId === ctx.user.id) {
        throw new Error("You cannot change your own role");
      }
      
      return db.updateUserRole(input.userId, input.role);
    }),

  /**
   * Get user by ID (admin only)
   */
  getUser: adminProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      requirePermission(ctx.user, "users:manage");
      return db.getUserById(input.userId);
    }),

  /**
   * Get current user's profile (authenticated users)
   */
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      return db.getUserById(ctx.user.id);
    }),

  /**
   * Update current user's profile (authenticated users)
   */
  updateProfile: protectedProcedure
    .input(z.object({
      avatar: z.string().optional(),
      bio: z.string().optional(),
      twitterUrl: z.string().optional(),
      linkedinUrl: z.string().optional(),
      githubUrl: z.string().optional(),
      websiteUrl: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return db.updateUserProfile(ctx.user.id, input);
    }),
});
