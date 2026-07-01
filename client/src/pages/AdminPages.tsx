import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Calendar,
  CheckSquare,
  Archive,
  Copy,
  History,
  Eye,
  FileText,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { SortableRow } from "@/components/SortableRow";
import { PageVersionHistory } from "@/components/PageVersionHistory";

export default function AdminPages() {
  const [, setLocation] = useLocation();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [scheduleId, setScheduleId] = useState<number | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [historyPageId, setHistoryPageId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkAction, setBulkAction] = useState<string>("");
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  const utils = trpc.useUtils();
  const { data: pages = [], isLoading } = trpc.cms.list.useQuery();

  const deleteMutation = trpc.cms.delete.useMutation({
    onSuccess: () => {
      utils.cms.list.invalidate();
      setDeleteId(null);
    },
  });

  const updateMutation = trpc.cms.update.useMutation({
    onSuccess: () => {
      utils.cms.list.invalidate();
      setScheduleId(null);
      setScheduledDate("");
    },
  });

  const duplicateMutation = trpc.cms.duplicate.useMutation({
    onSuccess: () => {
      utils.cms.list.invalidate();
    },
  });

  const reorderMutation = trpc.cms.reorder.useMutation({
    onSuccess: () => {
      utils.cms.list.invalidate();
    },
  });

  const generatePreviewMutation = trpc.cms.generatePreviewToken.useMutation({
    onSuccess: (data) => {
      const previewUrl = `${window.location.origin}/preview/${data.token}`;
      window.open(previewUrl, '_blank');
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredPages.findIndex((p: any) => p.id === active.id);
      const newIndex = filteredPages.findIndex((p: any) => p.id === over.id);

      const reorderedPages = arrayMove(filteredPages, oldIndex, newIndex);
      const pageOrders = reorderedPages.map((page: any, index: number) => ({
        id: page.id,
        displayOrder: index,
      }));

      reorderMutation.mutate({ pageOrders });
    }
  };

  const handleStatusChange = (id: number, status: string) => {
    if (status === "scheduled") {
      setScheduleId(id);
    } else {
      updateMutation.mutate({
        id,
        status: status as "draft" | "published" | "archived",
        scheduledPublishAt: undefined,
      });
    }
  };

  const handleSchedulePublish = () => {
    if (!scheduleId || !scheduledDate) return;

    updateMutation.mutate({
      id: scheduleId,
      status: "scheduled",
      scheduledPublishAt: new Date(scheduledDate),
    });
  };

  const filteredPages = pages.filter((page: any) => {
    if (statusFilter === "all") return true;
    return page.status === statusFilter;
  });

  const stats = {
    total: pages.length,
    published: pages.filter((p: any) => p.status === "published").length,
    draft: pages.filter((p: any) => p.status === "draft").length,
    scheduled: pages.filter((p: any) => p.status === "scheduled").length,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      published: "default",
      draft: "secondary",
      scheduled: "outline",
      archived: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Bulk selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredPages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPages.map((p: any) => p.id)));
    }
  };

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkAction = (action: string) => {
    setBulkAction(action);
    setShowBulkConfirm(true);
  };

  const executeBulkAction = async () => {
    const ids = Array.from(selectedIds);
    
    if (bulkAction === "publish") {
      for (const id of ids) {
        await updateMutation.mutateAsync({
          id,
          status: "published",
          scheduledPublishAt: undefined,
        });
      }
    } else if (bulkAction === "archive") {
      for (const id of ids) {
        await updateMutation.mutateAsync({
          id,
          status: "archived",
        });
      }
    } else if (bulkAction === "delete") {
      for (const id of ids) {
        await deleteMutation.mutateAsync({ id });
      }
    }

    setSelectedIds(new Set());
    setShowBulkConfirm(false);
    setBulkAction("");
    utils.cms.list.invalidate();
  };

  const getBulkActionText = () => {
    const count = selectedIds.size;
    if (bulkAction === "publish") {
      return `Are you sure you want to publish ${count} page${count > 1 ? 's' : ''}?`;
    } else if (bulkAction === "archive") {
      return `Are you sure you want to archive ${count} page${count > 1 ? 's' : ''}?`;
    } else if (bulkAction === "delete") {
      return `Are you sure you want to delete ${count} page${count > 1 ? 's' : ''}? This action cannot be undone.`;
    }
    return "";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">CMS Pages</h1>
            <p className="text-muted-foreground mt-1">
              Manage your website pages and content
            </p>
          </div>
          <Button onClick={() => setLocation("/admin/cms")}>
            <Plus className="h-4 w-4 mr-2" />
            New Page
          </Button>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedIds.size > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    {selectedIds.size} page{selectedIds.size > 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("publish")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Publish
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("archive")}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleBulkAction("delete")}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedIds(new Set())}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Eye className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.published}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Pencil className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.draft}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.scheduled}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
          >
            All ({stats.total})
          </Button>
          <Button
            variant={statusFilter === "published" ? "default" : "outline"}
            onClick={() => setStatusFilter("published")}
          >
            Published ({stats.published})
          </Button>
          <Button
            variant={statusFilter === "draft" ? "default" : "outline"}
            onClick={() => setStatusFilter("draft")}
          >
            Drafts ({stats.draft})
          </Button>
          <Button
            variant={statusFilter === "scheduled" ? "default" : "outline"}
            onClick={() => setStatusFilter("scheduled")}
          >
            Scheduled ({stats.scheduled})
          </Button>
        </div>

        {/* Pages Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pages List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading pages...
              </div>
            ) : filteredPages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pages found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setLocation("/admin/cms")}
                >
                  Create Your First Page
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8"></TableHead>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedIds.size === filteredPages.length && filteredPages.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <SortableContext
                      items={filteredPages.map((p: any) => p.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <TableBody>
                        {filteredPages.map((page: any) => (
                          <SortableRow key={page.id} id={page.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(page.id)}
                            onCheckedChange={() => toggleSelect(page.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {page.title}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          /{page.slug}
                        </TableCell>
                        <TableCell>{getStatusBadge(page.status)}</TableCell>
                        <TableCell>
                          {page.publishedAt
                            ? formatDistanceToNow(new Date(page.publishedAt), {
                                addSuffix: true,
                              })
                            : page.scheduledPublishAt
                            ? `Scheduled for ${new Date(
                                page.scheduledPublishAt
                              ).toLocaleDateString()}`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(page.updatedAt), {
                            addSuffix: true,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {/* Status Change */}
                            <Select
                              value={page.status}
                              onValueChange={(value) =>
                                handleStatusChange(page.id, value)
                              }
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">
                                  Published
                                </SelectItem>
                                <SelectItem value="scheduled">
                                  Schedule
                                </SelectItem>
                                <SelectItem value="archived">
                                  Archived
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            {/* Preview */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(`/${page.slug}`, "_blank")
                              }
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>

                            {/* Edit */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setLocation(`/admin/cms?id=${page.id}`)
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            {/* Duplicate */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => duplicateMutation.mutate({ id: page.id })}
                              title="Duplicate page"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>

                            {/* History */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setHistoryPageId(page.id)}
                              title="View version history"
                            >
                              <History className="h-4 w-4" />
                            </Button>

                            {/* Preview */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                generatePreviewMutation.mutate({ pageId: page.id });
                              }}
                              title="Generate preview link"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {/* Delete */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(page.id)}
                              title="Delete page"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </SortableRow>
                    ))}
                  </TableBody>
                </SortableContext>
              </Table>
            </DndContext>
          </div>
            )}
          </CardContent>
        </Card>

        {/* Bulk Action Confirmation Dialog */}
        <Dialog open={showBulkConfirm} onOpenChange={setShowBulkConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Bulk Action</DialogTitle>
              <DialogDescription>
                {getBulkActionText()}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBulkConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant={bulkAction === "delete" ? "destructive" : "default"}
                onClick={executeBulkAction}
                disabled={updateMutation.isPending || deleteMutation.isPending}
              >
                {updateMutation.isPending || deleteMutation.isPending
                  ? "Processing..."
                  : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Schedule Publishing Dialog */}
        <Dialog
          open={scheduleId !== null}
          onOpenChange={() => setScheduleId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Publishing</DialogTitle>
              <DialogDescription>
                Choose when this page should be automatically published.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Publish Date & Time</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setScheduleId(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleSchedulePublish}
                disabled={!scheduledDate || updateMutation.isPending}
              >
                {updateMutation.isPending ? "Scheduling..." : "Schedule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Page</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this page? This action cannot be
                undone.
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
      {/* Version History Dialog */}
      {historyPageId && (
        <PageVersionHistory
          pageId={historyPageId}
          open={historyPageId !== null}
          onOpenChange={(open) => !open && setHistoryPageId(null)}
        />
      )}
    </DashboardLayout>
  );
}
