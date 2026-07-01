import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageUpload from "@/components/ImageUpload";
import RichTextEditor from "@/components/RichTextEditor";
import SEOMetadataForm from "@/components/SEOMetadataForm";
import "@/components/tiptap.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ImageSelector from "@/components/ImageSelector";
import { CustomFieldsEditor } from "@/components/CustomFieldsEditor";

type BlogPostForm = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: "draft" | "published" | "scheduled" | "archived";
  scheduledPublishAt?: Date | null;
  tags: string;
  metaDescription: string;
  readTimeMinutes: number;
  categoryIds: number[];
  tagIds: number[];
  metaTitle: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  customFields?: Record<string, any>;
};

const emptyForm: BlogPostForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  status: "draft",
  scheduledPublishAt: null,
  tags: "",
  metaDescription: "",
  readTimeMinutes: 5,
  categoryIds: [],
  tagIds: [],
  metaTitle: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
};

export default function AdminBlog() {

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BlogPostForm>(emptyForm);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [imageSelectorOpen, setImageSelectorOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<"draft" | "published" | "archived">("draft");
  const [bulkCategoryIds, setBulkCategoryIds] = useState<number[]>([]);
  const [bulkTagIds, setBulkTagIds] = useState<number[]>([]);
  const [showMyPostsOnly, setShowMyPostsOnly] = useState(false);

  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.blog.listAll.useQuery();
  const { data: categories } = trpc.blogCategory.list.useQuery();
  const { data: tags } = trpc.blogTag.list.useQuery();
  const { data: currentUser } = trpc.auth.me.useQuery();
  
  // Filter posts based on "My Posts" toggle
  const filteredPosts = showMyPostsOnly && currentUser
    ? posts?.filter(post => post.authorId === currentUser.id)
    : posts;

  const createMutation = trpc.blog.create.useMutation({
    onSuccess: async (result: any) => {
      // Assign categories and tags to the new post
      const postId = result.insertId || result[0]?.insertId;
      if (formData.categoryIds.length > 0) {
        await bulkAssignCategoriesMutation.mutateAsync({
          postIds: [postId],
          categoryIds: formData.categoryIds,
        });
      }
      if (formData.tagIds.length > 0) {
        await bulkAssignTagsMutation.mutateAsync({
          postIds: [postId],
          tagIds: formData.tagIds,
        });
      }
      // Save custom field values
      if (formData.customFields && Object.keys(formData.customFields).length > 0) {
        // Get all custom fields to map slugs to IDs
        const allFields = await utils.customFields.listFields.fetch({ contentType: "post" });
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
            entityType: "post",
            entityId: postId,
            values,
          });
        }
      }
      alert("Blog post created successfully");
      utils.blog.listAll.invalidate();
      setIsEditing(false);
      setFormData(emptyForm);
    },
    onError: (error) => {
      alert(`Failed to create blog post: ${error.message}`);
    },
  });

  const updateMutation = trpc.blog.update.useMutation({
    onSuccess: async () => {
      // Update categories and tags
      if (formData.id) {
        if (formData.categoryIds.length > 0) {
          await bulkAssignCategoriesMutation.mutateAsync({
            postIds: [formData.id],
            categoryIds: formData.categoryIds,
          });
        }
        if (formData.tagIds.length > 0) {
          await bulkAssignTagsMutation.mutateAsync({
            postIds: [formData.id],
            tagIds: formData.tagIds,
          });
        }
        // Save custom field values
        if (formData.customFields && Object.keys(formData.customFields).length > 0) {
          const allFields = await utils.customFields.listFields.fetch({ contentType: "post" });
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
              entityType: "post",
              entityId: formData.id,
              values,
            });
          }
        }
      }
      alert("Blog post updated successfully");
      utils.blog.listAll.invalidate();
      setIsEditing(false);
      setFormData(emptyForm);
    },
    onError: (error) => {
      alert(`Failed to update blog post: ${error.message}`);
    },
  });

  const deleteMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      alert("Blog post deleted successfully");
      utils.blog.listAll.invalidate();
    },
    onError: (error) => {
      alert(`Failed to delete blog post: ${error.message}`);
    },
  });

  const createCategoryMutation = trpc.blogCategory.create.useMutation({
    onSuccess: () => {
      utils.blogCategory.list.invalidate();
      setNewCategoryName("");
    },
  });

  const createTagMutation = trpc.blogTag.create.useMutation({
    onSuccess: () => {
      utils.blogTag.list.invalidate();
      setNewTagName("");
    },
  });

  const bulkUpdateStatusMutation = trpc.blog.bulkUpdateStatus.useMutation({
    onSuccess: () => {
      alert("Posts updated successfully");
      utils.blog.listAll.invalidate();
      setSelectedPosts([]);
      setShowBulkDialog(false);
      setBulkAction("");
    },
    onError: (error) => {
      alert(`Failed to update posts: ${error.message}`);
    },
  });

  const bulkAssignCategoriesMutation = trpc.blog.bulkAssignCategories.useMutation({
    onSuccess: () => {
      alert("Categories assigned successfully");
      utils.blog.listAll.invalidate();
      setSelectedPosts([]);
      setShowBulkDialog(false);
      setBulkAction("");
    },
    onError: (error) => {
      alert(`Failed to assign categories: ${error.message}`);
    },
  });

  const bulkAssignTagsMutation = trpc.blog.bulkAssignTags.useMutation({
    onSuccess: () => {
      alert("Tags assigned successfully");
      utils.blog.listAll.invalidate();
      setSelectedPosts([]);
      setShowBulkDialog(false);
      setBulkAction("");
    },
    onError: (error) => {
      alert(`Failed to assign tags: ${error.message}`);
    },
  });

  const bulkSetFieldValuesMutation = trpc.customFields.bulkSetFieldValues.useMutation();

  const bulkDeleteMutation = trpc.blog.bulkDelete.useMutation({
    onSuccess: () => {
      alert("Posts deleted successfully");
      utils.blog.listAll.invalidate();
      setSelectedPosts([]);
      setShowBulkDialog(false);
      setBulkAction("");
    },
    onError: (error) => {
      alert(`Failed to delete posts: ${error.message}`);
    },
  });

  // Export functionality
  const [exportFormat, setExportFormat] = useState<"json" | "xml" | null>(null);
  const { data: exportData } = trpc.blog.exportAll.useQuery(
    { format: exportFormat! },
    { enabled: exportFormat !== null }
  );

  useEffect(() => {
    if (exportData && exportFormat) {
      const blob = new Blob([exportData.data], { 
        type: exportFormat === "json" ? "application/json" : "application/xml" 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = exportData.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert(`Blog posts exported successfully as ${exportFormat.toUpperCase()}`);
      setExportFormat(null);
    }
  }, [exportData, exportFormat]);

  const handleExport = (format: "json" | "xml") => {
    setExportFormat(format);
  };

  // Load categories and tags when editing a post
  const { data: postTaxonomy } = trpc.blogTag.getForPost.useQuery(
    { postId: formData.id! },
    { enabled: !!formData.id }
  );

  useEffect(() => {
    if (postTaxonomy && formData.id) {
      setFormData(prev => ({
        ...prev,
        categoryIds: postTaxonomy.categories.map(c => c.id),
        tagIds: postTaxonomy.tags.map(t => t.id),
      }));
    }
  }, [postTaxonomy, formData.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.id) {
      // Ensure id is defined for update
      const { id, categoryIds, tagIds, ...updates } = formData;
      updateMutation.mutate({ id, ...updates });
    } else {
      const { id, categoryIds, tagIds, ...createData } = formData;
      createMutation.mutate(createData);
    }
  };

  const handleEdit = (post: any) => {
    setFormData({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      coverImage: post.coverImage || "",
      status: post.status,
      tags: post.tags || "",
      metaDescription: post.metaDescription || "",
      readTimeMinutes: post.readTimeMinutes || 5,
      categoryIds: [],
      tagIds: [],
      metaTitle: post.metaTitle || "",
      ogTitle: post.ogTitle || "",
      ogDescription: post.ogDescription || "",
      ogImage: post.ogImage || "",
    });
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(emptyForm);
  };

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    });
  };

  const handleCategoryToggle = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const handleTagToggle = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    createCategoryMutation.mutate({
      name: newCategoryName,
      slug,
    });
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    const slug = newTagName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    createTagMutation.mutate({
      name: newTagName,
      slug,
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Not published";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="container max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold">Blog Management</h1>
              <p className="text-muted-foreground mt-2">
                Create and manage blog posts
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <a href="/admin/import">Import from WordPress</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/admin/media">Media Library</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/admin/calendar">Calendar</a>
              </Button>
              <Button variant="outline" onClick={() => handleExport("json")}>
                Export JSON
              </Button>
              <Button variant="outline" onClick={() => handleExport("xml")}>
                Export XML
              </Button>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              )}
            </div>
          </div>
          
          {/* My Posts Filter */}
          {!isEditing && currentUser && currentUser.role !== 'admin' && (
            <div className="mb-4">
              <Button
                variant={showMyPostsOnly ? "default" : "outline"}
                onClick={() => setShowMyPostsOnly(!showMyPostsOnly)}
              >
                My Posts {showMyPostsOnly && filteredPosts && `(${filteredPosts.length})`}
              </Button>
            </div>
          )}

          {/* Bulk Actions Bar */}
          {!isEditing && selectedPosts.length > 0 && (
            <Card className="mb-4 bg-accent/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">
                      {selectedPosts.length} post{selectedPosts.length > 1 ? 's' : ''} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPosts([])}
                    >
                      Clear Selection
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={bulkAction} onValueChange={setBulkAction}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Bulk Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="status">Update Status</SelectItem>
                        <SelectItem value="categories">Assign Categories</SelectItem>
                        <SelectItem value="tags">Assign Tags</SelectItem>
                        <SelectItem value="delete">Delete Posts</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => setShowBulkDialog(true)}
                      disabled={!bulkAction}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {formData.id ? "Edit Blog Post" : "Create New Blog Post"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        required
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug * (URL-friendly)</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        required
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: any) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
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

                    {/* Scheduled Publish Date */}
                    {formData.status === "scheduled" && (
                      <div className="space-y-2">
                        <Label htmlFor="scheduledPublishAt">Scheduled Publish Date & Time *</Label>
                        <DatePicker
                          selected={formData.scheduledPublishAt}
                          onChange={(date: Date | null) => setFormData({ ...formData, scheduledPublishAt: date })}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          minDate={new Date()}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholderText="Select date and time"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Post will be automatically published at this time
                        </p>
                      </div>
                    )}

                    {/* Read Time */}
                    <div className="space-y-2">
                      <Label htmlFor="readTime">Read Time (minutes)</Label>
                      <Input
                        id="readTime"
                        type="number"
                        value={formData.readTimeMinutes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            readTimeMinutes: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-2 md:col-span-2">
                      <Label>Cover Image</Label>
                      <div className="flex gap-2">
                        <ImageUpload
                          onUploadComplete={(url) =>
                            setFormData({ ...formData, coverImage: url })
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setImageSelectorOpen(true)}
                        >
                          Select from Library
                        </Button>
                      </div>
                      {formData.coverImage && (
                        <div className="mt-2">
                          <Label className="text-sm text-muted-foreground">Current Image URL:</Label>
                          <Input
                            value={formData.coverImage}
                            onChange={(e) =>
                              setFormData({ ...formData, coverImage: e.target.value })
                            }
                            placeholder="Or enter URL manually"
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>

                    {/* Categories */}
                    <div className="space-y-2 md:col-span-2">
                      <Label>Categories</Label>
                      <div className="border rounded-md p-4 space-y-3">
                        {categories && categories.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {categories.map((category) => (
                              <div key={category.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`cat-${category.id}`}
                                  checked={formData.categoryIds.includes(category.id)}
                                  onCheckedChange={() => handleCategoryToggle(category.id)}
                                />
                                <label
                                  htmlFor={`cat-${category.id}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {category.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No categories yet</p>
                        )}
                        <div className="flex gap-2 pt-2 border-t">
                          <Input
                            placeholder="New category name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleCreateCategory();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleCreateCategory}
                            disabled={!newCategoryName.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2 md:col-span-2">
                      <Label>Tags</Label>
                      <div className="border rounded-md p-4 space-y-3">
                        {tags && tags.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                              <div key={tag.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`tag-${tag.id}`}
                                  checked={formData.tagIds.includes(tag.id)}
                                  onCheckedChange={() => handleTagToggle(tag.id)}
                                />
                                <label
                                  htmlFor={`tag-${tag.id}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {tag.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No tags yet</p>
                        )}
                        <div className="flex gap-2 pt-2 border-t">
                          <Input
                            placeholder="New tag name"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleCreateTag();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleCreateTag}
                            disabled={!newTagName.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="excerpt">Excerpt (preview text)</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) =>
                          setFormData({ ...formData, excerpt: e.target.value })
                        }
                        rows={3}
                        placeholder="A brief summary that appears in blog listings..."
                      />
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="metaDescription">
                        Meta Description (SEO, max 160 chars)
                      </Label>
                      <Textarea
                        id="metaDescription"
                        value={formData.metaDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metaDescription: e.target.value,
                          })
                        }
                        rows={2}
                        maxLength={160}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.metaDescription.length}/160 characters
                      </p>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="content">Content *</Label>
                      <RichTextEditor
                        content={formData.content}
                        onChange={(html) => setFormData({ ...formData, content: html })}
                        placeholder="Write your blog post content..."
                      />
                    </div>

                    {/* SEO Metadata */}
                    <div className="md:col-span-2">
                      <SEOMetadataForm
                        metaTitle={formData.metaTitle}
                        metaDescription={formData.metaDescription}
                        ogTitle={formData.ogTitle}
                        ogDescription={formData.ogDescription}
                        ogImage={formData.ogImage}
                        onMetaTitleChange={(value) => setFormData({ ...formData, metaTitle: value })}
                        onMetaDescriptionChange={(value) => setFormData({ ...formData, metaDescription: value })}
                        onOgTitleChange={(value) => setFormData({ ...formData, ogTitle: value })}
                        onOgDescriptionChange={(value) => setFormData({ ...formData, ogDescription: value })}
                        onOgImageChange={(value) => setFormData({ ...formData, ogImage: value })}
                      />
                    </div>
                  </div>

                  {/* Custom Fields */}
                  <CustomFieldsEditor
                    contentType="post"
                    contentId={formData.id}
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
                    <Button
                      type="submit"
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {formData.id ? "Update Post" : "Create Post"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {isLoading ? (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">Loading posts...</p>
                  </CardContent>
                </Card>
              ) : filteredPosts && filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedPosts.includes(post.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPosts([...selectedPosts, post.id]);
                            } else {
                              setSelectedPosts(selectedPosts.filter(id => id !== post.id));
                            }
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{post.title}</h3>
                            <Badge
                              variant={
                                post.status === "published"
                                  ? "default"
                                  : post.status === "draft"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {post.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            /{post.slug}
                          </p>
                          {post.excerpt && (
                            <p className="text-muted-foreground mb-3">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Published: {formatDate(post.publishedAt)}</span>
                            <span>•</span>
                            <span>{post.readTimeMinutes} min read</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">
                      No blog posts yet. Click "New Post" to create your first post.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Image Selector Modal */}
      <ImageSelector
        open={imageSelectorOpen}
        onOpenChange={setImageSelectorOpen}
        onSelect={(url) => {
          setFormData({ ...formData, coverImage: url });
        }}
      />

      {/* Bulk Action Dialog */}
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bulkAction === "status" && "Update Status"}
              {bulkAction === "categories" && "Assign Categories"}
              {bulkAction === "tags" && "Assign Tags"}
              {bulkAction === "delete" && "Delete Posts"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {bulkAction === "status" && (
              <div>
                <label className="text-sm font-medium">New Status</label>
                <Select value={bulkStatus} onValueChange={(v: any) => setBulkStatus(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {bulkAction === "categories" && (
              <div>
                <label className="text-sm font-medium">Select Categories</label>
                <div className="space-y-2 mt-2">
                  {categories?.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={bulkCategoryIds.includes(cat.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setBulkCategoryIds([...bulkCategoryIds, cat.id]);
                          } else {
                            setBulkCategoryIds(bulkCategoryIds.filter(id => id !== cat.id));
                          }
                        }}
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {bulkAction === "tags" && (
              <div>
                <label className="text-sm font-medium">Select Tags</label>
                <div className="space-y-2 mt-2">
                  {tags?.map((tag) => (
                    <label key={tag.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={bulkTagIds.includes(tag.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setBulkTagIds([...bulkTagIds, tag.id]);
                          } else {
                            setBulkTagIds(bulkTagIds.filter(id => id !== tag.id));
                          }
                        }}
                      />
                      {tag.name}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {bulkAction === "delete" && (
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete {selectedPosts.length} post{selectedPosts.length > 1 ? 's' : ''}? This action cannot be undone.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (bulkAction === "status") {
                  bulkUpdateStatusMutation.mutate({ postIds: selectedPosts, status: bulkStatus });
                } else if (bulkAction === "categories") {
                  bulkAssignCategoriesMutation.mutate({ postIds: selectedPosts, categoryIds: bulkCategoryIds });
                } else if (bulkAction === "tags") {
                  bulkAssignTagsMutation.mutate({ postIds: selectedPosts, tagIds: bulkTagIds });
                } else if (bulkAction === "delete") {
                  bulkDeleteMutation.mutate({ postIds: selectedPosts });
                }
              }}
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
