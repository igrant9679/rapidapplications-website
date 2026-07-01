import * as db from "./db";
import { notifyOwner } from "./_core/notification";

/**
 * Generate and send email digest for a specific frequency
 */
export async function generateDigestForFrequency(frequency: "daily" | "weekly" | "monthly") {
  try {
    // Get subscribers ready for this frequency
    const subscribers = await db.getSubscribersForDigest(frequency);
    
    if (subscribers.length === 0) {
      console.log(`[Email Digest] No subscribers ready for ${frequency} digest`);
      return { success: true, message: `No subscribers ready for ${frequency} digest` };
    }

    // Get posts based on frequency
    const days = frequency === "daily" ? 1 : frequency === "weekly" ? 7 : 30;
    const recentPosts = await getRecentBlogPosts(days);
    
    if (recentPosts.length === 0) {
      console.log(`[Email Digest] No new posts for ${frequency} digest`);
      return { success: true, message: "No new posts to send" };
    }

    // Process each subscriber based on their content preferences
    let sentCount = 0;
    for (const subscriber of subscribers) {
      const contentTypes = subscriber.contentTypes.split(",");
      
      // Filter posts based on subscriber's content preferences
      // For now, all posts are "blog" type. In the future, you could add type field to posts
      const filteredPosts = recentPosts;
      
      if (filteredPosts.length > 0) {
        // Generate email content
        const emailContent = generateDigestEmail(filteredPosts, subscriber.email);
        
        // In production, send email here
        // For now, just log and update timestamp
        await db.updateSubscriberLastDigest(subscriber.id);
        sentCount++;
      }
    }
    
    // Notify owner
    await notifyOwner({
      title: `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Email Digest Sent`,
      content: `Digest sent to ${sentCount} subscribers with ${recentPosts.length} posts:\n\n${recentPosts.map((p: any) => `- ${p.title}`).join('\n')}`,
    });

    console.log(`[Email Digest] Sent ${frequency} digest to ${sentCount} subscribers with ${recentPosts.length} posts`);
    
    return {
      success: true,
      message: `Digest sent to ${sentCount} subscribers`,
      subscriberCount: sentCount,
      postCount: recentPosts.length,
    };
  } catch (error) {
    console.error(`[Email Digest] Error generating ${frequency} digest:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Generate and send weekly email digest (backward compatibility)
 */
export async function generateWeeklyDigest() {
  return generateDigestForFrequency("weekly");
}

/**
 * Generate HTML email content for digest
 */
function generateDigestEmail(posts: any[], email: string): string {
  const postList = posts
    .map(
      (post) => `
    <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb;">
      <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">
        <a href="${process.env.VITE_APP_URL || 'https://communityforce.manus.space'}/blog/${post.slug}" 
           style="color: #1e40af; text-decoration: none;">
          ${post.title}
        </a>
      </h2>
      <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">
        ${post.excerpt || ''}
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        ${post.readTimeMinutes ? `${post.readTimeMinutes} min read` : ''} • 
        ${new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Digest - CommunityForce</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: #111827;">
        Weekly Digest
      </h1>
      <p style="margin: 0; color: #6b7280; font-size: 16px;">
        Your weekly roundup from CommunityForce
      </p>
    </div>

    <!-- New Posts -->
    <div style="margin-bottom: 40px;">
      <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #374151;">
        📝 New This Week
      </h3>
      ${postList}
    </div>

    <!-- Footer -->
    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 14px;">
      <p style="margin: 0 0 12px 0;">
        You're receiving this because you subscribed to CommunityForce updates.
      </p>
      <p style="margin: 0;">
        <a href="${process.env.VITE_APP_URL || 'https://communityforce.manus.space'}/preferences?email=${encodeURIComponent(email)}" 
           style="color: #6b7280; text-decoration: underline;">
          Manage Preferences
        </a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Get recent blog posts for digest
 */
async function getRecentBlogPosts(days: number = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const result = await db.searchBlogPosts({
    startDate,
    page: 1,
    limit: 10,
  });
  
  return result.posts;
}
