import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Folder, Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminCategories() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: categories = [], isLoading } = trpc.blogCategory.list.useQuery();
  const { data: flatCategories = [] } = trpc.blogCategory.listFlat.useQuery();

  const createMutation = trpc.blogCategory.create.useMutation({
    onSuccess: () => {
      utils.blogCategory.list.invalidate();
      setIsCreateOpen(false);
      resetForm();
    },
  });

  const updateMutation = trpc.blogCategory.update.useMutation({
    onSuccess: () => {
      utils.blogCategory.list.invalidate();
      setEditingCategory(null);
      resetForm();
    },
  });

  const deleteMutation = trpc.blogCategory.delete.useMutation({
    onSuccess: () => {
      utils.blogCategory.list.invalidate();
      setDeleteId(null);
    },
  });

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setParentId(null);
  };

  const handleCreate = () => {
    createMutation.mutate({ 
      name, 
      slug, 
      description: description || undefined,
      parentId: parentId || undefined,
    });
  };

  const handleUpdate = () => {
    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        name,
        slug,
        description: description || undefined,
        parentId: parentId || undefined,
      });
    }
  };

  const openEdit = (category: any) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || "");
    setParentId(category.parentId || null);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Blog Categories</h1>
            <p className="text-muted-foreground mt-1">
              Organize your blog posts with categories
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </div>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>Categories List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No categories yet</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsCreateOpen(true)}
                >
                  Create Your First Category
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category: any) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {category.slug}
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {category.description || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Add a new category to organize your blog posts.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(generateSlug(e.target.value));
                  }}
                  placeholder="Technology"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  placeholder="technology"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Posts about technology and innovation"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentId">Parent Category</Label>
                <Select
                  value={parentId?.toString() || "none"}
                  onValueChange={(value) => setParentId(value === "none" ? null : parseInt(value))}
                >
                  <SelectTrigger id="parentId">
                    <SelectValue placeholder="None (root category)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (root category)</SelectItem>
                    {flatCategories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select a parent to create a subcategory
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!name || !slug || createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={editingCategory !== null}
          onOpenChange={() => setEditingCategory(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the category details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug *</Label>
                <Input
                  id="edit-slug"
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-parentId">Parent Category</Label>
                <Select
                  value={parentId?.toString() || "none"}
                  onValueChange={(value) => setParentId(value === "none" ? null : parseInt(value))}
                >
                  <SelectTrigger id="edit-parentId">
                    <SelectValue placeholder="None (root category)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (root category)</SelectItem>
                    {flatCategories.filter((cat: any) => cat.id !== editingCategory?.id).map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select a parent to create a subcategory
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditingCategory(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={!name || !slug || updateMutation.isPending}
              >
                {updateMutation.isPending ? "Updating..." : "Update Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this category? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
