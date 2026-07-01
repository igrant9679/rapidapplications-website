import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Tag as TagIcon, Loader2 } from "lucide-react";

interface TagManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TAG_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

export default function TagManager({ open, onOpenChange }: TagManagerProps) {
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  // Fetch tags
  const { data: tags = [], refetch } = trpc.mediaTag.list.useQuery(undefined, {
    enabled: open,
  });

  // Create tag mutation
  const createMutation = trpc.mediaTag.create.useMutation({
    onSuccess: () => {
      alert("Tag created successfully");
      refetch();
      setNewTagName("");
      setSelectedColor(TAG_COLORS[0]);
    },
    onError: (error) => {
      alert("Error: " + (error.message || "Failed to create tag"));
    },
  });

  // Delete tag mutation
  const deleteMutation = trpc.mediaTag.delete.useMutation({
    onSuccess: () => {
      alert("Tag deleted successfully");
      refetch();
      setDeleteDialogOpen(false);
      setSelectedTagId(null);
    },
    onError: (error) => {
      alert("Error: " + (error.message || "Failed to delete tag"));
    },
  });

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    
    const slug = newTagName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    createMutation.mutate({
      name: newTagName.trim(),
      slug,
      color: selectedColor,
    });
  };

  const handleDeleteTag = () => {
    if (selectedTagId) {
      deleteMutation.mutate({ id: selectedTagId });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
            <DialogDescription>
              Create and manage tags for organizing your media library
            </DialogDescription>
          </DialogHeader>

          {/* Create New Tag */}
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="new-tag">Tag Name</Label>
                <Input
                  id="new-tag"
                  placeholder="Enter tag name..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateTag();
                    }
                  }}
                />
              </div>
              
              <div>
                <Label>Tag Color</Label>
                <div className="flex gap-2 mt-2">
                  {TAG_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-foreground scale-110"
                          : "border-border hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              
              <Button
                onClick={handleCreateTag}
                disabled={!newTagName.trim() || createMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tag
                  </>
                )}
              </Button>
            </div>

            {/* Existing Tags */}
            <div>
              <Label>Existing Tags ({tags.length})</Label>
              {tags.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TagIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No tags yet. Create your first tag above.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-2 p-4 border rounded-md max-h-64 overflow-y-auto">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="text-sm py-1 px-3 flex items-center gap-2"
                      style={{
                        backgroundColor: tag.color || "#6b7280",
                        color: "white",
                      }}
                    >
                      {tag.name}
                      <button
                        onClick={() => {
                          setSelectedTagId(tag.id);
                          setDeleteDialogOpen(true);
                        }}
                        className="hover:opacity-70"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tag? This will remove the tag from all images.
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
              onClick={handleDeleteTag}
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
    </>
  );
}
