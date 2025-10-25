"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const resizeImageWithSharp = (inputPath, outputPath, width, height, options) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Resize with sharp and then cache the img');
    let transform = (0, sharp_1.default)(inputPath);
    // Apply rotation if specified
    if (options === null || options === void 0 ? void 0 : options.rotate) {
        transform = transform.rotate(options.rotate);
    }
    // Apply grayscale if specified
    if (options === null || options === void 0 ? void 0 : options.grayscale) {
        transform = transform.grayscale();
    }
    // Apply resize with fit option
    transform = transform.resize({
        width,
        height,
        fit: (options === null || options === void 0 ? void 0 : options.fit) || 'cover',
    });
    // Apply format conversion and quality
    const targetFormat = (options === null || options === void 0 ? void 0 : options.format) || 'jpeg';
    const quality = (options === null || options === void 0 ? void 0 : options.quality) || 80;
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
    yield transform.toFile(outputPath);
    console.log('✅ Image resized and saved:', outputPath);
});
exports.default = resizeImageWithSharp;
