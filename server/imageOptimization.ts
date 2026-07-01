import sharp from 'sharp';

export interface OptimizationOptions {
  quality?: number; // 1-100, default 80
  maxWidth?: number; // Max width in pixels, default 2048
  maxHeight?: number; // Max height in pixels, default 2048
  format?: 'webp' | 'jpeg' | 'png'; // Output format, default 'webp'
}

export interface OptimizedImage {
  buffer: Buffer;
  mimeType: string;
  width: number;
  height: number;
  size: number;
}

/**
 * Optimize an image: resize, compress, and convert to WebP
 */
export async function optimizeImage(
  inputBuffer: Buffer,
  options: OptimizationOptions = {}
): Promise<OptimizedImage> {
  const {
    quality = 80,
    maxWidth = 2048,
    maxHeight = 2048,
    format = 'webp',
  } = options;

  try {
    // Create sharp instance
    let pipeline = sharp(inputBuffer);

    // Get metadata
    const metadata = await pipeline.metadata();

    // Resize if needed
    if (
      (metadata.width && metadata.width > maxWidth) ||
      (metadata.height && metadata.height > maxHeight)
    ) {
      pipeline = pipeline.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Convert and compress based on format
    if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    } else if (format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality });
    } else if (format === 'png') {
      pipeline = pipeline.png({ quality });
    }

    // Process the image
    const buffer = await pipeline.toBuffer();
    const info = await sharp(buffer).metadata();

    return {
      buffer,
      mimeType: `image/${format}`,
      width: info.width || 0,
      height: info.height || 0,
      size: buffer.length,
    };
  } catch (error) {
    throw new Error(
      `Image optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Create a cropped version of an image
 */
export async function cropImage(
  inputBuffer: Buffer,
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  options: OptimizationOptions = {}
): Promise<OptimizedImage> {
  const { quality = 80, format = 'webp' } = options;

  try {
    // Extract the crop region
    let pipeline = sharp(inputBuffer).extract({
      left: Math.round(crop.x),
      top: Math.round(crop.y),
      width: Math.round(crop.width),
      height: Math.round(crop.height),
    });

    // Convert and compress
    if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    } else if (format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality });
    } else if (format === 'png') {
      pipeline = pipeline.png({ quality });
    }

    const buffer = await pipeline.toBuffer();
    const info = await sharp(buffer).metadata();

    return {
      buffer,
      mimeType: `image/${format}`,
      width: info.width || 0,
      height: info.height || 0,
      size: buffer.length,
    };
  } catch (error) {
    throw new Error(
      `Image cropping failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
