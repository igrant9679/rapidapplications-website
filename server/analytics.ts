import { Request } from "express";
import * as db from "./db";
import { nanoid } from "nanoid";

/**
 * Track a page view
 */
export async function trackPageView(
  pageId: number,
  pageType: "blog" | "cms",
  req: Request
) {
  try {
    // Get or create visitor ID from cookie
    const visitorId = req.cookies?.visitor_id || nanoid();
    
    // Get or create session ID
    const sessionId = req.cookies?.session_id || nanoid();
    
    // Extract metadata
    const ipAddress = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || 
                     req.socket.remoteAddress || 
                     null;
    const userAgent = req.headers["user-agent"] || null;
    const referrer = req.headers["referer"] || null;
    
    // Record the view
    await db.createPageView({
      pageId,
      pageType,
      visitorId,
      sessionId,
      ipAddress,
      userAgent,
      referrer,
    });
    
    return { visitorId, sessionId };
  } catch (error) {
    console.error("Error tracking page view:", error);
    return null;
  }
}

/**
 * Get analytics for a specific page
 */
export async function getPageAnalytics(pageId: number, pageType: "blog" | "cms") {
  const views = await db.getPageViews(pageId, pageType);
  
  // Calculate metrics
  const totalViews = views.length;
  const uniqueVisitors = new Set(views.map((v: any) => v.visitorId)).size;
  
  // Calculate views over time (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentViews = views.filter((v: any) => new Date(v.viewedAt) >= thirtyDaysAgo);
  
  // Group by date
  const viewsByDate = recentViews.reduce((acc: Record<string, number>, view: any) => {
    const date = new Date(view.viewedAt).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalViews,
    uniqueVisitors,
    recentViews: recentViews.length,
    viewsByDate,
  };
}

import { eq, desc, and, sql, gte } from "drizzle-orm";
import { blogPosts, pageViews, blogComments, users } from "../drizzle/schema";

/**
 * Get top performing posts by view count
 */
export async function getTopPostsByViews(limit: number = 10, days?: number) {
  const dbInstance = await db.getDb();
  if (!dbInstance) return [];

  let whereCondition = eq(pageViews.pageType, "blog");
  
  if (days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    whereCondition = and(
      eq(pageViews.pageType, "blog"),
      gte(pageViews.viewedAt, cutoffDate)
    ) as any;
  }

  return dbInstance
    .select({
      postId: pageViews.pageId,
      title: blogPosts.title,
      slug: blogPosts.slug,
      viewCount: sql<number>`count(*)`.as("viewCount"),
    })
    .from(pageViews)
    .innerJoin(blogPosts, eq(pageViews.pageId, blogPosts.id))
    .where(whereCondition)
    .groupBy(pageViews.pageId, blogPosts.title, blogPosts.slug)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}

/**
 * Get engagement metrics for posts
 */
export async function getPostEngagementMetrics(postId?: number) {
  const dbInstance = await db.getDb();
  if (!dbInstance) return [];

  let whereCondition = eq(blogPosts.status, "published");
  
  if (postId) {
    whereCondition = and(
      eq(blogPosts.status, "published"),
      eq(blogPosts.id, postId)
    ) as any;
  }

  const query = dbInstance
    .select({
      postId: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      viewCount: sql<number>`(SELECT COUNT(*) FROM page_views WHERE pageId = ${blogPosts.id} AND pageType = 'blog')`.as("viewCount"),
      commentCount: sql<number>`(SELECT COUNT(*) FROM blog_comments WHERE postId = ${blogPosts.id})`.as("commentCount"),
      readTimeMinutes: blogPosts.readTimeMinutes,
      publishedAt: blogPosts.publishedAt,
    })
    .from(blogPosts)
    .where(whereCondition);

  if (postId) {
    return query;
  }

  return query.orderBy(desc(blogPosts.publishedAt)).limit(50);
}

/**
 * Get author performance statistics
 */
export async function getAuthorPerformanceStats() {
  const dbInstance = await db.getDb();
  if (!dbInstance) return [];

  return dbInstance
    .select({
      authorId: blogPosts.authorId,
      authorName: users.name,
      authorEmail: users.email,
      postCount: sql<number>`COUNT(DISTINCT ${blogPosts.id})`.as("postCount"),
      totalViews: sql<number>`COUNT(${pageViews.id})`.as("totalViews"),
      totalComments: sql<number>`(SELECT COUNT(*) FROM blog_comments WHERE postId IN (SELECT id FROM blog_posts WHERE authorId = ${blogPosts.authorId}))`.as("totalComments"),
      avgReadTime: sql<number>`AVG(${blogPosts.readTimeMinutes})`.as("avgReadTime"),
    })
    .from(blogPosts)
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .leftJoin(
      pageViews,
      and(
        eq(pageViews.pageId, blogPosts.id),
        eq(pageViews.pageType, "blog")
      )
    )
    .where(eq(blogPosts.status, "published"))
    .groupBy(blogPosts.authorId, users.name, users.email)
    .orderBy(desc(sql`COUNT(DISTINCT ${blogPosts.id})`));
}

/**
 * Get traffic source breakdown
 */
export async function getTrafficSources(days: number = 30) {
  const dbInstance = await db.getDb();
  if (!dbInstance) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return dbInstance
    .select({
      source: sql<string>`CASE 
        WHEN ${pageViews.referrer} IS NULL OR ${pageViews.referrer} = '' THEN 'Direct'
        WHEN ${pageViews.referrer} LIKE '%google%' THEN 'Google'
        WHEN ${pageViews.referrer} LIKE '%facebook%' THEN 'Facebook'
        WHEN ${pageViews.referrer} LIKE '%twitter%' OR ${pageViews.referrer} LIKE '%t.co%' THEN 'Twitter'
        WHEN ${pageViews.referrer} LIKE '%linkedin%' THEN 'LinkedIn'
        WHEN ${pageViews.referrer} LIKE '%reddit%' THEN 'Reddit'
        ELSE 'Other'
      END`.as("source"),
      viewCount: sql<number>`COUNT(*)`.as("viewCount"),
      uniqueVisitors: sql<number>`COUNT(DISTINCT ${pageViews.visitorId})`.as("uniqueVisitors"),
    })
    .from(pageViews)
    .where(
      and(
        eq(pageViews.pageType, "blog"),
        gte(pageViews.viewedAt, cutoffDate)
      )
    )
    .groupBy(sql`source`)
    .orderBy(desc(sql`COUNT(*)`));
}

/**
 * Get time-based view trends
 */
export async function getViewTrends(days: number = 30) {
  const dbInstance = await db.getDb();
  if (!dbInstance) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return dbInstance
    .select({
      date: sql<string>`DATE(${pageViews.viewedAt})`.as("date"),
      viewCount: sql<number>`COUNT(*)`.as("viewCount"),
      uniqueVisitors: sql<number>`COUNT(DISTINCT ${pageViews.visitorId})`.as("uniqueVisitors"),
    })
    .from(pageViews)
    .where(
      and(
        eq(pageViews.pageType, "blog"),
        gte(pageViews.viewedAt, cutoffDate)
      )
    )
    .groupBy(sql`date`)
    .orderBy(desc(sql`date`));
}

/**
 * Get overall content statistics
 */
export async function getOverallContentStats() {
  const dbInstance = await db.getDb();
  if (!dbInstance) return null;

  const [stats] = await dbInstance
    .select({
      totalPosts: sql<number>`COUNT(DISTINCT ${blogPosts.id})`.as("totalPosts"),
      totalViews: sql<number>`(SELECT COUNT(*) FROM page_views WHERE pageType = 'blog')`.as("totalViews"),
      totalComments: sql<number>`(SELECT COUNT(*) FROM blog_comments)`.as("totalComments"),
      avgReadTime: sql<number>`AVG(${blogPosts.readTimeMinutes})`.as("avgReadTime"),
    })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"));

  return stats;
}

/**
 * Get recent popular posts (last 7 days)
 */
export async function getRecentPopularPosts(limit: number = 5) {
  const dbInstance = await db.getDb();
  if (!dbInstance) return [];

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return dbInstance
    .select({
      postId: pageViews.pageId,
      title: blogPosts.title,
      slug: blogPosts.slug,
      viewCount: sql<number>`COUNT(*)`.as("viewCount"),
      publishedAt: blogPosts.publishedAt,
    })
    .from(pageViews)
    .innerJoin(blogPosts, eq(pageViews.pageId, blogPosts.id))
    .where(
      and(
        eq(pageViews.pageType, "blog"),
        gte(pageViews.viewedAt, sevenDaysAgo)
      )
    )
    .groupBy(pageViews.pageId, blogPosts.title, blogPosts.slug, blogPosts.publishedAt)
    .orderBy(desc(sql`COUNT(*)`))
    .limit(limit);
}
