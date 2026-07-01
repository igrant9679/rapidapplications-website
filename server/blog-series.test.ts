import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("Blog Series", () => {
  let testAuthorId: number;
  let testSeriesId: number;
  let testPost1Id: number;
  let testPost2Id: number;
  let testPost3Id: number;

  beforeAll(async () => {
    // Create test author
    const openId = `test-series-author-${Date.now()}`;
    await db.upsertUser({
      openId,
      email: `series-author-${Date.now()}@test.com`,
      name: "Series Test Author",
      role: "admin",
    });
    const author = await db.getUserByOpenId(openId);
    if (!author) throw new Error("Failed to create test author");
    testAuthorId = author.id;

    // Create test posts
    testPost1Id = await db.createBlogPost({
      title: `Series Test Post 1 ${Date.now()}`,
      slug: `series-test-1-${Date.now()}`,
      content: "Content for post 1",
      excerpt: "Excerpt 1",
      authorId: testAuthorId,
      status: "published",
      publishedAt: new Date(),
      readTimeMinutes: 5,
    });

    testPost2Id = await db.createBlogPost({
      title: `Series Test Post 2 ${Date.now()}`,
      slug: `series-test-2-${Date.now()}`,
      content: "Content for post 2",
      excerpt: "Excerpt 2",
      authorId: testAuthorId,
      status: "published",
      publishedAt: new Date(),
      readTimeMinutes: 5,
    });

    testPost3Id = await db.createBlogPost({
      title: `Series Test Post 3 ${Date.now()}`,
      slug: `series-test-3-${Date.now()}`,
      content: "Content for post 3",
      excerpt: "Excerpt 3",
      authorId: testAuthorId,
      status: "published",
      publishedAt: new Date(),
      readTimeMinutes: 5,
    });
  });

  it("should create a blog series", async () => {
    testSeriesId = await db.createBlogSeries({
      title: `Test Series ${Date.now()}`,
      slug: `test-series-${Date.now()}`,
      description: "A test series",
      status: "published",
    });

    expect(testSeriesId).toBeGreaterThan(0);
  });

  it("should get series by ID", async () => {
    const series = await db.getBlogSeriesById(testSeriesId);
    
    expect(series).toBeDefined();
    expect(series?.id).toBe(testSeriesId);
    expect(series?.title).toContain("Test Series");
  });

  it("should add posts to series", async () => {
    await db.addPostToSeries(testSeriesId, testPost1Id, 1);
    await db.addPostToSeries(testSeriesId, testPost2Id, 2);
    await db.addPostToSeries(testSeriesId, testPost3Id, 3);

    const posts = await db.getSeriesPosts(testSeriesId);
    
    expect(posts).toHaveLength(3);
    expect(posts[0].id).toBe(testPost1Id);
    expect(posts[1].id).toBe(testPost2Id);
    expect(posts[2].id).toBe(testPost3Id);
  });

  it("should get series for a post", async () => {
    const seriesInfo = await db.getPostSeries(testPost2Id);
    
    expect(seriesInfo).toBeDefined();
    expect(seriesInfo?.id).toBe(testSeriesId);
    expect(seriesInfo?.orderIndex).toBe(2);
  });

  it("should get series navigation", async () => {
    const navigation = await db.getSeriesNavigation(testSeriesId, 2);
    
    expect(navigation.prev).toBeDefined();
    expect(navigation.prev?.id).toBe(testPost1Id);
    expect(navigation.next).toBeDefined();
    expect(navigation.next?.id).toBe(testPost3Id);
  });

  it("should get correct navigation for first post", async () => {
    const navigation = await db.getSeriesNavigation(testSeriesId, 1);
    
    expect(navigation.prev).toBeNull();
    expect(navigation.next).toBeDefined();
    expect(navigation.next?.id).toBe(testPost2Id);
  });

  it("should get correct navigation for last post", async () => {
    const navigation = await db.getSeriesNavigation(testSeriesId, 3);
    
    expect(navigation.prev).toBeDefined();
    expect(navigation.prev?.id).toBe(testPost2Id);
    expect(navigation.next).toBeNull();
  });

  it("should update post order in series", async () => {
    await db.updatePostOrderInSeries(testSeriesId, testPost1Id, 10);
    
    const posts = await db.getSeriesPosts(testSeriesId);
    const post1 = posts.find(p => p.id === testPost1Id);
    
    expect(post1?.orderIndex).toBe(10);
  });

  it("should remove post from series", async () => {
    await db.removePostFromSeries(testSeriesId, testPost3Id);
    
    const posts = await db.getSeriesPosts(testSeriesId);
    const hasPost3 = posts.some(p => p.id === testPost3Id);
    
    expect(hasPost3).toBe(false);
  });

  it("should update series", async () => {
    await db.updateBlogSeries(testSeriesId, {
      title: "Updated Series Title",
      description: "Updated description",
    });

    const series = await db.getBlogSeriesById(testSeriesId);
    
    expect(series?.title).toBe("Updated Series Title");
    expect(series?.description).toBe("Updated description");
  });

  it("should get series with post count", async () => {
    const seriesList = await db.getSeriesWithPostCount();
    const testSeries = seriesList.find(s => s.id === testSeriesId);
    
    expect(testSeries).toBeDefined();
    expect(testSeries?.postCount).toBeGreaterThanOrEqual(2); // We removed one post
  });

  it("should delete series", async () => {
    await db.deleteBlogSeries(testSeriesId);
    
    const series = await db.getBlogSeriesById(testSeriesId);
    expect(series).toBeNull();
  });
});
