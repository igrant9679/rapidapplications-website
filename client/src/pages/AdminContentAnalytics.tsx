import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, TrendingUp, Eye, MessageSquare, Clock, Users, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function AdminContentAnalytics() {
  const [timeRange, setTimeRange] = useState<number>(30);
  const [topPostsLimit, setTopPostsLimit] = useState<number>(10);

  // Fetch all analytics data
  const { data: overallStats, isLoading: loadingOverall } = trpc.analytics.getOverallStats.useQuery();
  const { data: topPosts, isLoading: loadingTopPosts } = trpc.analytics.getTopPosts.useQuery({ 
    limit: topPostsLimit, 
    days: timeRange 
  });
  const { data: engagementMetrics, isLoading: loadingEngagement } = trpc.analytics.getEngagementMetrics.useQuery({});
  const { data: authorStats, isLoading: loadingAuthors } = trpc.analytics.getAuthorStats.useQuery();
  const { data: trafficSources, isLoading: loadingTraffic } = trpc.analytics.getTrafficSources.useQuery({ days: timeRange });
  const { data: viewTrends, isLoading: loadingTrends } = trpc.analytics.getViewTrends.useQuery({ days: timeRange });
  const { data: recentPopular, isLoading: loadingRecent } = trpc.analytics.getRecentPopular.useQuery({ limit: 5 });

  const isLoading = loadingOverall || loadingTopPosts || loadingEngagement || loadingAuthors || loadingTraffic || loadingTrends || loadingRecent;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Content Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive insights into your content performance
            </p>
          </div>
          <Select value={timeRange.toString()} onValueChange={(v) => setTimeRange(Number(v))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overall Stats Cards */}
        {loadingOverall ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats?.totalPosts || 0}</div>
                <p className="text-xs text-muted-foreground">Published content</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats?.totalViews?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">All-time page views</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats?.totalComments || 0}</div>
                <p className="text-xs text-muted-foreground">Reader engagement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Read Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overallStats?.avgReadTime ? Math.round(overallStats.avgReadTime) : 0} min
                </div>
                <p className="text-xs text-muted-foreground">Per article</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs for different analytics views */}
        <Tabs defaultValue="top-posts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="top-posts">Top Posts</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="authors">Authors</TabsTrigger>
            <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* Top Posts Tab */}
          <TabsContent value="top-posts" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Performing Posts</CardTitle>
                    <CardDescription>Posts with the most views in the selected period</CardDescription>
                  </div>
                  <Select value={topPostsLimit.toString()} onValueChange={(v) => setTopPostsLimit(Number(v))}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Top 5</SelectItem>
                      <SelectItem value="10">Top 10</SelectItem>
                      <SelectItem value="20">Top 20</SelectItem>
                      <SelectItem value="50">Top 50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {loadingTopPosts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : topPosts && topPosts.length > 0 ? (
                  <div className="space-y-4">
                    {topPosts.map((post: any, index: number) => (
                      <div key={post.postId} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/blog/${post.slug}`}>
                              <a className="font-medium hover:underline truncate block">{post.title}</a>
                            </Link>
                            <p className="text-sm text-muted-foreground">/{post.slug}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{post.viewCount.toLocaleString()}</span>
                          <Link href={`/blog/${post.slug}`}>
                            <a target="_blank" className="ml-2">
                              <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </a>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No data available for the selected period</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Popular Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Trending This Week</CardTitle>
                <CardDescription>Most viewed posts in the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingRecent ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : recentPopular && recentPopular.length > 0 ? (
                  <div className="space-y-3">
                    {recentPopular.map((post: any) => (
                      <div key={post.postId} className="flex items-center justify-between">
                        <Link href={`/blog/${post.slug}`}>
                          <a className="font-medium hover:underline flex-1">{post.title}</a>
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span>{post.viewCount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No trending posts this week</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Post Engagement Metrics</CardTitle>
                <CardDescription>Views, comments, and read time for all published posts</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingEngagement ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : engagementMetrics && engagementMetrics.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 pb-2 border-b font-medium text-sm">
                      <div>Post</div>
                      <div className="text-center">Views</div>
                      <div className="text-center">Comments</div>
                      <div className="text-center">Read Time</div>
                    </div>
                    {engagementMetrics.slice(0, 20).map((post: any) => (
                      <div key={post.postId} className="grid grid-cols-4 gap-4 items-center text-sm">
                        <Link href={`/blog/${post.slug}`}>
                          <a className="font-medium hover:underline truncate">{post.title}</a>
                        </Link>
                        <div className="text-center">{post.viewCount}</div>
                        <div className="text-center">{post.commentCount}</div>
                        <div className="text-center">{post.readTimeMinutes || 0} min</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No engagement data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Authors Tab */}
          <TabsContent value="authors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Author Performance</CardTitle>
                <CardDescription>Content output and engagement by author</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAuthors ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : authorStats && authorStats.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-4 pb-2 border-b font-medium text-sm">
                      <div>Author</div>
                      <div className="text-center">Posts</div>
                      <div className="text-center">Total Views</div>
                      <div className="text-center">Comments</div>
                      <div className="text-center">Avg Read Time</div>
                    </div>
                    {authorStats.map((author: any) => (
                      <div key={author.authorId} className="grid grid-cols-5 gap-4 items-center text-sm">
                        <div>
                          <div className="font-medium">{author.authorName || "Unknown"}</div>
                          <div className="text-xs text-muted-foreground">{author.authorEmail}</div>
                        </div>
                        <div className="text-center font-medium">{author.postCount}</div>
                        <div className="text-center">{author.totalViews?.toLocaleString() || 0}</div>
                        <div className="text-center">{author.totalComments || 0}</div>
                        <div className="text-center">{author.avgReadTime ? Math.round(author.avgReadTime) : 0} min</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No author data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Traffic Sources Tab */}
          <TabsContent value="traffic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your readers are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTraffic ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : trafficSources && trafficSources.length > 0 ? (
                  <div className="space-y-4">
                    {trafficSources.map((source: any) => {
                      const totalViews = trafficSources.reduce((sum: number, s: any) => sum + Number(s.viewCount), 0);
                      const percentage = ((Number(source.viewCount) / totalViews) * 100).toFixed(1);
                      
                      return (
                        <div key={source.source} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{source.source}</span>
                            <span className="text-muted-foreground">
                              {source.viewCount.toLocaleString()} views ({percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {source.uniqueVisitors.toLocaleString()} unique visitors
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No traffic data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>View Trends Over Time</CardTitle>
                <CardDescription>Daily views and unique visitors</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTrends ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : viewTrends && viewTrends.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 pb-2 border-b font-medium text-sm">
                      <div>Date</div>
                      <div className="text-center">Total Views</div>
                      <div className="text-center">Unique Visitors</div>
                    </div>
                    {viewTrends.slice().reverse().map((trend: any) => (
                      <div key={trend.date} className="grid grid-cols-3 gap-4 items-center text-sm">
                        <div>{new Date(trend.date).toLocaleDateString()}</div>
                        <div className="text-center font-medium">{trend.viewCount}</div>
                        <div className="text-center">{trend.uniqueVisitors}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No trend data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
