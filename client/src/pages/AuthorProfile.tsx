import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Eye, Calendar, Twitter, Linkedin, Github, Globe } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

const ROLE_COLORS = {
  admin: "bg-red-100 text-red-800 border-red-300",
  editor: "bg-purple-100 text-purple-800 border-purple-300",
  author: "bg-blue-100 text-blue-800 border-blue-300",
  contributor: "bg-green-100 text-green-800 border-green-300",
  subscriber: "bg-gray-100 text-gray-800 border-gray-300",
};

export default function AuthorProfile() {
  const [, params] = useRoute("/author/:id");
  const authorId = params?.id ? parseInt(params.id) : 0;

  const { data: author, isLoading: authorLoading } = trpc.author.getProfile.useQuery(
    { authorId },
    { enabled: authorId > 0 }
  );

  const { data: posts = [], isLoading: postsLoading } = trpc.author.getPosts.useQuery(
    { authorId },
    { enabled: authorId > 0 }
  );

  const { data: stats } = trpc.author.getStats.useQuery(
    { authorId },
    { enabled: authorId > 0 }
  );

  if (authorLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="text-center">Loading author profile...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Author Not Found</h1>
            <p className="text-muted-foreground">
              The author you're looking for doesn't exist.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        {/* Author Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name || "Author"}
                className="h-24 w-24 rounded-full object-cover flex-shrink-0 border-2 border-border"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-12 w-12 text-primary" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-display text-3xl font-bold">{author.name}</h1>
                <Badge
                  variant="outline"
                  className={ROLE_COLORS[author.role as keyof typeof ROLE_COLORS]}
                >
                  {author.role}
                </Badge>
              </div>
              {author.email && (
                <p className="text-muted-foreground mb-2">{author.email}</p>
              )}
              {author.bio && (
                <p className="text-muted-foreground mb-4">{author.bio}</p>
              )}
              {(author.twitterUrl || author.linkedinUrl || author.githubUrl || author.websiteUrl) && (
                <div className="flex gap-3 mb-4">
                  {author.twitterUrl && (
                    <a href={author.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {author.linkedinUrl && (
                    <a href={author.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {author.githubUrl && (
                    <a href={author.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {author.websiteUrl && (
                    <a href={author.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                </div>
              )}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{stats?.totalPosts || 0} posts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{stats?.totalViews || 0} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined {new Date(author.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPosts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Published Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Published Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className="text-center py-8">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No published posts yet.
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post: any) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-4">
                        {post.coverImage && (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-24 h-24 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                            {post.readTimeMinutes && (
                              <span>{post.readTimeMinutes} min read</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
