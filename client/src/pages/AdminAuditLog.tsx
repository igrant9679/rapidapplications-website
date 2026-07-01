import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Activity, User, FileText, MessageSquare, Shield, Calendar, Download } from "lucide-react";
import { format } from "date-fns";

const actionIcons: Record<string, any> = {
  "blog:create": FileText,
  "blog:update": FileText,
  "blog:delete": FileText,
  "cms:create": FileText,
  "cms:update": FileText,
  "cms:delete": FileText,
  "comment:approve": MessageSquare,
  "comment:reject": MessageSquare,
  "user:role_change": Shield,
};

const actionColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "blog:create": "default",
  "blog:update": "secondary",
  "blog:delete": "destructive",
  "cms:create": "default",
  "cms:update": "secondary",
  "cms:delete": "destructive",
  "comment:approve": "default",
  "comment:reject": "destructive",
  "user:role_change": "secondary",
};

export default function AdminAuditLog() {
  const [actionFilter, setActionFilter] = useState<string>("");
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data: logs = [], isLoading } = trpc.auditLog.list.useQuery({
    action: actionFilter || undefined,
    entityType: entityTypeFilter || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    limit: 100,
  });

  const { data: stats } = trpc.auditLog.stats.useQuery();

  const utils = trpc.useUtils();

  const handleExport = async (format: 'csv' | 'json') => {
    const result = await utils.auditLog.export.fetch({
      format,
      action: actionFilter || undefined,
      entityType: entityTypeFilter || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });

    // Create download
    const blob = new Blob([result.data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setActionFilter("");
    setEntityTypeFilter("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground">
            Track all user actions and system events
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalLogs}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last 24 Hours</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentActivityCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(stats.userCounts).length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Action Types</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(stats.actionCounts).length}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter audit logs by action, entity type, or date range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Actions</SelectItem>
                  <SelectItem value="blog:create">Blog Create</SelectItem>
                  <SelectItem value="blog:update">Blog Update</SelectItem>
                  <SelectItem value="blog:delete">Blog Delete</SelectItem>
                  <SelectItem value="cms:create">CMS Create</SelectItem>
                  <SelectItem value="cms:update">CMS Update</SelectItem>
                  <SelectItem value="cms:delete">CMS Delete</SelectItem>
                  <SelectItem value="comment:approve">Comment Approve</SelectItem>
                  <SelectItem value="comment:reject">Comment Reject</SelectItem>
                  <SelectItem value="user:role_change">Role Change</SelectItem>
                </SelectContent>
              </Select>

              <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="blog_post">Blog Post</SelectItem>
                  <SelectItem value="cms_page">CMS Page</SelectItem>
                  <SelectItem value="comment">Comment</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
              />

              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
              />

              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              
              <Button variant="outline" onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              
              <Button variant="outline" onClick={() => handleExport('json')}>
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              {logs.length} events found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading...</p>
            ) : logs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No audit logs found</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => {
                  const Icon = actionIcons[log.action] || Activity;
                  const color = actionColors[log.action] || "outline";

                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Icon className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={color}>{log.action}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {log.entityType}
                            {log.entityId && ` #${log.entityId}`}
                          </span>
                        </div>
                        
                        <p className="text-sm font-medium">
                          {log.user?.name || "Unknown User"} ({log.user?.email})
                        </p>
                        
                        {log.details && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {JSON.stringify(log.details, null, 2).substring(0, 200)}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{format(new Date(log.createdAt), "PPpp")}</span>
                          {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
