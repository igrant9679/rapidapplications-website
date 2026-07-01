import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Eye, MessageCircle, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  const { data: allPosts = [], isLoading: loadingPosts } = trpc.blog.listAll.useQuery();
  const { data: allComments = [], isLoading: loadingComments } = trpc.comment.listAll.useQuery();

  // Calculate analytics metrics
  const analytics = useMemo(() => {
    const now = new Date();
    const daysAgo = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : dateRange === "90d" ? 90 : 365;
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Filter posts by date range
    const recentPosts = allPosts.filter(post => {
      if (dateRange === "all") return true;
      return new Date(post.createdAt) > cutoffDate;
    });

    // Filter comments by date range
    const recentComments = allComments.filter(comment => {
      if (dateRange === "all") return true;
      return new Date(comment.createdAt) > cutoffDate;
    });

    // Calculate metrics
    const totalPosts = recentPosts.length;
    const publishedPosts = recentPosts.filter(p => p.status === "published").length;
    const draftPosts = recentPosts.filter(p => p.status === "draft").length;
    const totalComments = recentComments.length;
    const approvedComments = recentComments.filter(c => c.status === "approved").length;
    const pendingComments = recentComments.filter(c => c.status === "pending").length;

    // Most commented posts
    const commentCounts = new Map<number, number>();
    allComments.forEach(comment => {
      const count = commentCounts.get(comment.postId) || 0;
      commentCounts.set(comment.postId, count + 1);
    });

    const postsWithComments = allPosts
      .map(post => ({
        ...post,
        commentCount: commentCounts.get(post.id) || 0,
      }))
      .filter(p => p.status === "published")
      .sort((a, b) => b.commentCount - a.commentCount)
      .slice(0, 10);

    // Recent activity (posts and comments)
    const recentActivity = [
      ...recentPosts.map(p => ({
        type: "post" as const,
        title: p.title,
        slug: p.slug,
        date: new Date(p.createdAt),
        status: p.status,
      })),
      ...recentComments.map(c => ({
        type: "comment" as const,
        title: `Comment on "${c.postTitle}"`,
        slug: c.postSlug,
        date: new Date(c.createdAt),
        status: c.status,
      })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 15);

    // Most recent posts
    const recentPublishedPosts = allPosts
      .filter(p => p.status === "published")
      .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalComments,
      approvedComments,
      pendingComments,
      postsWithComments,
      recentActivity,
      recentPublishedPosts,
    };
  }, [allPosts, allComments, dateRange]);

  const isLoading = loadingPosts || loadingComments;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Blog performance and engagement metrics
            </p>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex gap-2">
          {(["7d", "30d", "90d", "all"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                dateRange === range
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {range === "all" ? "All Time" : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading analytics...
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Posts</p>
                    <p className="text-3xl font-bold">{analytics.totalPosts}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {analytics.publishedPosts} published, {analytics.draftPosts} draft
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Published</p>
                    <p className="text-3xl font-bold text-green-500">
                      {analytics.publishedPosts}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {analytics.totalPosts > 0
                        ? Math.round((analytics.publishedPosts / analytics.totalPosts) * 100)
                        : 0}
                      % of total
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Comments</p>
                    <p className="text-3xl font-bold">{analytics.totalComments}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {analytics.approvedComments} approved
                    </p>
                  </div>
                  <MessageCircle className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-3xl font-bold text-yellow-500">
                      {analytics.pendingComments}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Comments awaiting moderation
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-yellow-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most Commented Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Most Commented Posts</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.postsWithComments.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No posts with comments yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {analytics.postsWithComments.map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`}>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{post.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="font-bold">{post.commentCount}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Published Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Published Posts</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.recentPublishedPosts.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No published posts yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {analytics.recentPublishedPosts.map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`}>
                        <div className="p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          <p className="font-medium">{post.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.recentActivity.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No recent activity
                </p>
              ) : (
                <div className="space-y-2">
                  {analytics.recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {activity.type === "post" ? (
                          <Eye className="h-4 w-4 text-primary flex-shrink-0" />
                        ) : (
                          <MessageCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        )}
                        <Link href={`/blog/${activity.slug}`}>
                          <span className="font-medium truncate hover:underline cursor-pointer">
                            {activity.title}
                          </span>
                        </Link>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            activity.status === "published" || activity.status === "approved"
                              ? "bg-green-500/10 text-green-500"
                              : activity.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {activity.status}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {activity.date.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
