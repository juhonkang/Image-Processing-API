# Image Processing API
First project in the Udacity's Full Stack JavaScript Developer Nanodegree Program.

An enhanced, production-ready image processing API with advanced features for resizing, transforming, and converting images. All original functionality has been preserved and extended with powerful new capabilities.

## Features

### Core Features (Original)
- Image resizing with custom width and height
- Intelligent caching system for processed images
- Support for JPEG images
- Comprehensive error handling and validation

### Enhanced Features (New)
- **Multiple Format Support**: Automatically detects and processes JPG, JPEG, PNG, WebP, and GIF images
- **Format Conversion**: Convert images between different formats on-the-fly
- **Quality Control**: Adjust image compression quality (1-100)
- **Flexible Resize Modes**: Choose from multiple fit options (cover, contain, fill, inside, outside)
- **Image Transformations**: Apply grayscale filter and rotation
- **Advanced Logging**: Request/response logging with performance metrics
- **Comprehensive Testing**: Full test coverage including all new features

## Dependencies:

#### Technologies and tools
- [NodeJs](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Sharp](https://sharp.pixelplumbing.com/)

#### Tests
- [Jasmine](https://jasmine.github.io/)
- [Supertest](https://github.com/ladjs/supertest#readme)

#### Code Formatters
- [Prettier](https://prettier.io/)
- [Eslint](https://eslint.org/)

#### Images Folder
[Image Processing API on GitHub-Udacity Repo](https://github.com/udacity/cd0292-building-a-server-project-starter/tree/master/images)

## Getting Started

### Installation
```bash
npm install
```

### Build
```bash
npm run build
```

### Run Tests
```bash
npm run test
```

### Start Server
```bash
npm start
```

Server will be available at: [http://localhost:3000](http://localhost:3000)

## API Documentation

### Endpoint
```
GET /api/images
```

### Required Parameters

| Parameter | Type   | Description                          |
|-----------|--------|--------------------------------------|
| filename  | string | Name of the image (without extension) |
| width     | number | Target width in pixels (must be > 0)  |
| height    | number | Target height in pixels (must be > 0) |

### Optional Parameters

| Parameter | Type    | Description                                                                 | Default | Valid Values              |
|-----------|---------|-----------------------------------------------------------------------------|---------|---------------------------|
| quality   | number  | Image compression quality                                                   | 80      | 1-100                     |
| fit       | string  | How the image should be resized to fit the target dimensions                | cover   | cover, contain, fill, inside, outside |
| format    | string  | Output image format (also accepts images in these formats as input)         | jpg     | jpg, jpeg, png, webp, gif |
| grayscale | boolean | Convert image to grayscale                                                  | false   | true, false               |
| rotate    | number  | Rotate image by specified degrees                                           | 0       | Any number (0-360)        |

### Fit Options Explained

- **cover**: Preserve aspect ratio, ensure the image covers both dimensions (default)
- **contain**: Preserve aspect ratio, ensure image fits within both dimensions
- **fill**: Ignore aspect ratio, stretch to fill exact dimensions
- **inside**: Preserve aspect ratio, resize to be as large as possible while fitting inside dimensions
- **outside**: Preserve aspect ratio, resize to be as small as possible while outside dimensions

### Examples

#### Basic Resize (Original Functionality)
```
http://localhost:3000/api/images?filename=fjord&width=200&height=100
```

#### High Quality Resize
```
http://localhost:3000/api/images?filename=fjord&width=500&height=300&quality=95
```

#### Resize with Contain Fit
```
http://localhost:3000/api/images?filename=santamonica&width=400&height=400&fit=contain
```

#### Convert to WebP Format
```
http://localhost:3000/api/images?filename=fjord&width=300&height=200&format=webp
```

#### Grayscale Thumbnail
```
http://localhost:3000/api/images?filename=palmtunnel&width=150&height=150&grayscale=true
```

#### Rotate Image
```
http://localhost:3000/api/images?filename=encenadaport&width=400&height=300&rotate=90
```

#### Complex Transformation
```
http://localhost:3000/api/images?filename=fjord&width=500&height=500&quality=90&fit=cover&grayscale=true&rotate=45&format=png
```

## Response Codes

| Code | Description                                      |
|------|--------------------------------------------------|
| 200  | Success - Returns the processed image            |
| 400  | Bad Request - Missing or invalid parameters      |
| 404  | Not Found - Original image doesn't exist         |
| 500  | Server Error - Error processing the image        |

## Caching

Processed images are automatically cached in the `images/cache` directory with filenames that include all transformation parameters. This ensures:
- Fast response times for repeated requests
- Efficient storage (only unique transformations are cached)
- No unnecessary reprocessing

## Project Structure

```
Image-Processing-API/
├── images/                    # Original images
│   └── cache/                # Cached processed images
├── src/
│   ├── index.ts              # Main application entry point
│   ├── routes/
│   │   └── images.ts         # Image processing route handler
│   ├── utilities/
│   │   ├── sharpToResize.ts  # Sharp image processing logic
│   │   └── FileExist.ts      # File system utilities
│   ├── middleware/
│   │   └── logger.ts         # Request logging and error handling
│   └── tests/
│       ├── indexSpec.ts      # Server endpoint tests
│       └── imagesSpec.ts     # Image processing tests
├── package.json
├── tsconfig.json
└── README.md
```

## Development Scripts

| Script                  | Command                    | Description                           |
|-------------------------|----------------------------|---------------------------------------|
| Install dependencies    | `npm install`              | Install all project dependencies      |
| Build project          | `npm run build`            | Compile TypeScript to JavaScript      |
| Run tests              | `npm run test`             | Build and run all tests               |
| Start server           | `npm start`                | Start the production server           |
| Development mode       | `npm run dev`              | Run with ts-node for development      |
| Lint code              | `npm run lint`             | Check code quality with ESLint        |
| Format code            | `npm run prettier`         | Format code with Prettier             |

## Enhancements Made

This enhanced version maintains 100% backward compatibility while adding:

1. **Multi-format Support**: Automatic detection and support for JPG, PNG, WebP, and GIF
2. **Advanced Resize Options**: Multiple fit modes for precise control
3. **Quality Control**: Adjustable compression for optimal file size/quality balance
4. **Image Transformations**: Grayscale and rotation capabilities
5. **Format Conversion**: Convert between image formats seamlessly
6. **Enhanced Logging**: Detailed request/response logging with performance tracking
7. **Improved Error Handling**: Comprehensive error messages and validation
8. **Extended Test Suite**: Full coverage of all new features (20 passing tests)
9. **Better Caching**: Intelligent cache key generation based on all parameters


