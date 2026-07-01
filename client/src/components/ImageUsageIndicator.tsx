import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileText, Loader2, ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface ImageUsageIndicatorProps {
  imageUrl: string;
}

export default function ImageUsageIndicator({ imageUrl }: ImageUsageIndicatorProps) {
  const { data: usage, isLoading } = trpc.media.getUsage.useQuery(
    { url: imageUrl },
    { enabled: !!imageUrl }
  );

  const totalUsage = (usage?.blogPosts.length || 0) + (usage?.cmsPages.length || 0);

  if (isLoading) {
    return (
      <Badge variant="outline" className="text-xs">
        <Loader2 className="h-3 w-3 animate-spin" />
      </Badge>
    );
  }

  if (totalUsage === 0) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge
          variant="secondary"
          className="text-xs cursor-pointer hover:opacity-80 transition-opacity"
        >
          <FileText className="h-3 w-3 mr-1" />
          Used in {totalUsage} {totalUsage === 1 ? "place" : "places"}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Image Usage</h4>
          
          {usage?.blogPosts && usage.blogPosts.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Blog Posts:</p>
              <div className="space-y-1">
                {usage.blogPosts.map((post) => (
                  <Link key={post.id} href={`/admin/blog/edit/${post.id}`}>
                    <a className="flex items-center gap-2 text-xs hover:underline text-primary">
                      <ExternalLink className="h-3 w-3" />
                      {post.title}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {usage?.cmsPages && usage.cmsPages.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">CMS Pages:</p>
              <div className="space-y-1">
                {usage.cmsPages.map((page) => (
                  <Link key={page.id} href={`/admin/cms/edit/${page.id}`}>
                    <a className="flex items-center gap-2 text-xs hover:underline text-primary">
                      <ExternalLink className="h-3 w-3" />
                      {page.title}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
