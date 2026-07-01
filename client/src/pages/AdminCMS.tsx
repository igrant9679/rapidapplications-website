import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Save, X, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageUpload from "@/components/ImageUpload";
import RichTextEditor from "@/components/RichTextEditor";
import "@/components/tiptap.css";
import ImageSelector from "@/components/ImageSelector";
import { PAGE_TEMPLATES, getTemplateContent } from "@shared/pageTemplates";
import { CustomFieldsEditor } from "@/components/CustomFieldsEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminCMS() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [imageSelectorOpen, setImageSelectorOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    metaDescription: "",
    status: "draft" as "draft" | "published",
    template: "blank",
    visibility: "public" as "public" | "private" | "password",
    password: "",
    requiredRole: undefined as "user" | "admin" | undefined,
    customFields: {} as Record<string, any>,
  });

  const utils = trpc.useUtils();
  const { data: pages, isLoading, refetch } = trpc.cms.list.useQuery();
  const bulkSetFieldValuesMutation = trpc.customFields.bulkSetFieldValues.useMutation();
  const createMutation = trpc.cms.create.useMutation({
    onSuccess: async (result: any) => {
      const pageId = result.insertId || result[0]?.insertId;
      
      // Save custom field values
      if (formData.customFields && Object.keys(formData.customFields).length > 0) {
        const allFields = await utils.customFields.listFields.fetch({ contentType: "page" });
        const fieldMap = new Map(allFields.map((f: any) => [f.slug, f.id]));
        
        const values = Object.entries(formData.customFields)
          .filter(([_, value]) => value !== "" && value !== null && value !== undefined)
          .map(([slug, value]) => {
            const fieldId = fieldMap.get(slug);
            if (!fieldId) return null;
            return {
              fieldId,
              value: String(value),
            };
          })
          .filter((v): v is { fieldId: number; value: string } => v !== null);
        
        if (values.length > 0) {
          await bulkSetFieldValuesMutation.mutateAsync({
            entityType: "page",
            entityId: pageId,
            values,
          });
        }
      }
      
      refetch();
      resetForm();
      alert("Page created successfully!");
    },
    onError: (error) => {
      alert(`Error creating page: ${error.message}`);
    },
  });

  const updateMutation = trpc.cms.update.useMutation({
    onSuccess: async () => {
      // Save custom field values
      if (editingPage?.id && formData.customFields && Object.keys(formData.customFields).length > 0) {
        const allFields = await utils.customFields.listFields.fetch({ contentType: "page" });
        const fieldMap = new Map(allFields.map((f: any) => [f.slug, f.id]));
        
        const values = Object.entries(formData.customFields)
          .filter(([_, value]) => value !== "" && value !== null && value !== undefined)
          .map(([slug, value]) => {
            const fieldId = fieldMap.get(slug);
            if (!fieldId) return null;
            return {
              fieldId,
              value: String(value),
            };
          })
          .filter((v): v is { fieldId: number; value: string } => v !== null);
        
        if (values.length > 0) {
          await bulkSetFieldValuesMutation.mutateAsync({
            entityType: "page",
            entityId: editingPage.id,
            values,
          });
        }
      }
      
      refetch();
      resetForm();
      alert("Page updated successfully!");
    },
    onError: (error) => {
      alert(`Error updating page: ${error.message}`);
    },
  });

  const deleteMutation = trpc.cms.delete.useMutation({
    onSuccess: () => {
      refetch();
      alert("Page deleted successfully!");
    },
    onError: (error) => {
      alert(`Error deleting page: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      metaDescription: "",
      status: "draft",
      template: "blank",
      visibility: "public",
      password: "",
      requiredRole: undefined,
      customFields: {},
    });
    setIsEditing(false);
    setEditingPage(null);
  };

  const handleTemplateChange = (templateId: string) => {
    const content = getTemplateContent(templateId);
    setFormData({
      ...formData,
      template: templateId,
      content,
    });
  };

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      metaDescription: page.metaDescription || "",
      status: page.status,
      template: page.template || "blank",
      visibility: page.visibility || "public",
      customFields: {},
      password: page.password || "",
      requiredRole: page.requiredRole,
    });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPage) {
      updateMutation.mutate({
        id: editingPage.id,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this page?")) {
      deleteMutation.mutate({ id });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="container max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold">CMS Pages Management</h1>
              <p className="text-muted-foreground mt-2">
                Create and manage all website pages
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <a href="/admin/media">Media Library</a>
              </Button>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Page
                </Button>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Page List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Pages ({pages?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : pages && pages.length > 0 ? (
                    <div className="space-y-2">
                      {pages.map((page) => (
                        <div
                          key={page.id}
                          className={`p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                            editingPage?.id === page.id ? "bg-muted" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{page.title}</h3>
                              <p className="text-sm text-muted-foreground truncate">
                                /{page.slug}
                              </p>
                              <Badge
                                variant={
                                  page.status === "published" ? "default" : "secondary"
                                }
                                className="mt-2"
                              >
                                {page.status}
                              </Badge>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(page)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(page.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No pages yet. Create your first page!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Editor */}
            <div className="lg:col-span-2">
              {isEditing ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        {editingPage ? "Edit Page" : "Create New Page"}
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={resetForm}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Page Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => {
                            const title = e.target.value;
                            setFormData({
                              ...formData,
                              title,
                              slug: editingPage ? formData.slug : generateSlug(title),
                            });
                          }}
                          placeholder="About Us"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slug">URL Slug *</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">/</span>
                          <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) =>
                              setFormData({ ...formData, slug: e.target.value })
                            }
                            placeholder="about-us"
                            required
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          URL-friendly identifier (lowercase, hyphens only)
                        </p>
                      </div>

                      {!editingPage && (
                        <div className="space-y-2">
                          <Label htmlFor="template">Page Template</Label>
                          <Select
                            value={formData.template}
                            onValueChange={handleTemplateChange}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PAGE_TEMPLATES.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <div>
                                      <div className="font-medium">{template.name}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {template.description}
                                      </div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground">
                            Choose a template to start with pre-filled content
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Upload Images for Content</Label>
                        <div className="flex gap-2">
                          <ImageUpload
                            onUploadComplete={(url) => {
                              // Insert markdown image syntax at cursor position
                              const imageMarkdown = `\n![Image](${url})\n`;
                              setFormData({
                                ...formData,
                                content: formData.content + imageMarkdown
                              });
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setImageSelectorOpen(true)}
                          >
                            Select from Library
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Upload images or select from library - they'll be automatically inserted into your content
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content">Page Content *</Label>
                        <RichTextEditor
                          content={formData.content}
                          onChange={(html) => setFormData({ ...formData, content: html })}
                          placeholder="Write your page content..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="metaDescription">Meta Description</Label>
                        <Textarea
                          id="metaDescription"
                          value={formData.metaDescription}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              metaDescription: e.target.value,
                            })
                          }
                          placeholder="Brief description for search engines (max 160 characters)"
                          rows={3}
                          maxLength={160}
                        />
                        <p className="text-sm text-muted-foreground">
                          {formData.metaDescription.length}/160 characters
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                          id="status"
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: e.target.value as "draft" | "published",
                            })
                          }
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="visibility">Visibility</Label>
                        <Select
                          value={formData.visibility}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              visibility: value as "public" | "private" | "password",
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private (Login Required)</SelectItem>
                            <SelectItem value="password">Password Protected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.visibility === "password" && (
                        <div className="space-y-2">
                          <Label htmlFor="password">Page Password</Label>
                          <Input
                            id="password"
                            type="text"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                            placeholder="Enter password for this page"
                          />
                        </div>
                      )}

                      {formData.visibility === "private" && (
                        <div className="space-y-2">
                          <Label htmlFor="requiredRole">Required Role</Label>
                          <Select
                            value={formData.requiredRole || "user"}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                requiredRole: value as "user" | "admin",
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Any Logged In User</SelectItem>
                              <SelectItem value="admin">Admin Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Custom Fields */}
                      <CustomFieldsEditor
                        contentType="page"
                        contentId={editingPage?.id}
                        values={formData.customFields || {}}
                        onChange={(fieldSlug, value) => {
                          setFormData({
                            ...formData,
                            customFields: {
                              ...formData.customFields,
                              [fieldSlug]: value,
                            },
                          });
                        }}
                      />

                      <div className="flex gap-4">
                        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                          <Save className="h-4 w-4 mr-2" />
                          {editingPage ? "Update Page" : "Create Page"}
                        </Button>
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                        {editingPage && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.open(`/${editingPage.slug}`, "_blank")}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-16 text-center">
                    <p className="text-muted-foreground">
                      Select a page to edit or create a new one
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Image Selector Modal */}
      <ImageSelector
        open={imageSelectorOpen}
        onOpenChange={setImageSelectorOpen}
        onSelect={(url) => {
          const imageMarkdown = `\n![Image](${url})\n`;
          setFormData({
            ...formData,
            content: formData.content + imageMarkdown
          });
        }}
      />
    </div>
  );
}
