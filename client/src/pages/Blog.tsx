import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Calendar, Clock, Tag, Filter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import SearchFilters from "@/components/SearchFilters";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<number | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedTag, setSelectedTag] = useState<number | undefined>();
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  
  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");
    if (search) {
      setSearchQuery(search);
    }
  }, []);

  // Determine if filters are active
  const hasFilters = !!searchQuery || selectedAuthor !== undefined || selectedCategory !== undefined || selectedTag !== undefined || startDate !== undefined || endDate !== undefined;

  // Use search if any filters are active
  const { data: searchResults, isLoading: searchLoading } = trpc.blog.search.useQuery(
    {
      query: searchQuery || undefined,
      authorId: selectedAuthor,
      categoryId: selectedCategory,
      tagId: selectedTag,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page: 1,
      limit: 100,
    },
    { enabled: hasFilters }
  );
  
  const { data: posts, isLoading: listLoading } = trpc.blog.list.useQuery(
    undefined,
    { enabled: !hasFilters }
  );
  
  const isLoading = searchLoading || listLoading;
  const displayPosts = hasFilters ? searchResults?.posts : posts;
  const { data: categories } = trpc.blogCategory.listFlat.useQuery();
  const { data: tags } = trpc.blogTag.list.useQuery();

  // Filter posts based on selected category and tags
  // No need for client-side filtering since we're using backend search

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedAuthor(undefined);
    setSelectedCategory(undefined);
    setSelectedTag(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    window.history.pushState({}, "", "/blog");
  };

  // Get all authors for filter dropdown
  const { data: allAuthors } = trpc.userManagement.listUsers.useQuery();

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-muted via-background to-muted py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                <span>INSIGHTS & UPDATES</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                RapidApplications Blog
              </h1>
              <p className="text-lg text-muted-foreground">
                Insights on grants management, scholarships, AI automation, and
                federal digital transformation from our team of experts.
              </p>
              
              {/* Search Bar */}
              <div className="mt-8">
                <SearchBar 
                  variant="default"
                  placeholder="Search articles..."
                  onSearch={(query) => {
                    setSearchQuery(query);
                    if (query) {
                      window.history.pushState({}, "", `/blog?search=${encodeURIComponent(query)}`);
                    } else {
                      window.history.pushState({}, "", "/blog");
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Filters Section */}
        <section className="py-8 border-b border-border">
          <div className="container">
            <SearchFilters
              authorId={selectedAuthor}
              categoryId={selectedCategory}
              tagId={selectedTag}
              startDate={startDate}
              endDate={endDate}
              onAuthorChange={setSelectedAuthor}
              onCategoryChange={setSelectedCategory}
              onTagChange={setSelectedTag}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onClearFilters={clearFilters}
              authors={allAuthors}
              categories={categories}
              tags={tags}
            />
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted" />
                    <CardContent className="p-6 space-y-4">
                      <div className="h-6 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : displayPosts && displayPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                      {post.coverImage && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-6 space-y-4">
                        {/* Title */}
                        <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-muted-foreground line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground pt-4 border-t border-border">
                          {/* Author Byline */}
                          {post.authorName && (
                            <div>
                              By{" "}
                              <Link href={`/author/${post.authorId}`}>
                                <span className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer">
                                  {post.authorName}
                                </span>
                              </Link>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(post.publishedAt)}</span>
                            </div>
                            {post.readTimeMinutes && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{post.readTimeMinutes} min read</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : hasFilters ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  No blog posts match your selected filters.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  No blog posts published yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
