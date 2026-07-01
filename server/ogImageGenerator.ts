import { storagePut } from './storage';

// Canvas is optional - only used for OG image generation
// If not available, OG images won't be generated but the app will work fine
let createCanvas: any = null;

// Try to load canvas dynamically (it may not be available in production)
(async () => {
  try {
    // @ts-ignore - canvas package is optional
    const canvasModule = await import('canvas');
    createCanvas = canvasModule.createCanvas;
  } catch (e) {
    // Canvas not available - OG image generation will be disabled
  }
})();

/**
 * Generate Open Graph image for blog post or page
 */
export async function generateOGImage(options: {
  title: string;
  subtitle?: string;
  type: 'blog' | 'page';
}): Promise<{ url: string; key: string } | null> {
  // Return null if canvas is not available
  if (!createCanvas) {
    console.warn('[OG Image] Canvas not available, skipping OG image generation');
    return null;
  }
  
  const { title, subtitle, type } = options;

  // Create canvas (1200x630 is the recommended OG image size)
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background gradient (RapidApplications brand colors)
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#16213e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add accent line
  ctx.fillStyle = '#c41e3a';
  ctx.fillRect(0, 0, 10, height);

  // Add logo/brand text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('RapidApplications', 60, 80);

  // Add type badge
  ctx.fillStyle = '#c41e3a';
  ctx.fillRect(60, 110, type === 'blog' ? 100 : 80, 40);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(type === 'blog' ? 'BLOG POST' : 'PAGE', 70, 137);

  // Add title (with word wrapping)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 56px sans-serif';
  const maxWidth = width - 120;
  const lineHeight = 70;
  let y = 240;

  // Simple word wrapping
  const words = title.split(' ');
  let line = '';
  const lines: string[] = [];

  for (const word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== '') {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  // Limit to 3 lines
  const displayLines = lines.slice(0, 3);
  if (lines.length > 3) {
    displayLines[2] = displayLines[2].substring(0, displayLines[2].length - 3) + '...';
  }

  for (const textLine of displayLines) {
    ctx.fillText(textLine, 60, y);
    y += lineHeight;
  }

  // Add subtitle if provided
  if (subtitle) {
    ctx.fillStyle = '#a0a0a0';
    ctx.font = '28px sans-serif';
    ctx.fillText(subtitle, 60, y + 30);
  }

  // Add footer
  ctx.fillStyle = '#666666';
  ctx.font = '24px sans-serif';
  ctx.fillText('rapidapplications.com', 60, height - 40);

  // Convert to buffer
  const buffer = canvas.toBuffer('image/png');

  // Upload to S3
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const key = `og-images/${type}-${timestamp}-${random}.png`;

  const result = await storagePut(key, buffer, 'image/png');

  return {
    url: result.url,
    key,
  };
}
