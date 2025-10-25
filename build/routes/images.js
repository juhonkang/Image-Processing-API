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
const express_1 = __importDefault(require("express"));
const sharpToResize_1 = __importDefault(require("../utilities/sharpToResize"));
const FileExist_1 = require("../utilities/FileExist");
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('/api/images route called!');
    const filename = req.query.filename;
    const width = req.query.width;
    const height = req.query.height;
    // New optional parameters
    const quality = req.query.quality;
    const fit = req.query.fit;
    const format = req.query.format;
    const grayscale = req.query.grayscale;
    const rotate = req.query.rotate;
    if (!filename) {
        console.log('❌ Missing filename');
        return res.status(400).send('Missing filename, Filename is required');
    }
    if (!width) {
        console.log('❌ Missing width');
        return res.status(400).send('Missing width');
    }
    if (!height) {
        console.log('❌ Missing height');
        return res.status(400).send('Missing height');
    }
    const widthNum = parseInt(width);
    const heightNum = parseInt(height);
    if (isNaN(widthNum) || isNaN(heightNum) || widthNum <= 0 || heightNum <= 0) {
        console.log('❌ Invalid width/height:', width, height);
        return res.status(400).send('Width and height must be positive numbers');
    }
    // Parse optional parameters
    const qualityNum = quality ? parseInt(quality) : undefined;
    if (qualityNum !== undefined && (isNaN(qualityNum) || qualityNum < 1 || qualityNum > 100)) {
        return res.status(400).send('Quality must be between 1 and 100');
    }
    const rotateNum = rotate ? parseInt(rotate) : undefined;
    if (rotateNum !== undefined && isNaN(rotateNum)) {
        return res.status(400).send('Rotate must be a valid number');
    }
    const grayscaleBool = grayscale === 'true';
    const validFitModes = ['cover', 'contain', 'fill', 'inside', 'outside'];
    if (fit && !validFitModes.includes(fit)) {
        return res.status(400).send(`Fit must be one of: ${validFitModes.join(', ')}`);
    }
    // Generate unique cache path based on all parameters
    const cacheKey = `${filename}_${widthNum}x${heightNum}${quality ? `_q${quality}` : ''}${fit ? `_${fit}` : ''}${format ? `_${format}` : ''}${grayscaleBool ? '_gray' : ''}${rotateNum ? `_r${rotateNum}` : ''}`;
    const { inputPath, outputPath: baseOutputPath, detectedFormat } = (0, FileExist_1.getImagePaths)(filename, widthNum, heightNum, format);
    // Build custom output path with cache key
    const outputFormat = format || detectedFormat;
    const outputPath = path_1.default.join(path_1.default.dirname(baseOutputPath), `${cacheKey}.${outputFormat}`);
    if (!(0, FileExist_1.fileExists)(inputPath)) {
        console.log('Original image not found');
        return res.status(404).send('Original image not found');
    }
    const sendFileSafe = (filePath) => {
        res.sendFile(filePath, (err) => {
            if (err)
                res.status(500).send('Error sending file');
        });
    };
    if ((0, FileExist_1.fileExists)(outputPath)) {
        console.log('✅ Cached image found, sending:', outputPath);
        return sendFileSafe(outputPath);
    }
    // Resize with sharp and then cache the img
    try {
        yield (0, sharpToResize_1.default)(inputPath, outputPath, widthNum, heightNum, {
            quality: qualityNum,
            fit: fit,
            format: outputFormat,
            grayscale: grayscaleBool,
            rotate: rotateNum,
        });
        console.log('Resized with sharp and then cache the img');
        return sendFileSafe(outputPath);
    }
    catch (err) {
        console.error('❌ Sharp error', err);
        return res.status(500).send('Error processing image');
    }
}));
exports.default = router;
