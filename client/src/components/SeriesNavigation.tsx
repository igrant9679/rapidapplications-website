import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface SeriesNavigationProps {
  postId: number;
}

export default function SeriesNavigation({ postId }: SeriesNavigationProps) {
  const { data: seriesInfo } = trpc.blogSeries.getPostSeries.useQuery({ postId });

  if (!seriesInfo) return null;

  const { data: navigation } = trpc.blogSeries.getNavigation.useQuery({
    seriesId: seriesInfo.id,
    currentOrderIndex: seriesInfo.orderIndex,
  });

  return (
    <Card className="mt-12">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <CardTitle>Part of a Series</CardTitle>
        </div>
        <CardDescription>
          This post is part of{" "}
          <Link href={`/series/${seriesInfo.slug}`}>
            <a className="text-primary hover:underline font-medium">
              {seriesInfo.title}
            </a>
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          {navigation?.prev ? (
            <Link href={`/blog/${navigation.prev.slug}`} className="flex-1">
              <Button variant="outline" className="w-full justify-start group">
                <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">Previous</div>
                  <div className="font-medium truncate">{navigation.prev.title}</div>
                </div>
              </Button>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          <Link href={`/series/${seriesInfo.slug}`}>
            <Button variant="secondary" className="whitespace-nowrap">
              <BookOpen className="h-4 w-4 mr-2" />
              View Series
            </Button>
          </Link>

          {navigation?.next ? (
            <Link href={`/blog/${navigation.next.slug}`} className="flex-1">
              <Button variant="outline" className="w-full justify-end group">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Next</div>
                  <div className="font-medium truncate">{navigation.next.title}</div>
                </div>
                <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
