import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { Loader2, Mail, Bell, CheckCircle2 } from "lucide-react";

interface NotificationPreferencesProps {
  email?: string;
  onEmailChange?: (email: string) => void;
}

export default function NotificationPreferences({ email: initialEmail, onEmailChange }: NotificationPreferencesProps) {

  const [email, setEmail] = useState(initialEmail || "");
  const [digestFrequency, setDigestFrequency] = useState<"daily" | "weekly" | "monthly" | "never">("weekly");
  const [contentTypes, setContentTypes] = useState<string[]>(["blog", "news", "updates"]);

  // Fetch preferences when email is provided
  const { data: preferences, isLoading } = trpc.subscriber.getPreferences.useQuery(
    { email },
    { enabled: !!email }
  );

  const updatePreferencesMutation = trpc.subscriber.updatePreferences.useMutation({
    onSuccess: () => {
      alert("Preferences updated successfully!");
    },
    onError: (error) => {
      alert(`Error: ${error.message || "Failed to update preferences"}`);
    },
  });

  // Load preferences when data is fetched
  useEffect(() => {
    if (preferences) {
      setDigestFrequency(preferences.digestFrequency);
      setContentTypes(preferences.contentTypes.split(","));
    }
  }, [preferences]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onEmailChange) {
      onEmailChange(email);
    }
  };

  const handleSavePreferences = () => {
    if (!email) {
      alert("Please enter your email address first");
      return;
    }

    updatePreferencesMutation.mutate({
      email,
      digestFrequency,
      contentTypes: contentTypes.join(","),
    });
  };

  const toggleContentType = (type: string) => {
    setContentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  if (!email) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notification Preferences
          </CardTitle>
          <CardDescription>
            Enter your email address to manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Continue</Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Digest Frequency
          </CardTitle>
          <CardDescription>
            Choose how often you'd like to receive email digests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={digestFrequency} onValueChange={(value: any) => setDigestFrequency(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily" className="font-normal cursor-pointer">
                Daily - Receive a digest every day
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly" className="font-normal cursor-pointer">
                Weekly - Receive a digest once a week (recommended)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly" className="font-normal cursor-pointer">
                Monthly - Receive a digest once a month
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="never" id="never" />
              <Label htmlFor="never" className="font-normal cursor-pointer">
                Never - Don't send me digests (only important updates)
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Content Types
          </CardTitle>
          <CardDescription>
            Select the types of content you'd like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="blog"
              checked={contentTypes.includes("blog")}
              onCheckedChange={() => toggleContentType("blog")}
            />
            <Label htmlFor="blog" className="font-normal cursor-pointer">
              Blog Posts - Latest articles and insights
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="news"
              checked={contentTypes.includes("news")}
              onCheckedChange={() => toggleContentType("news")}
            />
            <Label htmlFor="news" className="font-normal cursor-pointer">
              News & Announcements - Company updates and news
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="updates"
              checked={contentTypes.includes("updates")}
              onCheckedChange={() => toggleContentType("updates")}
            />
            <Label htmlFor="updates" className="font-normal cursor-pointer">
              Product Updates - New features and improvements
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="events"
              checked={contentTypes.includes("events")}
              onCheckedChange={() => toggleContentType("events")}
            />
            <Label htmlFor="events" className="font-normal cursor-pointer">
              Events & Webinars - Upcoming events and training
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button
          onClick={handleSavePreferences}
          disabled={updatePreferencesMutation.isPending}
        >
          {updatePreferencesMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save Preferences
        </Button>
        <p className="text-sm text-muted-foreground">
          Managing preferences for: <span className="font-medium">{email}</span>
        </p>
      </div>
    </div>
  );
}
