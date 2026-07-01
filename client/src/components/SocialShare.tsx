import { Button } from "@/components/ui/button";
import { Share2, Twitter, Linkedin, Facebook, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  variant?: "default" | "compact";
}

export default function SocialShare({ 
  url, 
  title, 
  description,
  variant = "default" 
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const trackShare = (platform: string) => {
    // Track share event (could be sent to analytics)
    console.log(`[Social Share] ${platform}:`, { url, title });
    
    // You can add analytics tracking here
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "share", {
        method: platform,
        content_type: "blog_post",
        item_id: url,
      });
    }
  };

  const shareOnTwitter = () => {
    trackShare("twitter");
    const text = `${title}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "width=550,height=420");
  };

  const shareOnLinkedIn = () => {
    trackShare("linkedin");
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, "_blank", "width=550,height=420");
  };

  const shareOnFacebook = () => {
    trackShare("facebook");
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, "_blank", "width=550,height=420");
  };

  const copyLink = async () => {
    trackShare("copy_link");
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={shareOnTwitter}
          className="hover:text-[#1DA1F2]"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={shareOnLinkedIn}
          className="hover:text-[#0A66C2]"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={shareOnFacebook}
          className="hover:text-[#1877F2]"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyLink}
          className={copied ? "text-green-600" : ""}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Share2 className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">Share this post</h3>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={shareOnTwitter}
          className="flex items-center gap-2 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]"
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>

        <Button
          variant="outline"
          onClick={shareOnLinkedIn}
          className="flex items-center gap-2 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Button>

        <Button
          variant="outline"
          onClick={shareOnFacebook}
          className="flex items-center gap-2 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>

        <Button
          variant="outline"
          onClick={copyLink}
          className={`flex items-center gap-2 ${
            copied
              ? "bg-green-50 text-green-600 border-green-600"
              : ""
          }`}
        >
          <LinkIcon className="h-4 w-4" />
          {copied ? "Copied!" : "Copy Link"}
        </Button>
      </div>

      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
