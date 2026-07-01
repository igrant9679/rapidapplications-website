/**
 * Generate JSON-LD structured data for blog posts
 */
export function generateBlogPostStructuredData(post: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author: { name: string };
  publishedAt: Date;
  updatedAt: Date;
  featuredImage?: string;
  category?: { name: string };
  tags?: Array<{ name: string }>;
}) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    image: post.featuredImage || `${baseUrl}/images/default-og.png`,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "RapidApplications",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
    articleSection: post.category?.name,
    keywords: post.tags?.map((t) => t.name).join(", "),
  };
}

/**
 * Generate JSON-LD structured data for CMS pages
 */
export function generatePageStructuredData(page: {
  title: string;
  slug: string;
  content: string;
  metaDescription?: string;
  updatedAt: Date;
}) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.metaDescription || page.content.substring(0, 160),
    url: `${baseUrl}/${page.slug}`,
    dateModified: page.updatedAt.toISOString(),
    publisher: {
      "@type": "Organization",
      name: "RapidApplications",
    },
  };
}

/**
 * Generate JSON-LD breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
