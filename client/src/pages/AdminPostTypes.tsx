import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit, FileText, List } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export default function AdminPostTypes() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingType, setEditingType] = useState<any>(null);
  
  const [form, setForm] = useState({
    name: "",
    slug: "",
    singularName: "",
    pluralName: "",
    description: "",
    icon: "file-text",
    isPublic: true,
    hasArchive: true,
    hierarchical: false,
    supportsTitle: true,
    supportsContent: true,
    supportsExcerpt: true,
    supportsFeaturedImage: true,
    supportsComments: false,
    supportsCategories: false,
    supportsTags: false,
    menuPosition: 20,
  });

  const { data: postTypes, refetch } = trpc.customPostTypes.getAllPostTypes.useQuery();

  const createMutation = trpc.customPostTypes.createPostType.useMutation({
    onSuccess: () => {
      toast.success("Post type created successfully");
      refetch();
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.customPostTypes.updatePostType.useMutation({
    onSuccess: () => {
      toast.success("Post type updated successfully");
      refetch();
      setEditingType(null);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = trpc.customPostTypes.deletePostType.useMutation({
    onSuccess: () => {
      toast.success("Post type deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      singularName: "",
      pluralName: "",
      description: "",
      icon: "file-text",
      isPublic: true,
      hasArchive: true,
      hierarchical: false,
      supportsTitle: true,
      supportsContent: true,
      supportsExcerpt: true,
      supportsFeaturedImage: true,
      supportsComments: false,
      supportsCategories: false,
      supportsTags: false,
      menuPosition: 20,
    });
  };

  const handleCreate = () => {
    createMutation.mutate({
      ...form,
      isPublic: form.isPublic ? 1 : 0,
      hasArchive: form.hasArchive ? 1 : 0,
      hierarchical: form.hierarchical ? 1 : 0,
      supportsTitle: form.supportsTitle ? 1 : 0,
      supportsContent: form.supportsContent ? 1 : 0,
      supportsExcerpt: form.supportsExcerpt ? 1 : 0,
      supportsFeaturedImage: form.supportsFeaturedImage ? 1 : 0,
      supportsComments: form.supportsComments ? 1 : 0,
      supportsCategories: form.supportsCategories ? 1 : 0,
      supportsTags: form.supportsTags ? 1 : 0,
    });
  };

  const handleUpdate = () => {
    if (!editingType) return;

    updateMutation.mutate({
      id: editingType.id,
      data: {
        ...form,
        isPublic: form.isPublic ? 1 : 0,
        hasArchive: form.hasArchive ? 1 : 0,
        hierarchical: form.hierarchical ? 1 : 0,
        supportsTitle: form.supportsTitle ? 1 : 0,
        supportsContent: form.supportsContent ? 1 : 0,
        supportsExcerpt: form.supportsExcerpt ? 1 : 0,
        supportsFeaturedImage: form.supportsFeaturedImage ? 1 : 0,
        supportsComments: form.supportsComments ? 1 : 0,
        supportsCategories: form.supportsCategories ? 1 : 0,
        supportsTags: form.supportsTags ? 1 : 0,
      },
    });
  };

  const handleEdit = (type: any) => {
    setEditingType(type);
    setForm({
      name: type.name,
      slug: type.slug,
      singularName: type.singularName,
      pluralName: type.pluralName,
      description: type.description || "",
      icon: type.icon || "file-text",
      isPublic: type.isPublic === 1,
      hasArchive: type.hasArchive === 1,
      hierarchical: type.hierarchical === 1,
      supportsTitle: type.supportsTitle === 1,
      supportsContent: type.supportsContent === 1,
      supportsExcerpt: type.supportsExcerpt === 1,
      supportsFeaturedImage: type.supportsFeaturedImage === 1,
      supportsComments: type.supportsComments === 1,
      supportsCategories: type.supportsCategories === 1,
      supportsTags: type.supportsTags === 1,
      menuPosition: type.menuPosition || 20,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this post type? All items of this type will also be deleted.")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Custom Post Types</h1>
          <p className="text-muted-foreground mt-2">
            Create flexible content types beyond blog posts and pages
          </p>
        </div>
        <Dialog open={isCreateOpen || !!editingType} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) {
            setEditingType(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Post Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingType ? "Edit" : "Create"} Post Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Portfolio"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="portfolio"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="singularName">Singular Name</Label>
                    <Input
                      id="singularName"
                      value={form.singularName}
                      onChange={(e) => setForm({ ...form, singularName: e.target.value })}
                      placeholder="Portfolio"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pluralName">Plural Name</Label>
                    <Input
                      id="pluralName"
                      value={form.pluralName}
                      onChange={(e) => setForm({ ...form, pluralName: e.target.value })}
                      placeholder="Portfolios"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>
                <div>
                  <Label htmlFor="menuPosition">Menu Position</Label>
                  <Input
                    id="menuPosition"
                    type="number"
                    value={form.menuPosition}
                    onChange={(e) => setForm({ ...form, menuPosition: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isPublic">Public</Label>
                    <Switch
                      id="isPublic"
                      checked={form.isPublic}
                      onCheckedChange={(checked) => setForm({ ...form, isPublic: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hasArchive">Has Archive Page</Label>
                    <Switch
                      id="hasArchive"
                      checked={form.hasArchive}
                      onCheckedChange={(checked) => setForm({ ...form, hasArchive: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hierarchical">Hierarchical (like pages)</Label>
                    <Switch
                      id="hierarchical"
                      checked={form.hierarchical}
                      onCheckedChange={(checked) => setForm({ ...form, hierarchical: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* Supported Features */}
              <div className="space-y-4">
                <h3 className="font-semibold">Supported Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="supportsTitle">Title</Label>
                    <Switch
                      id="supportsTitle"
                      checked={form.supportsTitle}
                      onCheckedChange={(checked) => setForm({ ...form, supportsTitle: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="supportsContent">Content Editor</Label>
                    <Switch
                      id="supportsContent"
                      checked={form.supportsContent}
                      onCheckedChange={(checked) => setForm({ ...form, supportsContent: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="supportsExcerpt">Excerpt</Label>
                    <Switch
                      id="supportsExcerpt"
                      checked={form.supportsExcerpt}
                      onCheckedChange={(checked) => setForm({ ...form, supportsExcerpt: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="supportsFeaturedImage">Featured Image</Label>
                    <Switch
                      id="supportsFeaturedImage"
                      checked={form.supportsFeaturedImage}
                      onCheckedChange={(checked) => setForm({ ...form, supportsFeaturedImage: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="supportsComments">Comments</Label>
                    <Switch
                      id="supportsComments"
                      checked={form.supportsComments}
                      onCheckedChange={(checked) => setForm({ ...form, supportsComments: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="supportsCategories">Categories</Label>
                    <Switch
                      id="supportsCategories"
                      checked={form.supportsCategories}
                      onCheckedChange={(checked) => setForm({ ...form, supportsCategories: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="supportsTags">Tags</Label>
                    <Switch
                      id="supportsTags"
                      checked={form.supportsTags}
                      onCheckedChange={(checked) => setForm({ ...form, supportsTags: checked })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={editingType ? handleUpdate : handleCreate} className="w-full">
                {editingType ? "Update" : "Create"} Post Type
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postTypes?.map((type) => (
          <Card key={type.id}>
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {type.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{type.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(type)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(type.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href={`/admin/post-type/${type.slug}`}>
                <Button variant="outline" size="sm" className="w-full mb-4">
                  <List className="h-4 w-4 mr-2" />
                  Manage Items
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                {type.description || "No description"}
              </p>
              <div className="flex flex-wrap gap-2">
                {type.isPublic === 1 && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Public</span>
                )}
                {type.hasArchive === 1 && (
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">Archive</span>
                )}
                {type.hierarchical === 1 && (
                  <span className="text-xs bg-secondary/10 text-secondary-foreground px-2 py-1 rounded">Hierarchical</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {postTypes?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Custom Post Types</h3>
            <p className="text-muted-foreground mb-4">
              Create your first custom post type to extend your content beyond blog posts and pages
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Post Type
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
