import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Trash2, Settings, FileText, Layout, Box } from "lucide-react";
import { toast } from "sonner";

export default function CustomFieldsPage() {

  const utils = trpc.useUtils();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Form state for creating/editing fields
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    type: "text" as any,
    description: "",
    contentType: "post",
    defaultValue: "",
    options: "",
    isRequired: 0,
    displayOrder: 0,
  });

  // Fetch all custom fields
  const { data: allFields = [], isLoading } = trpc.customFields.listFields.useQuery({});

  // Filter fields by content type
  const filteredFields = activeTab === "all" 
    ? allFields 
    : allFields.filter(f => f.contentType === activeTab);

  // Mutations
  const createFieldMutation = trpc.customFields.createField.useMutation({
    onSuccess: () => {
      toast.success("Custom field created successfully");
      utils.customFields.listFields.invalidate();
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateFieldMutation = trpc.customFields.updateField.useMutation({
    onSuccess: () => {
      toast.success("Custom field updated successfully");
      utils.customFields.listFields.invalidate();
      setIsEditDialogOpen(false);
      setSelectedField(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteFieldMutation = trpc.customFields.deleteField.useMutation({
    onSuccess: () => {
      toast.success("Custom field deleted successfully");
      utils.customFields.listFields.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      type: "text",
      description: "",
      contentType: "post",
      defaultValue: "",
      options: "",
      isRequired: 0,
      displayOrder: 0,
    });
  };

  const handleCreate = () => {
    createFieldMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (!selectedField) return;
    updateFieldMutation.mutate({
      id: selectedField.id,
      ...formData,
    });
  };

  const handleEdit = (field: any) => {
    setSelectedField(field);
    setFormData({
      name: field.name,
      slug: field.slug,
      type: field.type,
      description: field.description || "",
      contentType: field.contentType,
      defaultValue: field.defaultValue || "",
      options: field.options || "",
      isRequired: field.isRequired,
      displayOrder: field.displayOrder,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this custom field? This will also delete all associated field values.")) {
      deleteFieldMutation.mutate({ id });
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case "text":
      case "textarea":
        return <FileText className="h-4 w-4" />;
      case "number":
      case "date":
        return <Settings className="h-4 w-4" />;
      case "select":
      case "checkbox":
        return <Layout className="h-4 w-4" />;
      default:
        return <Box className="h-4 w-4" />;
    }
  };

  const getContentTypeLabel = (contentType: string) => {
    switch (contentType) {
      case "post":
        return "Blog Posts";
      case "page":
        return "Pages";
      case "custom_post_type":
        return "Custom Post Types";
      default:
        return contentType;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Custom Fields</h1>
            <p className="text-muted-foreground mt-1">
              Define custom metadata fields for your content types
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Field
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Custom Field</DialogTitle>
                <DialogDescription>
                  Define a new custom field that can be attached to posts, pages, or custom post types
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Field Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Project URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Field Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g., project_url"
                  />
                  <p className="text-xs text-muted-foreground">
                    Used in code to reference this field. Auto-generated from name.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Field Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text (single line)</SelectItem>
                      <SelectItem value="textarea">Textarea (multiple lines)</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="select">Select (dropdown)</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                      <SelectItem value="file">File Upload</SelectItem>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentType">Content Type *</Label>
                  <Select
                    value={formData.contentType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">Blog Posts</SelectItem>
                      <SelectItem value="page">Pages</SelectItem>
                      <SelectItem value="custom_post_type">Custom Post Types</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Which content type should this field be available for?
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Help text for content editors"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultValue">Default Value</Label>
                  <Input
                    id="defaultValue"
                    value={formData.defaultValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, defaultValue: e.target.value }))}
                    placeholder="Optional default value"
                  />
                </div>

                {(formData.type === "select" || formData.type === "checkbox") && (
                  <div className="space-y-2">
                    <Label htmlFor="options">Options *</Label>
                    <Textarea
                      id="options"
                      value={formData.options}
                      onChange={(e) => setFormData(prev => ({ ...prev, options: e.target.value }))}
                      placeholder="Enter options, one per line"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      For select/checkbox fields, enter each option on a new line
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isRequired"
                    checked={formData.isRequired === 1}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRequired: checked ? 1 : 0 }))}
                  />
                  <Label htmlFor="isRequired" className="cursor-pointer">
                    Required field
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower numbers appear first in forms
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={createFieldMutation.isPending}>
                  {createFieldMutation.isPending ? "Creating..." : "Create Field"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs for filtering by content type */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Fields ({allFields.length})</TabsTrigger>
            <TabsTrigger value="post">
              Blog Posts ({allFields.filter(f => f.contentType === "post").length})
            </TabsTrigger>
            <TabsTrigger value="page">
              Pages ({allFields.filter(f => f.contentType === "page").length})
            </TabsTrigger>
            <TabsTrigger value="custom_post_type">
              Custom Post Types ({allFields.filter(f => f.contentType === "custom_post_type").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {isLoading ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">Loading custom fields...</p>
                </CardContent>
              </Card>
            ) : filteredFields.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    No custom fields found. Create your first custom field to get started.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredFields.map((field) => (
                  <Card key={field.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getFieldTypeIcon(field.type)}
                            <CardTitle className="text-lg">{field.name}</CardTitle>
                            {field.isRequired === 1 && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                          </div>
                          <CardDescription>
                            <code className="text-xs bg-muted px-2 py-1 rounded">{field.slug}</code>
                            {field.description && (
                              <span className="ml-2">• {field.description}</span>
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(field)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(field.id)}
                            disabled={deleteFieldMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Type:</span>{" "}
                          <Badge variant="outline">{field.type}</Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Content Type:</span>{" "}
                          <Badge variant="secondary">{getContentTypeLabel(field.contentType)}</Badge>
                        </div>
                        {field.defaultValue && (
                          <div>
                            <span className="text-muted-foreground">Default:</span>{" "}
                            <code className="text-xs bg-muted px-2 py-1 rounded">{field.defaultValue}</code>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">Order:</span> {field.displayOrder}
                        </div>
                      </div>
                      {field.options && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-muted-foreground mb-2">Options:</p>
                          <div className="flex flex-wrap gap-2">
                            {field.options.split("\n").filter(Boolean).map((option: string, idx: number) => (
                              <Badge key={idx} variant="outline">{option.trim()}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Custom Field</DialogTitle>
              <DialogDescription>
                Update the custom field configuration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Field Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Project URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-slug">Field Slug *</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g., project_url"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-type">Field Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text (single line)</SelectItem>
                    <SelectItem value="textarea">Textarea (multiple lines)</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="select">Select (dropdown)</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="file">File Upload</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Help text for content editors"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-defaultValue">Default Value</Label>
                <Input
                  id="edit-defaultValue"
                  value={formData.defaultValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultValue: e.target.value }))}
                  placeholder="Optional default value"
                />
              </div>

              {(formData.type === "select" || formData.type === "checkbox") && (
                <div className="space-y-2">
                  <Label htmlFor="edit-options">Options *</Label>
                  <Textarea
                    id="edit-options"
                    value={formData.options}
                    onChange={(e) => setFormData(prev => ({ ...prev, options: e.target.value }))}
                    placeholder="Enter options, one per line"
                    rows={4}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isRequired"
                  checked={formData.isRequired === 1}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRequired: checked ? 1 : 0 }))}
                />
                <Label htmlFor="edit-isRequired" className="cursor-pointer">
                  Required field
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-displayOrder">Display Order</Label>
                <Input
                  id="edit-displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={updateFieldMutation.isPending}>
                {updateFieldMutation.isPending ? "Updating..." : "Update Field"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
