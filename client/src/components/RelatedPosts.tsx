import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RelatedPostsProps {
  postId: number;
  limit?: number;
}

export default function RelatedPosts({ postId, limit = 3 }: RelatedPostsProps) {
  const { data: relatedPosts = [], isLoading } = trpc.blog.getRelated.useQuery({
    postId,
    limit,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Related Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Recently";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Related Posts</h2>
        <Link href="/blog">
          <span className="text-sm text-primary hover:underline cursor-pointer inline-flex items-center gap-1">
            View all posts
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post: any) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              {post.coverImage && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardContent className="p-4 space-y-3">
                <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  {post.readTimeMinutes && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTimeMinutes} min</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
