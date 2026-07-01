import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Clock, Loader2 } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BlogSeries() {
  const [, params] = useRoute("/series/:slug");
  const slug = params?.slug || "";

  const { data, isLoading, error } = trpc.blogSeries.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Series Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The series you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { series, posts } = data;
  const publishedPosts = posts.filter((p) => p.status === "published");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-muted via-background to-muted py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <BookOpen className="h-4 w-4" />
                <span>BLOG SERIES</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {series.title}
              </h1>
              {series.description && (
                <p className="text-lg text-muted-foreground">
                  {series.description}
                </p>
              )}
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>
                    {publishedPosts.length}{" "}
                    {publishedPosts.length === 1 ? "Post" : "Posts"}
                  </span>
                </div>
                {publishedPosts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(
                        publishedPosts[0].publishedAt!
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Posts List */}
        <section className="py-12">
          <div className="container max-w-4xl">
            {publishedPosts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No posts yet
                  </h3>
                  <p className="text-muted-foreground">
                    Posts in this series will appear here once published.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {publishedPosts.map((post, index) => (
                  <Card
                    key={post.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            <Link href={`/blog/${post.slug}`}>
                              <a className="hover:text-primary transition-colors">
                                {post.title}
                              </a>
                            </Link>
                          </CardTitle>
                          {post.excerpt && (
                            <CardDescription className="text-base">
                              {post.excerpt}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="ghost" className="group">
                          Read Post
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
