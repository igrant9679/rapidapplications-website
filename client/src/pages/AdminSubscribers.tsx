import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Mail, Trash2, Users, UserCheck, UserX, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminSubscribers() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "unsubscribed">("all");

  const utils = trpc.useUtils();
  const { data: subscribers = [], isLoading } = trpc.subscriber.listAll.useQuery();

  const deleteMutation = trpc.subscriber.delete.useMutation({
    onSuccess: () => {
      utils.subscriber.listAll.invalidate();
      setDeleteId(null);
    },
  });

  const generateDigestMutation = trpc.subscriber.generateDigest.useMutation({
    onSuccess: (data: any) => {
      alert(data.message || "Digest generated successfully");
    },
    onError: (error) => {
      alert(`Failed to generate digest: ${error.message}`);
    },
  });

  const filteredSubscribers = subscribers.filter((sub: any) => {
    if (filter === "all") return true;
    return sub.status === filter;
  });

  const stats = {
    total: subscribers.length,
    active: subscribers.filter((s: any) => s.status === "active").length,
    unsubscribed: subscribers.filter((s: any) => s.status === "unsubscribed").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Email Subscribers</h1>
            <p className="text-muted-foreground mt-1">
              Manage your newsletter subscribers
            </p>
          </div>
          <Button
            onClick={() => generateDigestMutation.mutate()}
            disabled={generateDigestMutation.isPending || stats.active === 0}
          >
            <Send className="h-4 w-4 mr-2" />
            {generateDigestMutation.isPending ? "Generating..." : "Generate Weekly Digest"}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.unsubscribed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All ({stats.total})
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            onClick={() => setFilter("active")}
          >
            Active ({stats.active})
          </Button>
          <Button
            variant={filter === "unsubscribed" ? "default" : "outline"}
            onClick={() => setFilter("unsubscribed")}
          >
            Unsubscribed ({stats.unsubscribed})
          </Button>
        </div>

        {/* Subscribers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Subscribers List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading subscribers...
              </div>
            ) : filteredSubscribers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No subscribers found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Subscribed</TableHead>
                      <TableHead>Last Email</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscribers.map((subscriber: any) => (
                      <TableRow key={subscriber.id}>
                        <TableCell className="font-medium">
                          {subscriber.email}
                        </TableCell>
                        <TableCell>{subscriber.name || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              subscriber.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {subscriber.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {subscriber.subscribeSource || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(subscriber.subscribedAt), {
                            addSuffix: true,
                          })}
                        </TableCell>
                        <TableCell>
                          {subscriber.lastEmailSentAt
                            ? formatDistanceToNow(
                                new Date(subscriber.lastEmailSentAt),
                                { addSuffix: true }
                              )
                            : "Never"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(subscriber.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Subscriber</DialogTitle>
              <DialogDescription>
                Are you sure you want to permanently delete this subscriber? This
                action cannot be undone.
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
