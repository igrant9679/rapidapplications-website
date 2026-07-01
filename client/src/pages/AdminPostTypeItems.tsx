import { useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function AdminPostTypeItems() {
  const [, params] = useRoute("/admin/post-type/:slug");
  const postTypeSlug = params?.slug || "";

  const { data: postType, isLoading: loadingPostType } = trpc.customPostTypes.getPostTypeBySlug.useQuery({ slug: postTypeSlug });
  const { data: items, isLoading: loadingItems, refetch } = trpc.customPostTypes.getItemsByType.useQuery(
    { postTypeId: postType?.id || 0 }, 
    { enabled: !!postType }
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    status: "draft" as "draft" | "published" | "scheduled" | "archived",
  });

  const createMutation = trpc.customPostTypes.createItem.useMutation({
    onSuccess: () => {
      toast.success("Item created successfully");
      refetch();
      setIsEditing(false);
      setFormData({ title: "", slug: "", excerpt: "", content: "", featuredImage: "", status: "draft" });
    },
    onError: (error) => {
      toast.error(`Failed to create item: ${error.message}`);
    },
  });

  const updateMutation = trpc.customPostTypes.updateItem.useMutation({
    onSuccess: () => {
      toast.success("Item updated successfully");
      refetch();
      setIsEditing(false);
      setEditingItem(null);
      setFormData({ title: "", slug: "", excerpt: "", content: "", featuredImage: "", status: "draft" });
    },
    onError: (error) => {
      toast.error(`Failed to update item: ${error.message}`);
    },
  });

  const deleteMutation = trpc.customPostTypes.deleteItem.useMutation({
    onSuccess: () => {
      toast.success("Item deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete item: ${error.message}`);
    },
  });

  const handleCreate = () => {
    setIsEditing(true);
    setEditingItem(null);
    setFormData({ title: "", slug: "", excerpt: "", content: "", featuredImage: "", status: "draft" });
  };

  const handleEdit = (item: any) => {
    setIsEditing(true);
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      slug: item.slug || "",
      excerpt: item.excerpt || "",
      content: item.content || "",
      featuredImage: item.featuredImage || "",
      status: item.status || "draft",
    });
  };

  const handleDelete = (itemId: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate({ id: itemId });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postType) return;

    // Generate slug from title if empty
    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    if (editingItem) {
      updateMutation.mutate({
        id: editingItem.id,
        data: {
          ...formData,
          slug,
        },
      });
    } else {
      createMutation.mutate({
        postTypeId: postType.id,
        ...formData,
        slug,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingItem(null);
    setFormData({ title: "", slug: "", excerpt: "", content: "", featuredImage: "", status: "draft" });
  };

  if (loadingPostType) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!postType) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Post type not found</p>
            <Link href="/admin/post-types">
              <Button className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Post Types
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/post-types">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Post Types
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{postType.pluralName}</h1>
          <p className="text-muted-foreground">{postType.description}</p>
        </div>
        {!isEditing && (
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add {postType.singularName}
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingItem ? `Edit ${postType.singularName}` : `New ${postType.singularName}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter title"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated-from-title"
                />
                <p className="text-xs text-muted-foreground mt-1">Leave empty to auto-generate from title</p>
              </div>

              {postType.supportsExcerpt === 1 && (
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief summary"
                    rows={3}
                  />
                </div>
              )}

              {postType.supportsContent === 1 && (
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Full content"
                    rows={10}
                  />
                </div>
              )}

              {postType.supportsFeaturedImage === 1 && (
                <div>
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingItem ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {loadingItems ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : items && items.length > 0 ? (
            items.map((item: any) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      {item.excerpt && <p className="text-sm text-muted-foreground mt-1">{item.excerpt}</p>}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="capitalize">Status: {item.status}</span>
                        <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No items yet. Click "Add {postType.singularName}" to create one.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
