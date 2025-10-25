"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileExists = exports.getImagePaths = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const originalImagesFolder = path_1.default.join(__dirname, '../../images'); // original images
const resizedCacheFolder = path_1.default.join(__dirname, '../../images/cache'); // cached resized images
// Ensure resizedCacheFolder exists and if not creat it
if (!fs_1.default.existsSync(resizedCacheFolder)) {
    fs_1.default.mkdirSync(resizedCacheFolder, { recursive: true });
    console.log('Created resizedCache Folder:', resizedCacheFolder);
}
const getImagePaths = (filename, width, height, format) => {
    // Support multiple input formats - try to find the image
    const supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    let inputPath = '';
    let detectedFormat = 'jpg';
    // If format is provided, use it directly
    if (format && supportedFormats.includes(format.toLowerCase())) {
        detectedFormat = format.toLowerCase();
        inputPath = path_1.default.join(originalImagesFolder, `${filename}.${detectedFormat}`);
    }
    else {
        // Try to find the image with any supported format
        for (const fmt of supportedFormats) {
            const testPath = path_1.default.join(originalImagesFolder, `${filename}.${fmt}`);
            if (fs_1.default.existsSync(testPath)) {
                inputPath = testPath;
                detectedFormat = fmt;
                break;
            }
        }
        // If not found, default to jpg (maintain backward compatibility)
        if (!inputPath) {
            inputPath = path_1.default.join(originalImagesFolder, `${filename}.jpg`);
            detectedFormat = 'jpg';
        }
    }
    const outputPath = path_1.default.join(resizedCacheFolder, `${filename}_${width}x${height}.${detectedFormat}`);
    return { inputPath, outputPath, detectedFormat };
};
exports.getImagePaths = getImagePaths;
const fileExists = (filePath) => {
    return fs_1.default.existsSync(filePath);
};
exports.fileExists = fileExists;
