import { trpc } from "@/lib/trpc";
import { useRoute } from "wouter";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Streamdown } from "streamdown";
import { useEffect } from "react";
import { generatePageStructuredData } from "@shared/structuredData";
import CustomFieldsDisplay from "@/components/CustomFieldsDisplay";

export default function CMSPage() {
  const [, params] = useRoute("/:slug");
  const slug = params?.slug || "";

  const { data: page, isLoading, error } = trpc.cms.getBySlug.useQuery({ slug });

  // Update document head with SEO meta tags
  useEffect(() => {
    if (!page) return;

    // Set page title
    document.title = `${page.title} | CommunityForce`;

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && page.metaDescription) {
      metaDescription.setAttribute("content", page.metaDescription);
    } else if (page.metaDescription) {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = page.metaDescription;
      document.head.appendChild(meta);
    }

    // Add JSON-LD structured data
    const structuredData = generatePageStructuredData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      metaDescription: page.metaDescription || undefined,
      updatedAt: new Date(page.updatedAt),
    });

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      document.title = "CommunityForce";
      // Remove structured data script
      const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(s => s.remove());
    };
  }, [page]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container max-w-4xl">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !page || page.status !== "published") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container max-w-4xl text-center space-y-6">
            <h1 className="text-4xl font-bold">Page Not Found</h1>
            <p className="text-lg text-muted-foreground">
              The page you're looking for doesn't exist or is not published.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-muted via-background to-muted py-16">
          <div className="container max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {page.title}
            </h1>
          </div>
        </section>

        {/* Page Content */}
        <section className="py-8 md:py-16">
          <div className="container max-w-4xl">
            <article className="prose prose-lg max-w-none dark:prose-invert">
              <Streamdown>{page.content}</Streamdown>
            </article>

            {/* Custom Fields */}
            <CustomFieldsDisplay contentType="page" contentId={page.id} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
