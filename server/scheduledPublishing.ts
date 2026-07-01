import { getDb } from "./db";
import { blogPosts } from "../drizzle/schema";
import { eq, and, lte } from "drizzle-orm";

/**
 * Check for scheduled posts that should be published now
 * and update their status to 'published'
 */
export async function publishScheduledPosts() {
  const now = new Date();
  
  const db = await getDb();
  if (!db) {
    console.warn("[Scheduled Publishing] Database not available");
    return { published: 0 };
  }

  try {
    // Find all posts with status 'scheduled' where scheduledPublishAt <= now
    const scheduledPosts = await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.status, "scheduled"),
          lte(blogPosts.scheduledPublishAt, now)
        )
      );

    if (scheduledPosts.length === 0) {
      console.log("[Scheduled Publishing] No posts to publish");
      return { published: 0 };
    }

    // Update each post to published status
    for (const post of scheduledPosts) {
      await db
        .update(blogPosts)
        .set({
          status: "published",
          publishedAt: now,
        })
        .where(eq(blogPosts.id, post.id));
      
      console.log(`[Scheduled Publishing] Published post: ${post.title} (ID: ${post.id})`);
    }

    return { published: scheduledPosts.length };
  } catch (error) {
    console.error("[Scheduled Publishing] Error:", error);
    throw error;
  }
}

// Run every minute to check for scheduled posts
setInterval(() => {
  publishScheduledPosts().catch(console.error);
}, 60 * 1000); // 60 seconds

// Run immediately on startup
publishScheduledPosts().catch(console.error);
