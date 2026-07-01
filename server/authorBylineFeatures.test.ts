import { describe, it, expect } from 'vitest';
import { getBlogPostBySlug, getPublishedBlogPosts } from './db';

describe('Author Attribution Features', () => {
  it('getBlogPostBySlug should include author information', async () => {
    const post = await getBlogPostBySlug('test-post');
    
    if (post) {
      expect(post).toHaveProperty('authorName');
      expect(post).toHaveProperty('authorEmail');
    }
  });

  it('getPublishedBlogPosts should include author information', async () => {
    const posts = await getPublishedBlogPosts();
    
    if (posts && posts.length > 0) {
      const firstPost = posts[0];
      expect(firstPost).toHaveProperty('authorName');
      expect(firstPost).toHaveProperty('authorEmail');
    }
  });
});
