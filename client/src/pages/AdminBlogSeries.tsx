import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, List, Loader2 } from "lucide-react";

export default function AdminBlogSeries() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    coverImage: "",
    status: "draft" as "draft" | "published",
  });

  const utils = trpc.useUtils();
  const { data: seriesList, isLoading } = trpc.blogSeries.listAll.useQuery();

  const createMutation = trpc.blogSeries.create.useMutation({
    onSuccess: () => {
      utils.blogSeries.listAll.invalidate();
      setIsCreateOpen(false);
      resetForm();
      alert("Series created successfully!");
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const updateMutation = trpc.blogSeries.update.useMutation({
    onSuccess: () => {
      utils.blogSeries.listAll.invalidate();
      setEditingSeries(null);
      resetForm();
      alert("Series updated successfully!");
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const deleteMutation = trpc.blogSeries.delete.useMutation({
    onSuccess: () => {
      utils.blogSeries.listAll.invalidate();
      alert("Series deleted successfully!");
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      coverImage: "",
      status: "draft",
    });
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (!editingSeries) return;
    updateMutation.mutate({
      id: editingSeries,
      ...formData,
    });
  };

  const handleEdit = (series: any) => {
    setEditingSeries(series.id);
    setFormData({
      title: series.title,
      slug: series.slug,
      description: series.description || "",
      coverImage: series.coverImage || "",
      status: series.status,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this series? All post associations will be removed.")) {
      deleteMutation.mutate({ id });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blog Series</h1>
          <p className="text-muted-foreground mt-2">
            Group related blog posts into ordered series
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Series
        </Button>
      </div>

      {seriesList && seriesList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <List className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No series yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first blog series to group related posts together
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Series
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {seriesList?.map((series) => (
            <Card key={series.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{series.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {series.postCount} {series.postCount === 1 ? "post" : "posts"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(series)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(series.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {series.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {series.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">/{series.slug}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      series.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {series.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateOpen || editingSeries !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingSeries(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSeries ? "Edit Series" : "Create New Series"}
            </DialogTitle>
            <DialogDescription>
              {editingSeries
                ? "Update series information"
                : "Create a new blog series to group related posts"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData({
                    ...formData,
                    title,
                    slug: generateSlug(title),
                  });
                }}
                placeholder="Getting Started with React"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="getting-started-with-react"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="A comprehensive guide to learning React from scratch..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "draft" | "published") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingSeries(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingSeries ? handleUpdate : handleCreate}
              disabled={
                !formData.title ||
                !formData.slug ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingSeries ? (
                "Update Series"
              ) : (
                "Create Series"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
