import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle, Download, AlertCircle, Plus, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Checkbox } from "@/components/ui/checkbox";

interface ImportProgress {
  total: number;
  imported: number;
  skipped: number;
  failed: number;
  currentPost?: string;
}

export default function AdminImport() {
  const [siteUrl, setSiteUrl] = useState("");
  const [step, setStep] = useState<'input' | 'transformation' | 'preview' | 'mapping' | 'importing'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress>({
    total: 0,
    imported: 0,
    skipped: 0,
    failed: 0,
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, number>>({});
  const [tagMap, setTagMap] = useState<Record<string, number>>({});
  const [previewPosts, setPreviewPosts] = useState<any[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [wpCategories, setWpCategories] = useState<any[]>([]);
  const [wpTags, setWpTags] = useState<any[]>([]);
  const [createMissingCats, setCreateMissingCats] = useState(true);
  const [createMissingTags, setCreateMissingTags] = useState(true);
  const [transformationRules, setTransformationRules] = useState<Array<{ find: string; replace: string }>>([]);

  // Mutations
  const importPostMutation = trpc.wordpressImport.importPost.useMutation();
  const createCategoryMutation = trpc.blogCategory.create.useMutation();
  const createTagMutation = trpc.blogTag.create.useMutation();
  const createHistoryMutation = trpc.importHistory.create.useMutation();
  const updateHistoryMutation = trpc.importHistory.update.useMutation();

  // Fetch local categories and tags
  const { data: localCategories = [], refetch: refetchCategories } = trpc.blogCategory.list.useQuery();
  const { data: localTags = [], refetch: refetchTags } = trpc.blogTag.list.useQuery();

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const fetchPreview = async () => {
    if (!siteUrl) {
      alert("Please enter a WordPress site URL");
      return;
    }

    setIsLoading(true);
    try {
      // Fetch first 10 posts for preview
      const postsResponse = await fetch(
        `${siteUrl.replace(/\/$/, '')}/wp-json/wp/v2/posts?per_page=10&_embed=true`
      );
      if (!postsResponse.ok) throw new Error("Failed to fetch posts");
      const posts = await postsResponse.json();

      // Fetch all posts count
      const allPostsResponse = await fetch(
        `${siteUrl.replace(/\/$/, '')}/wp-json/wp/v2/posts?per_page=100&_embed=true`
      );
      if (!allPostsResponse.ok) throw new Error("Failed to fetch all posts");
      const allPostsData = await allPostsResponse.json();

      // Fetch categories
      const catsResponse = await fetch(
        `${siteUrl.replace(/\/$/, '')}/wp-json/wp/v2/categories?per_page=100`
      );
      const cats = catsResponse.ok ? await catsResponse.json() : [];

      // Fetch tags
      const tagsResponse = await fetch(
        `${siteUrl.replace(/\/$/, '')}/wp-json/wp/v2/tags?per_page=100`
      );
      const tags = tagsResponse.ok ? await tagsResponse.json() : [];

      setPreviewPosts(posts);
      setAllPosts(allPostsData);
      setWpCategories(cats);
      setWpTags(tags);
      setStep('transformation');
    } catch (error: any) {
      alert(`Failed to fetch preview: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const proceedToMapping = () => {
    // Build initial category and tag maps
    const newCategoryMap: Record<string, number> = {};
    const newTagMap: Record<string, number> = {};

    for (const wpCat of wpCategories) {
      const localCat = localCategories.find(
        (c: any) => c.name.toLowerCase() === wpCat.name.toLowerCase()
      );
      if (localCat) {
        newCategoryMap[wpCat.id.toString()] = localCat.id;
      }
    }

    for (const wpTag of wpTags) {
      const localTag = localTags.find(
        (t: any) => t.name.toLowerCase() === wpTag.name.toLowerCase()
      );
      if (localTag) {
        newTagMap[wpTag.id.toString()] = localTag.id;
      }
    }

    setCategoryMap(newCategoryMap);
    setTagMap(newTagMap);
    setStep('mapping');
  };

  const startImport = async () => {
    setIsImporting(true);
    setStep('importing');
    setProgress({ total: 0, imported: 0, skipped: 0, failed: 0 });
    setLogs([]);

    let historyId: number | null = null;
    const startTime = Date.now();

    try {
      addLog(`Starting import of ${allPosts.length} posts...`);
      setProgress((prev) => ({ ...prev, total: allPosts.length }));

      // Create import history record
      try {
        const historyResult = await createHistoryMutation.mutateAsync({
          sourceUrl: siteUrl,
          transformationRules: transformationRules.filter(r => r.find && r.replace),
        });
        historyId = historyResult;
        addLog(`Import session started (ID: ${historyId})`);
      } catch (error: any) {
        addLog(`Warning: Could not create import history: ${error.message}`);
      }

      // Create missing categories if enabled
      if (createMissingCats) {
        for (const wpCat of wpCategories) {
          if (!categoryMap[wpCat.id.toString()]) {
            addLog(`Creating category: ${wpCat.name}`);
            try {
              const result = await createCategoryMutation.mutateAsync({
                name: wpCat.name,
                slug: wpCat.slug,
              });
              categoryMap[wpCat.id.toString()] = result.id;
            } catch (error: any) {
              addLog(`Failed to create category ${wpCat.name}: ${error.message}`);
            }
          }
        }
        await refetchCategories();
      }

      // Create missing tags if enabled
      if (createMissingTags) {
        for (const wpTag of wpTags) {
          if (!tagMap[wpTag.id.toString()]) {
            addLog(`Creating tag: ${wpTag.name}`);
            try {
              const result = await createTagMutation.mutateAsync({
                name: wpTag.name,
                slug: wpTag.slug,
              });
              tagMap[wpTag.id.toString()] = result.id;
            } catch (error: any) {
              addLog(`Failed to create tag ${wpTag.name}: ${error.message}`);
            }
          }
        }
        await refetchTags();
      }

      // Import posts
      for (const wpPost of allPosts) {
        setProgress((prev) => ({ ...prev, currentPost: wpPost.title.rendered }));
        addLog(`Importing: ${wpPost.title.rendered}`);

        try {
          const result = await importPostMutation.mutateAsync({
            siteUrl,
            wpPost,
            categoryMap,
            tagMap,
            transformationRules: transformationRules.filter(r => r.find && r.replace),
          });

          if (result.success) {
            setProgress((prev) => ({ ...prev, imported: prev.imported + 1 }));
            addLog(`✓ Imported: ${wpPost.title.rendered}`);
          } else {
            setProgress((prev) => ({ ...prev, skipped: prev.skipped + 1 }));
            addLog(`⊘ Skipped (already exists): ${wpPost.title.rendered}`);
          }
        } catch (error: any) {
          setProgress((prev) => ({ ...prev, failed: prev.failed + 1 }));
          addLog(`✗ Failed: ${wpPost.title.rendered} - ${error.message}`);
        }
      }

      addLog("Import complete!");

      // Update import history with final stats
      if (historyId) {
        try {
          await updateHistoryMutation.mutateAsync({
            id: historyId,
            status: 'completed' as const,
            totalPosts: allPosts.length,
            importedPosts: progress.imported,
            skippedPosts: progress.skipped,
            failedPosts: progress.failed,
            completedAt: new Date(),
          });
          addLog(`Import history updated (ID: ${historyId})`);
        } catch (error: any) {
          addLog(`Warning: Could not update import history: ${error.message}`);
        }
      }
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
      alert(`Import failed: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const progressPercentage =
    progress.total > 0
      ? ((progress.imported + progress.skipped + progress.failed) / progress.total) * 100
      : 0;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">WordPress Import</h1>
            <p className="text-muted-foreground mt-1">
              Import blog posts from your WordPress site
            </p>
          </div>
          <Link href="/admin/blog">
            <Button variant="outline">Back to Blog</Button>
          </Link>
        </div>

        {/* Step 1: Input URL */}
        {step === 'input' && (
          <>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Before importing:</strong> Make sure your WordPress site has the REST API enabled
                (enabled by default on modern WordPress). We'll show you a preview of your posts before importing.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Step 1: Enter WordPress URL</CardTitle>
                <CardDescription>
                  Enter your WordPress site URL to preview posts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">WordPress Site URL</label>
                  <Input
                    type="url"
                    placeholder="https://yoursite.com"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the full URL of your WordPress site (e.g., https://example.com)
                  </p>
                </div>

                <Button
                  onClick={fetchPreview}
                  disabled={isLoading || !siteUrl}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Fetching Preview...
                    </>
                  ) : (
                    <>
                      Preview Posts
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 2: Transformation Rules */}
        {step === 'transformation' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Content Transformation Rules (Optional)</CardTitle>
                <CardDescription>
                  Define find-and-replace rules to automatically update content during import.
                  Common uses: update old domain URLs, fix image paths, or replace deprecated shortcodes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {transformationRules.map((rule, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Find (e.g., https://old-domain.com)"
                        value={rule.find}
                        onChange={(e) => {
                          const newRules = [...transformationRules];
                          newRules[index].find = e.target.value;
                          setTransformationRules(newRules);
                        }}
                      />
                      <Input
                        placeholder="Replace with (e.g., https://new-domain.com)"
                        value={rule.replace}
                        onChange={(e) => {
                          const newRules = [...transformationRules];
                          newRules[index].replace = e.target.value;
                          setTransformationRules(newRules);
                        }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newRules = transformationRules.filter((_, i) => i !== index);
                        setTransformationRules(newRules);
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={() => {
                    setTransformationRules([...transformationRules, { find: '', replace: '' }]);
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transformation Rule
                </Button>

                {transformationRules.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {transformationRules.length} rule(s) will be applied to all post content during import.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setStep('input')}>
                    Back
                  </Button>
                  <Button onClick={() => setStep('preview')} className="flex-1">
                    Continue to Preview
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 3: Preview Posts */}
        {step === 'preview' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Preview Posts</CardTitle>
                <CardDescription>
                  Found {allPosts.length} posts. Here are the first {previewPosts.length}:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {previewPosts.map((post) => (
                    <div key={post.id} className="flex gap-4 p-3 border rounded-lg">
                      {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                        <img
                          src={post._embedded['wp:featuredmedia'][0].source_url}
                          alt={post.title.rendered}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{post.title.rendered}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt.rendered.replace(/<[^>]*>/g, '')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Published: {new Date(post.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('input')}>
                    Back
                  </Button>
                  <Button onClick={proceedToMapping} className="flex-1">
                    Continue to Mapping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 3: Category/Tag Mapping */}
        {step === 'mapping' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Step 4: Category & Tag Mapping</CardTitle>
                <CardDescription>
                  Review how WordPress categories and tags will be mapped
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categories */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Categories ({wpCategories.length})</h3>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="create-cats"
                        checked={createMissingCats}
                        onCheckedChange={(checked) => setCreateMissingCats(checked as boolean)}
                      />
                      <label htmlFor="create-cats" className="text-sm cursor-pointer">
                        Auto-create missing categories
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                    {wpCategories.map((cat) => {
                      const isMapped = !!categoryMap[cat.id.toString()];
                      return (
                        <div key={cat.id} className="flex items-center justify-between text-sm">
                          <span>{cat.name}</span>
                          {isMapped ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4" />
                              Mapped
                            </span>
                          ) : (
                            <span className="text-yellow-600 flex items-center gap-1">
                              <Plus className="h-4 w-4" />
                              Will create
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Tags ({wpTags.length})</h3>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="create-tags"
                        checked={createMissingTags}
                        onCheckedChange={(checked) => setCreateMissingTags(checked as boolean)}
                      />
                      <label htmlFor="create-tags" className="text-sm cursor-pointer">
                        Auto-create missing tags
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                    {wpTags.map((tag) => {
                      const isMapped = !!tagMap[tag.id.toString()];
                      return (
                        <div key={tag.id} className="flex items-center justify-between text-sm">
                          <span>{tag.name}</span>
                          {isMapped ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4" />
                              Mapped
                            </span>
                          ) : (
                            <span className="text-yellow-600 flex items-center gap-1">
                              <Plus className="h-4 w-4" />
                              Will create
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('preview')}>
                    Back
                  </Button>
                  <Button onClick={startImport} disabled={isImporting} className="flex-1">
                    {isImporting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Starting Import...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Start Import
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 4: Importing */}
        {step === 'importing' && (
          <>
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Import Progress</CardTitle>
                {progress.currentPost && (
                  <CardDescription>Currently importing: {progress.currentPost}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progressPercentage} className="w-full" />

                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{progress.total}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-5 w-5" />
                      {progress.imported}
                    </div>
                    <div className="text-xs text-muted-foreground">Imported</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{progress.skipped}</div>
                    <div className="text-xs text-muted-foreground">Skipped</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600 flex items-center justify-center gap-1">
                      <XCircle className="h-5 w-5" />
                      {progress.failed}
                    </div>
                    <div className="text-xs text-muted-foreground">Failed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Import Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="text-foreground">
                      {log}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Standalone Script Info */}
        <Card>
          <CardHeader>
            <CardTitle>Long-Running Import Script</CardTitle>
            <CardDescription>
              For large imports (100+ posts), use the standalone script
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              If you have hundreds of posts, the browser-based import above may time out. Instead,
              use the standalone Node.js script that can run for hours:
            </p>
            <div className="bg-muted rounded-lg p-4 font-mono text-xs space-y-2">
              <div>$ cd /home/ubuntu/communityforce-website</div>
              <div>$ node scripts/import-wordpress.mjs https://yoursite.com</div>
            </div>
            <p className="text-xs text-muted-foreground">
              The script will run in the background and save progress. You can close your terminal
              and check back later.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
