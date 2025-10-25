import sharp, { FitEnum } from 'sharp';

export interface ImageProcessingOptions {
  width: number;
  height: number;
  quality?: number;
  fit?: keyof FitEnum;
  format?: string;
  grayscale?: boolean;
  rotate?: number;
}

const resizeImageWithSharp = async (
  inputPath: string,
  outputPath: string,
  width: number,
  height: number,
  options?: Partial<ImageProcessingOptions>
): Promise<void> => {
  console.log('Resize with sharp and then cache the img');

  let transform = sharp(inputPath);

  // Apply rotation if specified
  if (options?.rotate) {
    transform = transform.rotate(options.rotate);
  }

  // Apply grayscale if specified
  if (options?.grayscale) {
    transform = transform.grayscale();
  }

  // Apply resize with fit option
  transform = transform.resize({
    width,
    height,
    fit: options?.fit || 'cover',
  });

  // Apply format conversion and quality
  const targetFormat = options?.format || 'jpeg';
  const quality = options?.quality || 80;

  switch (targetFormat.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      transform = transform.jpeg({ quality });
      break;
    case 'png':
      transform = transform.png({ quality });
      break;
    case 'webp':
      transform = transform.webp({ quality });
      break;
    case 'gif':
      transform = transform.gif();
      break;
    default:
      transform = transform.jpeg({ quality });
  }

  await transform.toFile(outputPath);
  console.log('✅ Image resized and saved:', outputPath);
};

export default resizeImageWithSharp;
