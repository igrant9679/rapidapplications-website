import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface MediaMetadataEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaId: number;
  currentAltText?: string;
  currentCaption?: string;
  onSuccess?: () => void;
}

export default function MediaMetadataEditor({
  open,
  onOpenChange,
  mediaId,
  currentAltText = "",
  currentCaption = "",
  onSuccess,
}: MediaMetadataEditorProps) {
  const [altText, setAltText] = useState(currentAltText);
  const [caption, setCaption] = useState(currentCaption);

  // Update metadata mutation
  const updateMutation = trpc.media.updateMetadata.useMutation({
    onSuccess: () => {
      alert("Metadata updated successfully");
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (error) => {
      alert("Error: " + (error.message || "Failed to update metadata"));
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      id: mediaId,
      altText: altText || undefined,
      caption: caption || undefined,
    });
  };

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setAltText(currentAltText);
      setCaption(currentCaption);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Image Metadata</DialogTitle>
          <DialogDescription>
            Update alt text and caption for this image
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="alt-text">Alt Text</Label>
            <Input
              id="alt-text"
              placeholder="Describe the image for accessibility..."
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used by screen readers and when images fail to load
            </p>
          </div>

          <div>
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Add a caption for this image..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional description or context for the image
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
