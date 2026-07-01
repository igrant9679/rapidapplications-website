import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as db from "./db";
import { getDb } from "./db";
import { users, blogPosts } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Author Profile Functionality", () => {
  let testAuthorId: number;
  let testPost1Id: number;
  let testPost2Id: number;

  beforeAll(async () => {
    const database = await getDb();
    if (!database) throw new Error("Database not available");

    // Create test author
    const authorResult = await database.insert(users).values({
      openId: `test-author-${Date.now()}`,
      name: "Test Author",
      email: "author@test.com",
      role: "author",
    });
    // Extract insertId from result array
    const authorInsertId = (authorResult as any)[0]?.insertId;
    if (typeof authorInsertId === 'bigint') {
      testAuthorId = Number(authorInsertId);
    } else if (typeof authorInsertId === 'string') {
      testAuthorId = parseInt(authorInsertId, 10);
    } else {
      testAuthorId = authorInsertId as number;
    }
    
    if (!testAuthorId || isNaN(testAuthorId)) {
      throw new Error(`Failed to create test author: insertId is ${authorInsertId}, full result: ${JSON.stringify(authorResult)}`);
    }

    // Create test posts
    const post1Result = await database.insert(blogPosts).values({
      title: "Test Post 1",
      slug: `test-post-1-${Date.now()}`,
      content: "Test content 1",
      excerpt: "Test excerpt 1",
      authorId: testAuthorId,
      status: "published",
      publishedAt: new Date(),
    });
    const post1InsertId = (post1Result as any)[0]?.insertId;
    if (typeof post1InsertId === 'bigint') {
      testPost1Id = Number(post1InsertId);
    } else if (typeof post1InsertId === 'string') {
      testPost1Id = parseInt(post1InsertId, 10);
    } else {
      testPost1Id = post1InsertId as number;
    }

    const post2Result = await database.insert(blogPosts).values({
      title: "Test Post 2",
      slug: `test-post-2-${Date.now()}`,
      content: "Test content 2",
      excerpt: "Test excerpt 2",
      authorId: testAuthorId,
      status: "published",
      publishedAt: new Date(),
    });
    const post2InsertId = (post2Result as any)[0]?.insertId;
    if (typeof post2InsertId === 'bigint') {
      testPost2Id = Number(post2InsertId);
    } else if (typeof post2InsertId === 'string') {
      testPost2Id = parseInt(post2InsertId, 10);
    } else {
      testPost2Id = post2InsertId as number;
    }

    // Create draft post (should not appear in author profile)
    await database.insert(blogPosts).values({
      title: "Draft Post",
      slug: `draft-post-${Date.now()}`,
      content: "Draft content",
      authorId: testAuthorId,
      status: "draft",
    });
  });

  afterAll(async () => {
    const database = await getDb();
    if (!database) return;

    // Clean up test data
    await database.delete(blogPosts).where(eq(blogPosts.authorId, testAuthorId));
    await database.delete(users).where(eq(users.id, testAuthorId));
  });

  it("should get author profile by ID", async () => {
    const author = await db.getUserById(testAuthorId);
    expect(author).toBeDefined();
    expect(author?.name).toBe("Test Author");
    expect(author?.email).toBe("author@test.com");
    expect(author?.role).toBe("author");
  });

  it("should return null for non-existent author", async () => {
    const author = await db.getUserById(999999);
    expect(author).toBeNull();
  });

  it("should get published posts by author", async () => {
    const posts = await db.getPostsByAuthor(testAuthorId);
    expect(posts).toBeDefined();
    expect(posts.length).toBe(2); // Only published posts
    expect(posts[0].status).toBe("published");
    expect(posts[1].status).toBe("published");
    expect(posts[0].authorId).toBe(testAuthorId);
    expect(posts[1].authorId).toBe(testAuthorId);
  });

  it("should return empty array for author with no published posts", async () => {
    const database = await getDb();
    if (!database) throw new Error("Database not available");

    // Create author with no posts
    const result = await database.insert(users).values({
      openId: `test-author-no-posts-${Date.now()}`,
      name: "Author No Posts",
      role: "author",
    });
    const insertId = (result as any)[0]?.insertId;
    let authorId: number;
    if (typeof insertId === 'bigint') {
      authorId = Number(insertId);
    } else if (typeof insertId === 'string') {
      authorId = parseInt(insertId, 10);
    } else {
      authorId = insertId as number;
    }

    const posts = await db.getPostsByAuthor(authorId);
    expect(posts).toBeDefined();
    expect(posts.length).toBe(0);

    // Clean up
    await database.delete(users).where(eq(users.id, authorId));
  });

  it("should get author statistics", async () => {
    const stats = await db.getAuthorStats(testAuthorId);
    expect(stats).toBeDefined();
    expect(stats.totalPosts).toBe(2); // Only published posts count
    expect(stats.totalViews).toBeGreaterThanOrEqual(0);
  });

  it("should return zero stats for author with no posts", async () => {
    const database = await getDb();
    if (!database) throw new Error("Database not available");

    // Create author with no posts
    const result = await database.insert(users).values({
      openId: `test-author-no-stats-${Date.now()}`,
      name: "Author No Stats",
      role: "author",
    });
    const insertId = (result as any)[0]?.insertId;
    let authorId: number;
    if (typeof insertId === 'bigint') {
      authorId = Number(insertId);
    } else if (typeof insertId === 'string') {
      authorId = parseInt(insertId, 10);
    } else {
      authorId = insertId as number;
    }

    const stats = await db.getAuthorStats(authorId);
    expect(stats).toBeDefined();
    expect(stats.totalPosts).toBe(0);
    expect(stats.totalViews).toBe(0);

    // Clean up
    await database.delete(users).where(eq(users.id, authorId));
  });

  it("should order posts by publishedAt descending", async () => {
    const posts = await db.getPostsByAuthor(testAuthorId);
    expect(posts.length).toBeGreaterThan(0);
    
    // Verify posts are ordered by publishedAt descending
    for (let i = 0; i < posts.length - 1; i++) {
      const currentDate = posts[i].publishedAt ? new Date(posts[i].publishedAt!) : new Date(0);
      const nextDate = posts[i + 1].publishedAt ? new Date(posts[i + 1].publishedAt!) : new Date(0);
      expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
    }
  });
});
