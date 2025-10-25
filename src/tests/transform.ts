import sharp from 'sharp';

export const transform = async (
  inputPath: string,
  width: number,
  height: number,
  outputPath: string
): Promise<void> => {
  await sharp(inputPath).resize(width, height).toFile(outputPath);
};



