import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Trash2, Image as ImageIcon, Calendar, FileText, Loader2, CheckSquare, Square, Tag as TagIcon, X, Edit, Upload, Folder } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TagManager from "@/components/TagManager";
import MediaMetadataEditor from "@/components/MediaMetadataEditor";
import ImageUsageIndicator from "@/components/ImageUsageIndicator";
import DragDropUpload from "@/components/DragDropUpload";
import CollectionManager from "@/components/CollectionManager";

import { Link } from "wouter";

export default function AdminMedia() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTagId, setFilterTagId] = useState<number | null>(null);
  const [filterCollectionId, setFilterCollectionId] = useState<number | null>(null);
  const [filterDimension, setFilterDimension] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);
  const [collectionManagerOpen, setCollectionManagerOpen] = useState(false);
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [metadataEditorOpen, setMetadataEditorOpen] = useState(false);
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentMediaId, setCurrentMediaId] = useState<number | null>(null);
  const [editingMedia, setEditingMedia] = useState<{
    id: number;
    altText?: string;
    caption?: string;
  } | null>(null);


  // Fetch media list
  const { data: mediaList = [], isLoading, refetch } = trpc.media.list.useQuery(
    { search: searchTerm || undefined },
    { refetchOnWindowFocus: false }
  );

  // Fetch all tags
  const { data: allTags = [] } = trpc.mediaTag.list.useQuery();

  // Fetch all collections
  const { data: allCollections = [] } = trpc.mediaCollection.list.useQuery();

  // Fetch media by tag if filtering
  const { data: tagFilteredMedia = [] } = trpc.mediaTag.getMediaByTag.useQuery(
    { tagId: filterTagId! },
    { enabled: !!filterTagId }
  );

  // Fetch media by collection if filtering
  const { data: collectionFilteredMedia = [] } = trpc.mediaCollection.getMedia.useQuery(
    { collectionId: filterCollectionId! },
    { enabled: !!filterCollectionId }
  );

  // Apply all filters: collection, tag, search, and dimension
  let displayedMedia = filterCollectionId 
    ? collectionFilteredMedia 
    : filterTagId 
    ? tagFilteredMedia 
    : mediaList;
  
  // Apply search filter
  if (searchTerm) {
    displayedMedia = displayedMedia.filter((media) =>
      media.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Apply dimension filter
  if (filterDimension !== "all") {
    displayedMedia = displayedMedia.filter((media) => {
      if (!media.width || !media.height) return false;
      const maxDimension = Math.max(media.width, media.height);
      switch (filterDimension) {
        case "thumbnail":
          return maxDimension <= 300;
        case "medium":
          return maxDimension > 300 && maxDimension <= 1024;
        case "large":
          return maxDimension > 1024 && maxDimension <= 2048;
        case "full":
          return maxDimension > 2048;
        default:
          return true;
      }
    });
  }

  // Fetch tags for current media
  const { data: mediaTags = [], refetch: refetchMediaTags } = trpc.media.getTags.useQuery(
    { mediaId: currentMediaId! },
    { enabled: !!currentMediaId && tagDialogOpen }
  );

  // Assign tag mutation
  const assignTagMutation = trpc.media.assignTag.useMutation({
    onSuccess: () => {
      refetchMediaTags();
      refetch();
    },
    onError: (error) => {
      alert("Error: " + (error.message || "Failed to assign tag"));
    },
  });

  // Unassign tag mutation
  const unassignTagMutation = trpc.media.unassignTag.useMutation({
    onSuccess: () => {
      refetchMediaTags();
      refetch();
    },
    onError: (error) => {
      alert("Error: " + (error.message || "Failed to remove tag"));
    },
  });

  // Delete mutation
  const deleteMutation = trpc.media.delete.useMutation({
    onSuccess: () => {
      alert("Image deleted successfully");
      refetch();
      setDeleteDialogOpen(false);
      setSelectedMedia(null);
    },
    onError: (error) => {
      alert("Error: " + (error.message || "Failed to delete image"));
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = trpc.media.bulkDelete.useMutation({
    onSuccess: () => {
      alert(`${selectedIds.length} image(s) deleted successfully`);
      refetch();
      setBulkDeleteDialogOpen(false);
      setSelectedIds([]);
    },
    onError: (error) => {
      alert("Error: " + (error.message || "Failed to delete images"));
    },
  });

  const handleDelete = () => {
    if (selectedMedia) {
      deleteMutation.mutate({ id: selectedMedia });
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      bulkDeleteMutation.mutate({ ids: selectedIds });
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === displayedMedia.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedMedia.map(m => m.id));
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("Image URL copied to clipboard");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
              <p className="text-muted-foreground mt-1">
                Manage all uploaded images in one place
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowUploadZone(!showUploadZone)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
              <Button variant="outline" onClick={() => setCollectionManagerOpen(true)}>
                <Folder className="h-4 w-4 mr-2" />
                Manage Collections
              </Button>
              <Button variant="outline" onClick={() => setTagManagerOpen(true)}>
                <TagIcon className="h-4 w-4 mr-2" />
                Manage Tags
              </Button>
              <Link href="/admin/blog">
                <Button variant="outline">Back to Blog</Button>
              </Link>
            </div>
          </div>

          {/* Search Bar, Tag Filter, and Bulk Actions */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search images by filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Collection Filter */}
            <div className="flex items-center gap-2">
              <Select
                value={filterCollectionId?.toString() || "all"}
                onValueChange={(value) => {
                  setFilterCollectionId(value === "all" ? null : parseInt(value));
                  setFilterTagId(null); // Clear tag filter
                  setSearchTerm(""); // Clear search
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by collection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Collections</SelectItem>
                  {allCollections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id.toString()}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filterCollectionId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterCollectionId(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Tag Filter */}
            <div className="flex items-center gap-2">
              <Select
                value={filterTagId?.toString() || "all"}
                onValueChange={(value) => {
                  setFilterTagId(value === "all" ? null : parseInt(value));
                  setFilterCollectionId(null); // Clear collection filter
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
              {filterTagId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterTagId(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Dimension Filter */}
            <div className="flex items-center gap-2">
              <Select
                value={filterDimension}
                onValueChange={(value) => setFilterDimension(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="thumbnail">Thumbnail (≤300px)</SelectItem>
                  <SelectItem value="medium">Medium (301-1024px)</SelectItem>
                  <SelectItem value="large">Large (1025-2048px)</SelectItem>
                  <SelectItem value="full">Full Size (&gt;2048px)</SelectItem>
                </SelectContent>
              </Select>
              {filterDimension !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterDimension("all")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {displayedMedia.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSelectAll}
                >
                  {selectedIds.length === displayedMedia.length ? (
                    <><CheckSquare className="h-4 w-4 mr-2" /> Deselect All</>
                  ) : (
                    <><Square className="h-4 w-4 mr-2" /> Select All</>
                  )}
                </Button>
                
                {selectedIds.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setBulkDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedIds.length})
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {/* Drag-Drop Upload Zone */}
        {showUploadZone && (
          <div className="mb-8">
            <DragDropUpload
              onUploadComplete={() => {
                refetch();
                setShowUploadZone(false);
              }}
            />
          </div>
        )}

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
                  : "Upload images through the blog or CMS editor to see them here"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ImageIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{mediaList.length}</p>
                      <p className="text-sm text-muted-foreground">Total Images</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {formatFileSize(
                          mediaList.reduce((sum, m) => sum + (m.fileSize || 0), 0)
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Size</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {mediaList.length > 0
                          ? formatDate(mediaList[0].createdAt)
                          : "N/A"}
                      </p>
                      <p className="text-sm text-muted-foreground">Latest Upload</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedMedia.map((media) => (
                <Card key={media.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={selectedIds.includes(media.id)}
                        onCheckedChange={() => toggleSelection(media.id)}
                        className="bg-white border-2"
                      />
                    </div>
                    
                    <img
                      src={media.url}
                      alt={media.altText || media.fileName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleCopyUrl(media.url)}
                        title="Copy URL"
                      >
                        Copy URL
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditingMedia({
                            id: media.id,
                            altText: media.altText || "",
                            caption: media.caption || "",
                          });
                          setMetadataEditorOpen(true);
                        }}
                        title="Edit metadata"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setCurrentMediaId(media.id);
                          setCollectionDialogOpen(true);
                        }}
                        title="Add to collection"
                      >
                        <Folder className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setCurrentMediaId(media.id);
                          setTagDialogOpen(true);
                        }}
                        title="Manage tags"
                      >
                        <TagIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedMedia(media.id);
                          setDeleteDialogOpen(true);
                        }}
                        title="Delete image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm truncate mb-1" title={media.fileName}>
                      {media.fileName}
                    </h3>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>{formatFileSize(media.fileSize)}</p>
                      {media.width && media.height && (
                        <p>
                          {media.width} × {media.height}
                        </p>
                      )}
                      <p>{formatDate(media.createdAt)}</p>
                    </div>
                    
                    {/* Image Usage Indicator */}
                    <div className="mt-2">
                      <ImageUsageIndicator imageUrl={media.url} />
                    </div>
                    
                    {/* Display Tags */}
                    {media.tags && media.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {media.tags.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="text-xs px-1.5 py-0 cursor-pointer hover:opacity-80 transition-opacity"
                            style={{
                              backgroundColor: tag.color || "#6b7280",
                              color: "white",
                            }}
                            onClick={() => setFilterTagId(tag.id)}
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
              The image will be removed from the library but may still be referenced in existing content.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Multiple Images</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedIds.length} image(s)? This action cannot be undone.
              The images will be removed from the library but may still be referenced in existing content.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBulkDeleteDialogOpen(false)}
              disabled={bulkDeleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={bulkDeleteMutation.isPending}
            >
              {bulkDeleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                `Delete ${selectedIds.length} Image(s)`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag Assignment Dialog */}
      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Image Tags</DialogTitle>
            <DialogDescription>
              Assign or remove tags for this image
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {allTags.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>No tags available. Create tags first using "Manage Tags" button.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const isAssigned = mediaTags.some(mt => mt.id === tag.id);
                  return (
                    <Badge
                      key={tag.id}
                      variant={isAssigned ? "default" : "outline"}
                      className="cursor-pointer transition-opacity hover:opacity-80"
                      style={
                        isAssigned
                          ? {
                              backgroundColor: tag.color || "#6b7280",
                              color: "white",
                              borderColor: tag.color || "#6b7280",
                            }
                          : {
                              borderColor: tag.color || "#6b7280",
                              color: tag.color || "#6b7280",
                            }
                      }
                      onClick={() => {
                        if (currentMediaId) {
                          if (isAssigned) {
                            unassignTagMutation.mutate({
                              mediaId: currentMediaId,
                              tagId: tag.id,
                            });
                          } else {
                            assignTagMutation.mutate({
                              mediaId: currentMediaId,
                              tagId: tag.id,
                            });
                          }
                        }
                      }}
                    >
                      {tag.name}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTagDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Collection Assignment Dialog */}
      <Dialog open={collectionDialogOpen} onOpenChange={setCollectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Collection</DialogTitle>
            <DialogDescription>
              Assign this image to one or more collections
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {allCollections.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>No collections available. Create collections first using "Manage Collections" button.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {allCollections.map((collection) => (
                  <div key={collection.id} className="flex items-center justify-between p-2 border rounded hover:bg-accent transition-colors">
                    <div>
                      <p className="font-medium">{collection.name}</p>
                      {collection.description && (
                        <p className="text-sm text-muted-foreground">{collection.description}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (currentMediaId) {
                          trpc.mediaCollection.assignMedia.useMutation({
                            onSuccess: () => {
                              alert("Added to collection!");
                            },
                            onError: (error) => {
                              alert(`Failed: ${error.message}`);
                            },
                          }).mutate({
                            collectionId: collection.id,
                            mediaId: currentMediaId,
                          });
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCollectionDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Collection Manager */}
      <CollectionManager open={collectionManagerOpen} onOpenChange={setCollectionManagerOpen} />

      {/* Tag Manager */}
      <TagManager open={tagManagerOpen} onOpenChange={setTagManagerOpen} />

      {/* Metadata Editor */}
      {editingMedia && (
        <MediaMetadataEditor
          open={metadataEditorOpen}
          onOpenChange={setMetadataEditorOpen}
          mediaId={editingMedia.id}
          currentAltText={editingMedia.altText}
          currentCaption={editingMedia.caption}
          onSuccess={() => {
            refetch();
            setEditingMedia(null);
          }}
        />
      )}
    </div>
  );
}
