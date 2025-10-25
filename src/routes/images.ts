import express, { Request, Response } from 'express';
import resizeImageWithSharp from '../utilities/sharpToResize';
import { fileExists, getImagePaths } from '../utilities/FileExist';
import path from 'path';

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<Response | void> => {
  console.log('/api/images route called!');

  const filename = req.query.filename as string | undefined;
  const width = req.query.width as string | undefined;
  const height = req.query.height as string | undefined;

  // New optional parameters
  const quality = req.query.quality as string | undefined;
  const fit = req.query.fit as string | undefined;
  const format = req.query.format as string | undefined;
  const grayscale = req.query.grayscale as string | undefined;
  const rotate = req.query.rotate as string | undefined;

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

  const widthNum: number = parseInt(width);
  const heightNum: number = parseInt(height);
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

  const { inputPath, outputPath: baseOutputPath, detectedFormat } = getImagePaths(
    filename,
    widthNum,
    heightNum,
    format
  );

  // Build custom output path with cache key
  const outputFormat = format || detectedFormat;
  const outputPath = path.join(
    path.dirname(baseOutputPath),
    `${cacheKey}.${outputFormat}`
  );

  if (!fileExists(inputPath)) {
    console.log('Original image not found');
    return res.status(404).send('Original image not found');
  }

  const sendFileSafe = (filePath: string): void => {
    res.sendFile(filePath, (err) => {
      if (err) res.status(500).send('Error sending file');
    });
  };

  if (fileExists(outputPath)) {
    console.log('✅ Cached image found, sending:', outputPath);
    return sendFileSafe(outputPath);
  }

  // Resize with sharp and then cache the img
  try {
    await resizeImageWithSharp(inputPath, outputPath, widthNum, heightNum, {
      quality: qualityNum,
      fit: fit as any,
      format: outputFormat,
      grayscale: grayscaleBool,
      rotate: rotateNum,
    });
    console.log('Resized with sharp and then cache the img');
    return sendFileSafe(outputPath);
  } catch (err) {
    console.error('❌ Sharp error', err);
    return res.status(500).send('Error processing image');
  }
});

export default router;
