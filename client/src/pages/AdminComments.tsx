import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle, Check, X, AlertTriangle, Trash2, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

export default function AdminComments() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: allComments = [], isLoading: loadingAll } = trpc.comment.listAll.useQuery();
  const { data: pendingComments = [], isLoading: loadingPending } = trpc.comment.listPending.useQuery();

  const updateStatusMutation = trpc.comment.updateStatus.useMutation({
    onSuccess: () => {
      utils.comment.listAll.invalidate();
      utils.comment.listPending.invalidate();
    },
    onError: (error) => {
      console.error("Failed to update comment status:", error);
      alert("Failed to update comment status");
    },
  });

  const deleteCommentMutation = trpc.comment.delete.useMutation({
    onSuccess: () => {
      utils.comment.listAll.invalidate();
      utils.comment.listPending.invalidate();
      setDeleteDialogOpen(false);
      setSelectedCommentId(null);
    },
    onError: (error) => {
      console.error("Failed to delete comment:", error);
      alert("Failed to delete comment");
    },
  });

  const handleApprove = (id: number) => {
    updateStatusMutation.mutate({ id, status: "approved" });
  };

  const handleReject = (id: number) => {
    updateStatusMutation.mutate({ id, status: "rejected" });
  };

  const handleMarkAsSpam = (id: number) => {
    updateStatusMutation.mutate({ id, status: "spam" });
  };

  const handleDeleteClick = (id: number) => {
    setSelectedCommentId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCommentId) {
      deleteCommentMutation.mutate({ id: selectedCommentId });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "spam":
        return <Badge className="bg-orange-500">Spam</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderCommentCard = (comment: any) => (
    <Card key={comment.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{comment.authorName}</CardTitle>
              {getStatusBadge(comment.status)}
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{comment.authorEmail}</p>
              <p>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p>
              {comment.ipAddress && (
                <p className="font-mono text-xs">IP: {comment.ipAddress}</p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            On post:{" "}
            <Link href={`/blog/${comment.postSlug}`}>
              <span className="text-primary hover:underline inline-flex items-center gap-1">
                {comment.postTitle}
                <ExternalLink className="h-3 w-3" />
              </span>
            </Link>
          </p>
          <p className="whitespace-pre-wrap">{comment.content}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {comment.status !== "approved" && (
            <Button
              size="sm"
              variant="default"
              onClick={() => handleApprove(comment.id)}
              disabled={updateStatusMutation.isPending}
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
          )}
          {comment.status !== "rejected" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReject(comment.id)}
              disabled={updateStatusMutation.isPending}
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
          )}
          {comment.status !== "spam" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleMarkAsSpam(comment.id)}
              disabled={updateStatusMutation.isPending}
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Mark as Spam
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteClick(comment.id)}
            disabled={deleteCommentMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Comment Moderation</h1>
            <p className="text-muted-foreground">
              Review and manage blog post comments
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{allComments.length}</div>
            <p className="text-sm text-muted-foreground">Total Comments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-500">
              {pendingComments.length}
            </div>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-500">
              {allComments.filter((c) => c.status === "approved").length}
            </div>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-500">
              {allComments.filter((c) => c.status === "spam").length}
            </div>
            <p className="text-sm text-muted-foreground">Spam</p>
          </CardContent>
        </Card>
      </div>

      {/* Comments Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingComments.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Comments ({allComments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {loadingPending ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading pending comments...
            </div>
          ) : pendingComments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending comments to review</p>
              </CardContent>
            </Card>
          ) : (
            pendingComments.map(renderCommentCard)
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {loadingAll ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading all comments...
            </div>
          ) : allComments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No comments yet</p>
              </CardContent>
            </Card>
          ) : (
            allComments.map(renderCommentCard)
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
