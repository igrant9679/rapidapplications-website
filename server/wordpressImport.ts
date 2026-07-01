import axios from 'axios';
import { storagePut } from './storage';
import { optimizeImage } from './imageOptimization';

export interface WordPressPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  status: string;
  slug: string;
  categories: number[];
  tags: number[];
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WordPressTag {
  id: number;
  name: string;
  slug: string;
}

/**
 * Fetch all posts from WordPress REST API
 */
export async function fetchWordPressPosts(
  siteUrl: string,
  page: number = 1,
  perPage: number = 10
): Promise<{ posts: WordPressPost[]; totalPages: number; totalPosts: number }> {
  try {
    // Normalize URL
    const baseUrl = siteUrl.replace(/\/$/, '');
    const apiUrl = `${baseUrl}/wp-json/wp/v2/posts`;

    const response = await axios.get(apiUrl, {
      params: {
        page,
        per_page: perPage,
        _embed: true, // Include embedded data (featured image, categories, tags)
      },
      timeout: 30000,
    });

    const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1');
    const totalPosts = parseInt(response.headers['x-wp-total'] || '0');

    return {
      posts: response.data,
      totalPages,
      totalPosts,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch WordPress posts: ${error.response?.status} ${error.message}`
      );
    }
    throw error;
  }
}

/**
 * Fetch categories from WordPress
 */
export async function fetchWordPressCategories(
  siteUrl: string
): Promise<WordPressCategory[]> {
  try {
    const baseUrl = siteUrl.replace(/\/$/, '');
    const apiUrl = `${baseUrl}/wp-json/wp/v2/categories`;

    const response = await axios.get(apiUrl, {
      params: { per_page: 100 },
      timeout: 30000,
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

/**
 * Fetch tags from WordPress
 */
export async function fetchWordPressTags(
  siteUrl: string
): Promise<WordPressTag[]> {
  try {
    const baseUrl = siteUrl.replace(/\/$/, '');
    const apiUrl = `${baseUrl}/wp-json/wp/v2/tags`;

    const response = await axios.get(apiUrl, {
      params: { per_page: 100 },
      timeout: 30000,
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return [];
  }
}

/**
 * Download and optimize image from URL
 */
export async function downloadAndOptimizeImage(
  imageUrl: string,
  altText: string = '',
  userId: number
): Promise<{ url: string; key: string; width: number; height: number; size: number } | null> {
  try {
    // Download image
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 60000,
    });

    const buffer = Buffer.from(response.data);

    // Optimize image
    const optimized = await optimizeImage(buffer, {
      quality: 85,
      maxWidth: 2048,
      maxHeight: 2048,
      format: 'webp',
    });

    // Generate unique filename
    const filename = imageUrl.split('/').pop() || 'imported-image.webp';
    const safeFilename = filename
      .replace(/\.[^.]+$/, '.webp')
      .replace(/[^a-z0-9.-]/gi, '-')
      .toLowerCase();
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const fileKey = `imports/wordpress/${userId}/${timestamp}-${randomSuffix}-${safeFilename}`;

    // Upload to S3
    const result = await storagePut(fileKey, optimized.buffer, optimized.mimeType);

    return {
      url: result.url,
      key: result.key,
      width: optimized.width,
      height: optimized.height,
      size: optimized.size,
    };
  } catch (error) {
    console.error('Failed to download/optimize image:', imageUrl, error);
    return null;
  }
}

/**
 * Clean WordPress HTML content
 */
export function cleanWordPressContent(
  html: string,
  transformationRules?: Array<{ find: string; replace: string }>
): string {
  // Remove WordPress-specific classes and attributes
  let cleaned = html
    .replace(/class="[^"]*"/g, '')
    .replace(/id="[^"]*"/g, '')
    .replace(/style="[^"]*"/g, '')
    .replace(/data-[a-z-]+=["'][^"']*["']/gi, '');

  // Apply transformation rules
  if (transformationRules && transformationRules.length > 0) {
    transformationRules.forEach(rule => {
      if (rule.find && rule.replace !== undefined) {
        // Use global replace for all occurrences
        const regex = new RegExp(rule.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        cleaned = cleaned.replace(regex, rule.replace);
      }
    });
  }

  // Clean up extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}
