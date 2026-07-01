import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  ExternalLink,
  FileText,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminImportHistory() {
  const { data: historyList, isLoading } = trpc.importHistory.list.useQuery();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      completed: "default",
      failed: "destructive",
      in_progress: "secondary",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  const calculateDuration = (startedAt: Date | string, completedAt: Date | string | null) => {
    if (!completedAt) return "In progress...";
    const start = new Date(startedAt).getTime();
    const end = new Date(completedAt).getTime();
    const durationMs = end - start;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Link href="/admin/blog">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Blog
                  </Button>
                </Link>
              </div>
              <h1 className="text-4xl font-bold">WordPress Import History</h1>
              <p className="text-muted-foreground mt-2">
                Track all WordPress import sessions and their results
              </p>
            </div>
            <Link href="/admin/import">
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                New Import
              </Button>
            </Link>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading import history...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!historyList || historyList.length === 0) && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Import History</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't imported any WordPress content yet.
                </p>
                <Link href="/admin/import">
                  <Button>Start Your First Import</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* History List */}
          {!isLoading && historyList && historyList.length > 0 && (
            <div className="space-y-4">
              {historyList.map((record: any) => (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getStatusIcon(record.status)}
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">
                            {record.sourceUrl}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <span>Imported by {record.importerName || "Unknown"}</span>
                            <span>•</span>
                            <span>{formatDate(record.startedAt)}</span>
                            {record.completedAt && (
                              <>
                                <span>•</span>
                                <span>Duration: {calculateDuration(record.startedAt, record.completedAt)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(record.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-primary">
                          {record.totalPosts || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Posts</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
                        <div className="text-2xl font-bold text-green-600">
                          {record.importedPosts || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Imported</div>
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-3">
                        <div className="text-2xl font-bold text-yellow-600">
                          {record.skippedPosts || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Skipped</div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3">
                        <div className="text-2xl font-bold text-red-600">
                          {record.failedPosts || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Failed</div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {record.errorMessage && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
                        <p className="text-sm text-destructive font-medium">Error:</p>
                        <p className="text-sm text-destructive/80 mt-1">{record.errorMessage}</p>
                      </div>
                    )}

                    {/* Transformation Rules */}
                    {record.transformationRules && record.transformationRules.length > 0 && (
                      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                          Transformation Rules Applied:
                        </p>
                        <div className="space-y-1">
                          {record.transformationRules.map((rule: any, index: number) => (
                            <div key={index} className="text-xs text-blue-800 dark:text-blue-200 font-mono">
                              {rule.find} → {rule.replace}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <a
                        href={record.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex"
                      >
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Source
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
