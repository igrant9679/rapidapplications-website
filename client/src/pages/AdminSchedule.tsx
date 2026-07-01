import { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, FileText, Layout } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  type: "blog" | "cms";
  status: string;
}

export default function AdminSchedule() {
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [date, setDate] = useState(new Date());

  // Fetch scheduled blog posts
  const { data: blogPosts = [] } = trpc.blog.listAll.useQuery();
  
  // Fetch scheduled CMS pages
  const { data: cmsPages = [] } = trpc.cms.list.useQuery();

  // Convert to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    const blogEvents: CalendarEvent[] = blogPosts
      .filter(post => post.scheduledPublishAt)
      .map(post => ({
        id: post.id,
        title: `📝 ${post.title}`,
        start: new Date(post.scheduledPublishAt!),
        end: new Date(post.scheduledPublishAt!),
        type: "blog" as const,
        status: post.status,
      }));

    const cmsEvents: CalendarEvent[] = cmsPages
      .filter(page => page.scheduledPublishAt)
      .map(page => ({
        id: page.id,
        title: `📄 ${page.title}`,
        start: new Date(page.scheduledPublishAt!),
        end: new Date(page.scheduledPublishAt!),
        type: "cms" as const,
        status: page.status,
      }));

    return [...blogEvents, ...cmsEvents];
  }, [blogPosts, cmsPages]);

  // Count scheduled items
  const scheduledBlogCount = blogPosts.filter(p => p.status === "scheduled").length;
  const scheduledCmsCount = cmsPages.filter(p => p.status === "scheduled").length;

  const eventStyleGetter = (event: CalendarEvent) => {
    const style: React.CSSProperties = {
      backgroundColor: event.type === "blog" ? "#3b82f6" : "#8b5cf6",
      borderRadius: "4px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
      padding: "2px 5px",
    };
    return { style };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Content Schedule</h1>
          <p className="text-muted-foreground">
            View and manage scheduled blog posts and pages
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledBlogCount}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting publication
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Pages</CardTitle>
              <Layout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledCmsCount}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting publication
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledBlogCount + scheduledCmsCount}</div>
              <p className="text-xs text-muted-foreground">
                Content items
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Content Calendar</CardTitle>
            <CardDescription>
              Scheduled blog posts and pages. Click on an event to view details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Legend */}
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-500" />
                  <span>Blog Posts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-purple-500" />
                  <span>Pages</span>
                </div>
              </div>

              {/* Calendar */}
              <div className="h-[600px] bg-background rounded-lg p-4">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  view={view}
                  onView={(newView) => setView(newView as "month" | "week" | "day")}
                  date={date}
                  onNavigate={(newDate) => setDate(newDate)}
                  eventPropGetter={eventStyleGetter}
                  onSelectEvent={(event) => {
                    if (event.type === "blog") {
                      window.location.href = `/admin/blog?edit=${event.id}`;
                    } else {
                      window.location.href = `/admin/cms?edit=${event.id}`;
                    }
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Items List */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Publications</CardTitle>
            <CardDescription>
              Next scheduled items to be published
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events
                .filter(e => e.start > new Date())
                .sort((a, b) => a.start.getTime() - b.start.getTime())
                .slice(0, 5)
                .map(event => (
                  <div key={`${event.type}-${event.id}`} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {event.type === "blog" ? (
                        <FileText className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Layout className="h-5 w-5 text-purple-500" />
                      )}
                      <div>
                        <p className="font-medium">{event.title.substring(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(event.start, "PPP 'at' p")}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                ))}
              {events.filter(e => e.start > new Date()).length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No upcoming scheduled items
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
