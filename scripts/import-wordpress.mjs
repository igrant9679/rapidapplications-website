#!/usr/bin/env node

/**
 * Standalone WordPress Import Script
 * 
 * Usage: node scripts/import-wordpress.mjs <wordpress-site-url>
 * Example: node scripts/import-wordpress.mjs https://example.com
 * 
 * This script can run for hours without timing out, perfect for large imports.
 */

import axios from 'axios';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

// Load environment variables
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });

const WORDPRESS_SITE_URL = process.argv[2];

if (!WORDPRESS_SITE_URL) {
  console.error('❌ Error: Please provide a WordPress site URL');
  console.error('Usage: node scripts/import-wordpress.mjs <wordpress-site-url>');
  console.error('Example: node scripts/import-wordpress.mjs https://example.com');
  process.exit(1);
}

// Database connection
let db;

async function connectDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL not found in environment variables');
  }

  // Parse DATABASE_URL (format: mysql://user:pass@host:port/dbname)
  const url = new URL(DATABASE_URL);
  
  db = await mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
  });

  console.log('✓ Connected to database');
}

async function fetchWordPressPosts(page = 1, perPage = 10) {
  const baseUrl = WORDPRESS_SITE_URL.replace(/\/$/, '');
  const apiUrl = `${baseUrl}/wp-json/wp/v2/posts`;

  const response = await axios.get(apiUrl, {
    params: {
      page,
      per_page: perPage,
      _embed: true,
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
}

async function fetchWordPressCategories() {
  const baseUrl = WORDPRESS_SITE_URL.replace(/\/$/, '');
  const apiUrl = `${baseUrl}/wp-json/wp/v2/categories`;

  const response = await axios.get(apiUrl, {
    params: { per_page: 100 },
    timeout: 30000,
  });

  return response.data;
}

async function fetchWordPressTags() {
  const baseUrl = WORDPRESS_SITE_URL.replace(/\/$/, '');
  const apiUrl = `${baseUrl}/wp-json/wp/v2/tags`;

  const response = await axios.get(apiUrl, {
    params: { per_page: 100 },
    timeout: 30000,
  });

  return response.data;
}

async function downloadAndSaveImage(imageUrl, altText, userId) {
  try {
    // For simplicity in standalone script, we'll just store the original URL
    // In production, you'd want to download and upload to S3
    return imageUrl;
  } catch (error) {
    console.error(`Failed to download image: ${imageUrl}`, error.message);
    return null;
  }
}

function cleanWordPressContent(html) {
  return html
    .replace(/class="[^"]*"/g, '')
    .replace(/id="[^"]*"/g, '')
    .replace(/style="[^"]*"/g, '')
    .replace(/data-[a-z-]+=["'][^"']*["']/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function importPost(wpPost, categoryMap, tagMap, userId) {
  try {
    // Check if post already exists
    const [existing] = await db.execute(
      'SELECT id FROM blog_posts WHERE slug = ?',
      [wpPost.slug]
    );

    if (existing.length > 0) {
      return { success: false, message: 'Post already exists' };
    }

    // Download featured image if exists
    let coverImage = null;
    if (wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
      const imageUrl = wpPost._embedded['wp:featuredmedia'][0].source_url;
      const altText = wpPost._embedded['wp:featuredmedia'][0].alt_text || '';
      coverImage = await downloadAndSaveImage(imageUrl, altText, userId);
    }

    // Clean content
    const content = cleanWordPressContent(wpPost.content.rendered);
    const excerpt = cleanWordPressContent(wpPost.excerpt.rendered);

    // Insert blog post
    const [result] = await db.execute(
      `INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, author_id, status, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        wpPost.title.rendered,
        wpPost.slug,
        excerpt || null,
        content,
        coverImage,
        userId,
        wpPost.status === 'publish' ? 'published' : 'draft',
        wpPost.status === 'publish' ? new Date(wpPost.date) : null,
      ]
    );

    const postId = result.insertId;

    // Assign categories
    for (const wpCatId of wpPost.categories) {
      const localCatId = categoryMap[wpCatId];
      if (localCatId) {
        await db.execute(
          'INSERT IGNORE INTO blog_post_categories (post_id, category_id) VALUES (?, ?)',
          [postId, localCatId]
        );
      }
    }

    // Assign tags
    for (const wpTagId of wpPost.tags) {
      const localTagId = tagMap[wpTagId];
      if (localTagId) {
        await db.execute(
          'INSERT IGNORE INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)',
          [postId, localTagId]
        );
      }
    }

    return { success: true, postId };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function main() {
  console.log('🚀 WordPress Import Script');
  console.log(`📍 Importing from: ${WORDPRESS_SITE_URL}\n`);

  try {
    // Connect to database
    await connectDatabase();

    // Get admin user (first user with role='admin')
    const [adminUsers] = await db.execute(
      "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
    );

    if (adminUsers.length === 0) {
      throw new Error('No admin user found in database');
    }

    const userId = adminUsers[0].id;
    console.log(`✓ Using admin user ID: ${userId}\n`);

    // Fetch WordPress data
    console.log('📥 Fetching WordPress posts...');
    const { posts, totalPosts, totalPages } = await fetchWordPressPosts(1, 100);
    console.log(`✓ Found ${totalPosts} posts across ${totalPages} pages\n`);

    console.log('📥 Fetching categories and tags...');
    const wpCategories = await fetchWordPressCategories();
    const wpTags = await fetchWordPressTags();
    console.log(`✓ Found ${wpCategories.length} categories and ${wpTags.length} tags\n`);

    // Build category and tag maps
    const [localCategories] = await db.execute('SELECT id, name FROM blog_categories');
    const [localTags] = await db.execute('SELECT id, name FROM blog_tags');

    const categoryMap = {};
    const tagMap = {};

    for (const wpCat of wpCategories) {
      const localCat = localCategories.find(
        (c) => c.name.toLowerCase() === wpCat.name.toLowerCase()
      );
      if (localCat) {
        categoryMap[wpCat.id] = localCat.id;
      }
    }

    for (const wpTag of wpTags) {
      const localTag = localTags.find(
        (t) => t.name.toLowerCase() === wpTag.name.toLowerCase()
      );
      if (localTag) {
        tagMap[wpTag.id] = localTag.id;
      }
    }

    console.log(`✓ Mapped ${Object.keys(categoryMap).length} categories and ${Object.keys(tagMap).length} tags\n`);

    // Import posts
    console.log('📝 Starting import...\n');
    let imported = 0;
    let skipped = 0;
    let failed = 0;

    for (let page = 1; page <= totalPages; page++) {
      const { posts } = await fetchWordPressPosts(page, 100);

      for (const wpPost of posts) {
        process.stdout.write(`Importing: ${wpPost.title.rendered}... `);

        const result = await importPost(wpPost, categoryMap, tagMap, userId);

        if (result.success) {
          console.log('✓ Imported');
          imported++;
        } else if (result.message === 'Post already exists') {
          console.log('⊘ Skipped (already exists)');
          skipped++;
        } else {
          console.log(`✗ Failed: ${result.message}`);
          failed++;
        }

        // Small delay to avoid overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    console.log('\n✅ Import complete!');
    console.log(`   Imported: ${imported}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Failed: ${failed}`);
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  } finally {
    if (db) {
      await db.end();
    }
  }
}

main();
