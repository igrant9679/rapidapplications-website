import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import CategoryBreadcrumbs from "@/components/CategoryBreadcrumbs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function BlogCategory() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const { data, isLoading, error } = trpc.blog.getByCategory.useQuery({
    categorySlug,
    page,
    pageSize,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-20">
          <div className="container">
            <div className="text-center">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data?.category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-20">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
              <p className="text-muted-foreground mb-8">
                The category you're looking for doesn't exist.
              </p>
              <Link href="/blog">
                <Button>Back to Blog</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { category, posts, total, subcategories, totalPages } = data;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Category Header */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              {/* Category Breadcrumb */}
              <div className="mb-6 flex justify-center">
                <CategoryBreadcrumbs postCategories={[category]} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
              {category.description && (
                <p className="text-lg text-muted-foreground mb-6">{category.description}</p>
              )}
              <p className="text-sm text-muted-foreground">
                {total} {total === 1 ? "post" : "posts"} in this category
              </p>
            </div>
          </div>
        </section>

        {/* Subcategories */}
        {subcategories && subcategories.length > 0 && (
          <section className="py-8 border-b">
            <div className="container">
              <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
              <div className="flex flex-wrap gap-2">
                {subcategories.map((sub) => (
                  <Link key={sub.id} href={`/blog/category/${sub.slug}`}>
                    <Button variant="outline" size="sm">
                      {sub.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Posts Grid */}
        <section className="py-16">
          <div className="container">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts found in this category.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {posts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                        {post.coverImage && (
                          <div className="aspect-video overflow-hidden rounded-t-lg">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-muted-foreground mb-4 line-clamp-3">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                              </span>
                              {post.readTimeMinutes && (
                                <span>{post.readTimeMinutes} min read</span>
                              )}
                            </div>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground px-4">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
