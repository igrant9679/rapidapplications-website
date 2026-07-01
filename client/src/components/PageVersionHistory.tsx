import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { History, RotateCcw, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PageVersionHistoryProps {
  pageId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PageVersionHistory({
  pageId,
  open,
  onOpenChange,
}: PageVersionHistoryProps) {
  const [restoreId, setRestoreId] = useState<number | null>(null);
  const utils = trpc.useUtils();

  const { data: versions, isLoading } = trpc.cms.versions.useQuery(
    { pageId },
    { enabled: open }
  );

  const restoreMutation = trpc.cms.restore.useMutation({
    onSuccess: () => {
      utils.cms.list.invalidate();
      utils.cms.versions.invalidate();
      setRestoreId(null);
      onOpenChange(false);
    },
  });

  const handleRestore = (versionId: number) => {
    restoreMutation.mutate({ pageId, versionId });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History
            </DialogTitle>
            <DialogDescription>
              View and restore previous versions of this page
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading version history...
            </div>
          ) : !versions || versions.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No version history available
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((version: any) => (
                  <TableRow key={version.id}>
                    <TableCell className="font-mono">
                      v{version.versionNumber}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {version.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          version.status === "published"
                            ? "default"
                            : version.status === "draft"
                            ? "secondary"
                            : version.status === "scheduled"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {version.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(version.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRestoreId(version.id)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={restoreId !== null} onOpenChange={() => setRestoreId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Version?</DialogTitle>
            <DialogDescription>
              This will restore the page to the selected version. The current
              state will be saved as a new version before restoring.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreId(null)}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={() => restoreId && handleRestore(restoreId)}
              disabled={restoreMutation.isPending}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              {restoreMutation.isPending ? "Restoring..." : "Restore"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
