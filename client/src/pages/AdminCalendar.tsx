import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";

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

export default function AdminCalendar() {
  const { data: posts = [], isLoading } = trpc.blog.list.useQuery();

  // Filter scheduled posts and map to calendar events
  const events = posts
    .filter((post: any) => post.status === "scheduled" && post.scheduledPublishAt)
    .map((post: any) => ({
      id: post.id,
      title: post.title,
      start: new Date(post.scheduledPublishAt),
      end: new Date(post.scheduledPublishAt),
      resource: post,
    }));

  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: "#dc2626",
        borderRadius: "4px",
        opacity: 0.9,
        color: "white",
        border: "none",
        display: "block",
      },
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading calendar...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/blog">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <CalendarIcon className="h-8 w-8" />
                Scheduled Posts Calendar
              </h1>
              <p className="text-muted-foreground mt-1">
                View and manage your scheduled blog posts
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Scheduled</CardDescription>
              <CardTitle className="text-3xl">{events.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-3xl">
                {events.filter((e: any) => {
                  const now = new Date();
                  const eventDate = new Date(e.start);
                  return (
                    eventDate.getMonth() === now.getMonth() &&
                    eventDate.getFullYear() === now.getFullYear()
                  );
                }).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Next 7 Days</CardDescription>
              <CardTitle className="text-3xl">
                {events.filter((e: any) => {
                  const now = new Date();
                  const eventDate = new Date(e.start);
                  const diffTime = eventDate.getTime() - now.getTime();
                  const diffDays = diffTime / (1000 * 60 * 60 * 24);
                  return diffDays >= 0 && diffDays <= 7;
                }).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Calendar */}
        <Card>
          <CardContent className="p-6">
            <div style={{ height: "600px" }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={(event: any) => {
                  window.location.href = `/admin/blog?edit=${event.id}`;
                }}
                views={["month", "week", "day", "agenda"]}
                defaultView="month"
              />
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Posts List */}
        {events.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Scheduled Posts</CardTitle>
              <CardDescription>
                Posts scheduled for publication in chronological order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events
                  .sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime())
                  .slice(0, 10)
                  .map((event: any) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => (window.location.href = `/admin/blog?edit=${event.id}`)}
                    >
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Scheduled for {format(new Date(event.start), "PPpp")}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {events.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Scheduled Posts</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any posts scheduled for publication yet.
              </p>
              <Link href="/admin/blog">
                <Button>Create a Post</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
