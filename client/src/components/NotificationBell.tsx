import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Bell, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "wouter";

export function NotificationBell() {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Poll for unread count every 30 seconds
  const { data: unreadCount = 0, refetch: refetchCount } = trpc.notifications.getUnreadCount.useQuery(undefined, {
    refetchInterval: 30000, // 30 seconds
  });

  // Get notifications list when dropdown opens
  const { data: notifications = [], refetch: refetchList } = trpc.notifications.list.useQuery(undefined, {
    enabled: isOpen,
  });

  const markReadMutation = trpc.notifications.markRead.useMutation({
    onSuccess: () => {
      refetchCount();
      refetchList();
    },
  });

  const markAllReadMutation = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => {
      refetchCount();
      refetchList();
    },
  });

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    if (notification.isRead === 0) {
      markReadMutation.mutate({ id: notification.id });
    }

    // Navigate to link if available
    if (notification.link) {
      setLocation(notification.link);
      setIsOpen(false);
    }
  };

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-semibold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[500px] overflow-y-auto">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="h-7 text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground text-sm">
            No notifications yet
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                  notification.isRead === 0 ? "bg-accent/5" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{notification.title}</p>
                      {notification.isRead === 0 && (
                        <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {notification.isRead === 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        markReadMutation.mutate({ id: notification.id });
                      }}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
