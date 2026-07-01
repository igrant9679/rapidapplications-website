import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Image as ImageIcon, Loader2, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ImageSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string, filename: string) => void;
}

export default function ImageSelector({ open, onOpenChange, onSelect }: ImageSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTagId, setFilterTagId] = useState<number | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  // Fetch media list
  const { data: mediaList = [], isLoading } = trpc.media.list.useQuery(
    { search: searchTerm || undefined },
    { 
      refetchOnWindowFocus: false,
      enabled: open && !filterTagId, // Only fetch when dialog is open and not filtering by tag
    }
  );

  // Fetch all tags
  const { data: allTags = [] } = trpc.mediaTag.list.useQuery(undefined, { enabled: open });

  // Fetch media by tag if filtering
  const { data: tagFilteredMedia = [] } = trpc.mediaTag.getMediaByTag.useQuery(
    { tagId: filterTagId! },
    { enabled: open && !!filterTagId }
  );

  // Use filtered media if tag filter is active, otherwise use search results
  const displayedMedia = filterTagId ? tagFilteredMedia : mediaList;

  const handleSelect = () => {
    if (selectedUrl) {
      const selectedMedia = displayedMedia.find(m => m.url === selectedUrl);
      onSelect(selectedUrl, selectedMedia?.fileName || "");
      setSelectedUrl(null);
      setSearchTerm("");
      setFilterTagId(null);
      onOpenChange(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Image from Library</DialogTitle>
          <DialogDescription>
            Choose an existing image from your media library
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar and Tag Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search images by filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterTagId?.toString() || "all"}
            onValueChange={(value) => {
              setFilterTagId(value === "all" ? null : parseInt(value));
              setSearchTerm(""); // Clear search when filtering by tag
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Images</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id.toString()}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : displayedMedia.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No images found</h3>
                <p className="text-muted-foreground text-center max-w-sm">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : filterTagId
                    ? "No images found with this tag"
                    : "Upload images first to see them here"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {displayedMedia.map((media) => (
                <Card
                  key={media.id}
                  className={`overflow-hidden cursor-pointer transition-all ${
                    selectedUrl === media.url
                      ? "ring-2 ring-primary shadow-lg"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedUrl(media.url)}
                >
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <img
                      src={media.url}
                      alt={media.altText || media.fileName}
                      className="w-full h-full object-cover"
                    />
                    {selectedUrl === media.url && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                          <Check className="h-6 w-6" />
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-xs truncate mb-1" title={media.fileName}>
                      {media.fileName}
                    </h3>
                    <div className="text-xs text-muted-foreground">
                      <p>{formatFileSize(media.fileSize)}</p>
                      {media.width && media.height && (
                        <p>
                          {media.width} × {media.height}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedUrl(null);
              setSearchTerm("");
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedUrl}>
            Insert Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
