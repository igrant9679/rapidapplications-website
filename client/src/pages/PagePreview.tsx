import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Streamdown } from "streamdown";

export default function PagePreview() {
  const [, params] = useRoute("/preview/:token");
  const token = params?.token || "";

  const { data: page, isLoading, error } = trpc.cms.getByPreviewToken.useQuery(
    { token },
    { enabled: !!token }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Preview Not Available</AlertTitle>
              <AlertDescription>
                {error?.message || "This preview link is invalid or has expired."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Banner */}
      <div className="bg-amber-500 text-amber-950 py-2 px-4 text-center font-medium">
        <div className="container flex items-center justify-center gap-2">
          <span>Preview Mode</span>
          <Badge variant="secondary" className="bg-amber-100">
            {page.status}
          </Badge>
        </div>
      </div>

      {/* Page Content */}
      <div className="container py-12">
        <article className="prose prose-lg dark:prose-invert mx-auto">
          <h1>{page.title}</h1>
          {page.metaDescription && (
            <p className="lead text-muted-foreground">{page.metaDescription}</p>
          )}
          <Streamdown>{page.content}</Streamdown>
        </article>
      </div>
    </div>
  );
}
