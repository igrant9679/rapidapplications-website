import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Bell, MessageSquare, CheckCircle, Info } from "lucide-react";

export default function NotificationPreferences() {

  const utils = trpc.useUtils();
  
  const { data: preferences, isLoading } = trpc.notifications.getPreferences.useQuery();
  
  const [localPrefs, setLocalPrefs] = useState({
    notifyComments: true,
    notifyApprovals: true,
    notifyMentions: true,
    notifySystem: true,
  });
  
  // Update local state when data loads
  useState(() => {
    if (preferences) {
      setLocalPrefs(preferences);
    }
  });
  
  const updateMutation = trpc.notifications.updatePreferences.useMutation({
    onSuccess: () => {
      toast.success("Preferences Updated", {
        description: "Your notification preferences have been saved.",
      });
      utils.notifications.getPreferences.invalidate();
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
      });
    },
  });
  
  const handleSave = () => {
    updateMutation.mutate(localPrefs);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="container max-w-3xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Notification Preferences</h1>
          <p className="text-muted-foreground mt-2">
            Manage which notifications you want to receive
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              In-App Notifications
            </CardTitle>
            <CardDescription>
              Choose which types of notifications appear in your notification bell
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="comments" className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when someone comments on blog posts
                </p>
              </div>
              <Switch
                id="comments"
                checked={localPrefs.notifyComments}
                onCheckedChange={(checked) => 
                  setLocalPrefs(prev => ({ ...prev, notifyComments: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="approvals" className="text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approvals & Publishing
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when content is published or approved
                </p>
              </div>
              <Switch
                id="approvals"
                checked={localPrefs.notifyApprovals}
                onCheckedChange={(checked) => 
                  setLocalPrefs(prev => ({ ...prev, notifyApprovals: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="mentions" className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Mentions
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when someone mentions you (future feature)
                </p>
              </div>
              <Switch
                id="mentions"
                checked={localPrefs.notifyMentions}
                onCheckedChange={(checked) => 
                  setLocalPrefs(prev => ({ ...prev, notifyMentions: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="system" className="text-base flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  System Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive important system updates and announcements
                </p>
              </div>
              <Switch
                id="system"
                checked={localPrefs.notifySystem}
                onCheckedChange={(checked) => 
                  setLocalPrefs(prev => ({ ...prev, notifySystem: checked }))
                }
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
