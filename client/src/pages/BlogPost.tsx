import { trpc } from "@/lib/trpc";
import { useRoute } from "wouter";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Streamdown } from "streamdown";
import { useEffect } from "react";
import CommentSection from "@/components/CommentSection";
import RelatedPosts from "@/components/RelatedPosts";
import NewsletterSignup from "@/components/NewsletterSignup";
import SocialShare from "@/components/SocialShare";
import CustomFieldsDisplay from "@/components/CustomFieldsDisplay";
import CategoryBreadcrumbs from "@/components/CategoryBreadcrumbs";
import SeriesNavigation from "@/components/SeriesNavigation";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery({ slug });

  // Update document head with SEO meta tags
  useEffect(() => {
    if (!post) return;

    // Set page title
    document.title = `${post.title} | RapidApplications Blog`;

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", post.metaDescription || post.excerpt || "");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = post.metaDescription || post.excerpt || "";
      document.head.appendChild(meta);
    }

    // Open Graph tags
    const ogTags = [
      { property: "og:title", content: post.title },
      { property: "og:description", content: post.metaDescription || post.excerpt || "" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${window.location.origin}/blog/${post.slug}` },
      { property: "og:image", content: post.coverImage || `${window.location.origin}/images/og-default.jpg` },
      { property: "article:published_time", content: post.publishedAt ? new Date(post.publishedAt).toISOString() : "" },
      { property: "article:author", content: "RapidApplications Team" },
    ];

    ogTags.forEach(({ property, content }) => {
      if (!content) return;
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) {
        tag.setAttribute("content", content);
      } else {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        tag.setAttribute("content", content);
        document.head.appendChild(tag);
      }
    });

    // Twitter Card tags
    const twitterTags = [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: post.title },
      { name: "twitter:description", content: post.metaDescription || post.excerpt || "" },
      { name: "twitter:image", content: post.coverImage || `${window.location.origin}/images/og-default.jpg` },
    ];

    twitterTags.forEach(({ name, content }) => {
      if (!content) return;
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (tag) {
        tag.setAttribute("content", content);
      } else {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        tag.setAttribute("content", content);
        document.head.appendChild(tag);
      }
    });

    // JSON-LD Structured Data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.metaDescription || post.excerpt || "",
      "image": post.coverImage || `${window.location.origin}/images/og-default.jpg`,
      "datePublished": post.publishedAt ? new Date(post.publishedAt).toISOString() : "",
      "dateModified": post.updatedAt ? new Date(post.updatedAt).toISOString() : "",
      "author": {
        "@type": "Organization",
        "name": "RapidApplications",
        "url": window.location.origin
      },
      "publisher": {
        "@type": "Organization",
        "name": "RapidApplications",
        "url": window.location.origin,
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/logo.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${window.location.origin}/blog/${post.slug}`
      },
      "keywords": post.tags || "",
      "articleBody": post.content,
      "wordCount": post.content.split(/\s+/).length,
      "timeRequired": `PT${post.readTimeMinutes || 5}M`
    };

    // Remove existing JSON-LD script if present
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new JSON-LD script
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      document.title = "RapidApplications";
    };
  }, [post]);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container max-w-4xl">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-64 bg-muted rounded" />
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

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container max-w-4xl text-center space-y-6">
            <h1 className="text-4xl font-bold">Blog Post Not Found</h1>
            <p className="text-lg text-muted-foreground">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
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
            <Link href="/blog">
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>

            <div className="space-y-6">
              {/* Category Breadcrumbs */}
              {post.categories && post.categories.length > 0 && (
                <CategoryBreadcrumbs postCategories={post.categories} />
              )}
              
              {/* Categories and Tags */}
              <div className="flex flex-wrap gap-2">
                {post.categories && post.categories.length > 0 && (
                  post.categories.map((category) => (
                    <Link key={category.id} href={`/blog/category/${category.slug}`}>
                      <Badge variant="default" className="cursor-pointer hover:bg-primary/80">
                        {category.name}
                      </Badge>
                    </Link>
                  ))
                )}
                {post.tags && post.tags.length > 0 && (
                  post.tags.map((tag) => (
                    <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag.name}
                      </Badge>
                    </Link>
                  ))
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-col gap-3">
                {/* Author Byline */}
                {post.authorName && (
                  <div className="text-muted-foreground">
                    By{" "}
                    <Link href={`/author/${post.authorId}`}>
                      <span className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer">
                        {post.authorName}
                      </span>
                    </Link>
                  </div>
                )}
                
                <div className="flex items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  {post.readTimeMinutes && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTimeMinutes} min read</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-lg text-muted-foreground">{post.excerpt}</p>
              )}
            </div>
          </div>
        </section>

        {/* Cover Image */}
        {post.coverImage && (
          <section className="py-8">
            <div className="container max-w-4xl">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </section>
        )}

        {/* Blog Content */}
        <section className="py-8 md:py-16">
          <div className="container max-w-4xl">
            <article className="prose prose-lg max-w-none dark:prose-invert">
              <Streamdown>{post.content}</Streamdown>
            </article>

            {/* Social Share */}
            <div className="border-y border-border py-6 my-8">
              <SocialShare
                url={window.location.href}
                title={post.title}
                description="Share this article with your network"
                variant="default"
              />
            </div>

            {/* Series Navigation */}
            <SeriesNavigation postId={post.id} />

            {/* Custom Fields */}
            <CustomFieldsDisplay contentType="post" contentId={post.id} />

            {/* Comments Section */}
            <CommentSection postId={post.id} />

            {/* Newsletter Signup */}
            <div className="mt-12">
              <NewsletterSignup 
                source="blog-post"
                variant="default"
                title="Stay Updated"
                description="Subscribe to get notified when we publish new content like this."
              />
            </div>

            {/* Related Posts */}
            <div className="mt-16">
              <RelatedPosts postId={post.id} limit={3} />
            </div>
          </div>
        </section>

        {/* Back to Blog CTA */}
        <section className="py-16 bg-muted/50">
          <div className="container max-w-4xl text-center space-y-6">
            <h2 className="text-2xl font-bold">Read More Insights</h2>
            <p className="text-muted-foreground">
              Explore more articles on grants management, AI automation, and
              federal digital transformation.
            </p>
            <Link href="/blog">
              <Button size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Posts
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
