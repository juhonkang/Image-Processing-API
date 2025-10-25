import fs from "fs";
import path from "path";


const originalImagesFolder: string = path.join(__dirname, '../../images'); // original images
const resizedCacheFolder: string = path.join(__dirname, '../../images/cache'); // cached resized images



// Ensure resizedCacheFolder exists and if not creat it
if (!fs.existsSync(resizedCacheFolder)) {
  fs.mkdirSync(resizedCacheFolder, { recursive: true });
  console.log('Created resizedCache Folder:', resizedCacheFolder);
}

 
export const getImagePaths = (
  filename: string,
  width: number,
  height: number,
  format?: string
): { inputPath: string; outputPath: string; detectedFormat: string } => {
  // Support multiple input formats - try to find the image
  const supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  let inputPath = '';
  let detectedFormat = 'jpg';

  // If format is provided, use it directly
  if (format && supportedFormats.includes(format.toLowerCase())) {
    detectedFormat = format.toLowerCase();
    inputPath = path.join(originalImagesFolder, `${filename}.${detectedFormat}`);
  } else {
    // Try to find the image with any supported format
    for (const fmt of supportedFormats) {
      const testPath = path.join(originalImagesFolder, `${filename}.${fmt}`);
      if (fs.existsSync(testPath)) {
        inputPath = testPath;
        detectedFormat = fmt;
        break;
      }
    }
    // If not found, default to jpg (maintain backward compatibility)
    if (!inputPath) {
      inputPath = path.join(originalImagesFolder, `${filename}.jpg`);
      detectedFormat = 'jpg';
    }
  }

  const outputPath = path.join(resizedCacheFolder, `${filename}_${width}x${height}.${detectedFormat}`);
  return { inputPath, outputPath, detectedFormat };
};


  
export const fileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath);
}; 


