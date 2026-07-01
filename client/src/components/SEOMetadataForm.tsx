import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

interface SEOMetadataFormProps {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onOgTitleChange: (value: string) => void;
  onOgDescriptionChange: (value: string) => void;
  onOgImageChange: (value: string) => void;
}

export default function SEOMetadataForm({
  metaTitle,
  metaDescription,
  ogTitle,
  ogDescription,
  ogImage,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onOgTitleChange,
  onOgDescriptionChange,
  onOgImageChange,
}: SEOMetadataFormProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">Meta Title (60 characters max)</Label>
            <Input
              id="metaTitle"
              value={metaTitle}
              onChange={(e) => onMetaTitleChange(e.target.value)}
              maxLength={60}
              placeholder="SEO-optimized title for search engines"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {metaTitle.length}/60 characters
            </p>
          </div>

          <div>
            <Label htmlFor="metaDescription">Meta Description (160 characters max)</Label>
            <Textarea
              id="metaDescription"
              value={metaDescription}
              onChange={(e) => onMetaDescriptionChange(e.target.value)}
              maxLength={160}
              rows={3}
              placeholder="Brief description for search engine results"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {metaDescription.length}/160 characters
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Open Graph (Social Media)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ogTitle">OG Title (60 characters max)</Label>
            <Input
              id="ogTitle"
              value={ogTitle}
              onChange={(e) => onOgTitleChange(e.target.value)}
              maxLength={60}
              placeholder="Title for social media shares"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {ogTitle.length}/60 characters
            </p>
          </div>

          <div>
            <Label htmlFor="ogDescription">OG Description (160 characters max)</Label>
            <Textarea
              id="ogDescription"
              value={ogDescription}
              onChange={(e) => onOgDescriptionChange(e.target.value)}
              maxLength={160}
              rows={3}
              placeholder="Description for social media shares"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {ogDescription.length}/160 characters
            </p>
          </div>

          <div>
            <Label htmlFor="ogImage">OG Image URL</Label>
            <Input
              id="ogImage"
              value={ogImage}
              onChange={(e) => onOgImageChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Recommended: 1200x630px for optimal social media display
            </p>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Hide" : "Show"} Social Media Preview
          </Button>

          {showPreview && (
            <Card className="mt-4 border-2">
              <CardHeader>
                <CardTitle className="text-sm">Facebook/LinkedIn Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden bg-white">
                  {ogImage ? (
                    <img 
                      src={ogImage} 
                      alt="OG Preview" 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="p-4 space-y-2">
                    <p className="text-xs text-muted-foreground uppercase">
                      rapidapplications.com
                    </p>
                    <h3 className="font-semibold text-lg line-clamp-2">
                      {ogTitle || "Your post title will appear here"}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ogDescription || "Your post description will appear here"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
