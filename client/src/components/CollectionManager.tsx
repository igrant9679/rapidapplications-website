import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Folder, Trash2, Plus } from "lucide-react";

interface CollectionManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CollectionManager({ open, onOpenChange }: CollectionManagerProps) {
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");

  // Fetch all collections
  const { data: collections = [], refetch } = trpc.mediaCollection.list.useQuery(
    undefined,
    { enabled: open }
  );

  // Create collection mutation
  const createMutation = trpc.mediaCollection.create.useMutation({
    onSuccess: () => {
      refetch();
      setNewCollectionName("");
      setNewCollectionDescription("");
      alert("Collection created successfully!");
    },
    onError: (error) => {
      alert(`Failed to create collection: ${error.message}`);
    },
  });

  // Delete collection mutation
  const deleteMutation = trpc.mediaCollection.delete.useMutation({
    onSuccess: () => {
      refetch();
      alert("Collection deleted successfully!");
    },
    onError: (error) => {
      alert(`Failed to delete collection: ${error.message}`);
    },
  });

  const handleCreate = () => {
    if (!newCollectionName.trim()) {
      alert("Please enter a collection name");
      return;
    }

    createMutation.mutate({
      name: newCollectionName,
      description: newCollectionDescription || undefined,
    });
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete the collection "${name}"?`)) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Collections</DialogTitle>
          <DialogDescription>
            Create and organize image collections (albums) for better content management
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create New Collection */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Create New Collection</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    placeholder="e.g., Event Photos 2024"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Optional description for this collection"
                    value={newCollectionDescription}
                    onChange={(e) => setNewCollectionDescription(e.target.value)}
                    rows={2}
                  />
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {createMutation.isPending ? "Creating..." : "Create Collection"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Collections */}
          <div>
            <h3 className="font-semibold mb-3">Existing Collections ({collections.length})</h3>
            {collections.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Folder className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No collections yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {collections.map((collection) => (
                  <Card key={collection.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Folder className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{collection.name}</h4>
                          {collection.description && (
                            <p className="text-sm text-muted-foreground truncate">
                              {collection.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(collection.id, collection.name)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
