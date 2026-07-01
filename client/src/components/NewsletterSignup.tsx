import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

interface NewsletterSignupProps {
  source?: string;
  variant?: "default" | "compact" | "inline";
  title?: string;
  description?: string;
}

export default function NewsletterSignup({ 
  source = "unknown",
  variant = "default",
  title = "Subscribe to Our Newsletter",
  description = "Get the latest updates and insights delivered to your inbox.",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const subscribeMutation = trpc.subscriber.subscribe.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setStatus("success");
        setMessage(data.message || "Successfully subscribed!");
        setEmail("");
        setName("");
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to subscribe");
      }
    },
    onError: (error) => {
      setStatus("error");
      setMessage(error.message || "Failed to subscribe. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email");
      return;
    }

    setStatus("idle");
    subscribeMutation.mutate({
      email: email.trim(),
      name: name.trim() || undefined,
      subscribeSource: source,
    });
  };

  if (variant === "inline") {
    return (
      <div className="flex flex-col sm:flex-row gap-2 max-w-md">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          disabled={subscribeMutation.isPending}
        />
        <Button 
          onClick={handleSubmit}
          disabled={subscribeMutation.isPending}
          className="whitespace-nowrap"
        >
          <Mail className="h-4 w-4 mr-2" />
          {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
        </Button>
        {status === "success" && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>{message}</span>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>{message}</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="bg-muted/30 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={subscribeMutation.isPending}
            required
          />
          <Button 
            type="submit"
            disabled={subscribeMutation.isPending}
            className="w-full"
          >
            {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        {status === "success" && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>{message}</span>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>{message}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-6 w-6 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={subscribeMutation.isPending}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribeMutation.isPending}
              required
              maxLength={320}
            />
          </div>

          <Button 
            type="submit"
            disabled={subscribeMutation.isPending}
            className="w-full"
          >
            <Mail className="h-4 w-4 mr-2" />
            {subscribeMutation.isPending ? "Subscribing..." : "Subscribe to Newsletter"}
          </Button>

          {status === "success" && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-md">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
