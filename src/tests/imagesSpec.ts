import supertest from 'supertest';
import app from '../index';
import path from 'path';
import fs from 'fs';

import resizeImageWithSharp from '../utilities/sharpToResize';

const request = supertest(app);

describe('Images API Tests', () => {
  const cacheFolderForTest = path.join(__dirname, '../../src/tests/cacheTest');
  const validImage = 'fjord'; //image exist in /images folder

  beforeAll(() => {
    if (!fs.existsSync(cacheFolderForTest)) {
      fs.mkdirSync(cacheFolderForTest, { recursive: true });
    }
  });

  afterAll(() => {
    fs.readdirSync(cacheFolderForTest).forEach((file) => {
      if (file.startsWith(validImage)) {
        fs.unlinkSync(path.join(cacheFolderForTest, file));
      }
    });
  });

  it('should return 200 and resized image for valid request', async () => {
    const response = await request.get(`/api/images?filename=${validImage}&width=200&height=200`);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('image');
  });

  it('should return 400 if filename is missing', async () => {
    const response = await request.get('/api/images?width=200&height=200');
    expect(response.status).toBe(400);
    expect(response.text).toContain('Missing filename');
  });

  it('should return 400 if width is missing', async () => {
    const response = await request.get(`/api/images?filename=${validImage}&height=200`);
    expect(response.status).toBe(400);
    expect(response.text).toContain('Missing width');
  });

  it('should return 400 if height is missing', async () => {
    const response = await request.get(`/api/images?filename=${validImage}&width=200`);
    expect(response.status).toBe(400);
    expect(response.text).toContain('Missing height');
  });
  it('should return 400 for invalid width/height values', async () => {
    const response = await request.get(`/api/images?filename=${validImage}&width=-10&height=0`);
    expect(response.status).toBe(400);
    expect(response.text).toContain('Width and height must be positive numbers');
  });

  it('should return 404 if image does not exist', async () => {
    const response = await request.get(
      `/api/images?filename=notattachedpicname&width=200&height=200`,
    );
    expect(response.status).toBe(404);
    expect(response.text).toContain('Original image not found');
  });






  
});





describe('Enhanced Images API Tests', () => {
  const validImage = 'fjord';

  it('should accept quality parameter', async () => {
    const response = await request.get(
      `/api/images?filename=${validImage}&width=200&height=200&quality=50`,
    );
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('image');
  });

  it('should return 400 for invalid quality value', async () => {
    const response = await request.get(
      `/api/images?filename=${validImage}&width=200&height=200&quality=150`,
    );
    expect(response.status).toBe(400);
    expect(response.text).toContain('Quality must be between 1 and 100');
  });

  it('should accept fit parameter', async () => {
    const response = await request.get(
      `/api/images?filename=${validImage}&width=200&height=200&fit=contain`,
    );
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('image');
  });

  it('should return 400 for invalid fit value', async () => {
    const response = await request.get(
      `/api/images?filename=${validImage}&width=200&height=200&fit=invalid`,
    );
    expect(response.status).toBe(400);
    expect(response.text).toContain('Fit must be one of');
  });

  it('should accept grayscale parameter', async () => {
    const response = await request.get(
      `/api/images?filename=${validImage}&width=200&height=200&grayscale=true`,
    );
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('image');
  });

  it('should accept rotation parameter', async () => {
    const response = await request.get(
      `/api/images?filename=${validImage}&width=200&height=200&rotate=90`,
    );
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('image');
  });

  it('should return 400 for invalid rotation value', async () => {
    const response = await request.get(
      `/api/images?filename=${validImage}&width=200&height=200&rotate=invalid`,
    );
    expect(response.status).toBe(400);
    expect(response.text).toContain('Rotate must be a valid number');
  });

  it('should accept format conversion to webp', async () => {
    const response = await request.get(
      `/api/images?filename=${validImage}&width=200&height=200&format=jpg`,
    );
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('image');
  });

  it('should handle multiple parameters together', async () => {
    const response = await request.get(
      `/api/images?filename=${validImage}&width=300&height=300&quality=80&fit=cover&grayscale=true&rotate=45`,
    );
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('image');
  });
});

describe('resizeImageWithSharp tests', () => {
  const cacheFolderForTest = path.join(__dirname, '../../src/tests/cacheTest');
  const testFilePath = path.resolve(__dirname, '../../images/santamonica.jpg');
  const testThumbPath = path.resolve(__dirname, '../../src/tests/cacheTest/santamonica_resized.jpg');
  const Width = 250;
  const Height = 250;

  beforeAll(() => {
    if (!fs.existsSync(cacheFolderForTest)) {
      fs.mkdirSync(cacheFolderForTest, { recursive: true });
    }
  });

  afterAll(() => {
    if (fs.existsSync(testThumbPath)) {
      fs.unlinkSync(testThumbPath);
    }
  });

  it('should resize image without throwing', async () => {
    expect(async () => {
      await resizeImageWithSharp(testFilePath, testThumbPath, Width, Height);
    }).not.toThrow();
  });

  it('should create a resized file', async () => {
    await resizeImageWithSharp(testFilePath, testThumbPath, Width, Height);
    expect(fs.existsSync(testThumbPath)).toBeTrue();
  });

  it('should throw an error for invalid input file path', async () => {
  const invalidPath = path.resolve(__dirname, '../../images/notfound.jpg');
  const outputPath = path.resolve(__dirname, '../../src/tests/cacheTest/invalid_test.jpg');

  await expectAsync(
    resizeImageWithSharp(invalidPath, outputPath, 200, 200)
  ).toBeRejected();  // Jasmine async matcher for errors
});
});