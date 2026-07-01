import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const authorRouter = router({
  // Get author profile by ID
  getProfile: publicProcedure
    .input(z.object({ authorId: z.number() }))
    .query(async ({ input }) => {
      const author = await db.getUserById(input.authorId);
      if (!author) {
        throw new Error("Author not found");
      }
      return author;
    }),

  // Get posts by author
  getPosts: publicProcedure
    .input(z.object({ authorId: z.number() }))
    .query(async ({ input }) => {
      return await db.getPostsByAuthor(input.authorId);
    }),

  // Get author statistics
  getStats: publicProcedure
    .input(z.object({ authorId: z.number() }))
    .query(async ({ input }) => {
      return await db.getAuthorStats(input.authorId);
    }),
});
