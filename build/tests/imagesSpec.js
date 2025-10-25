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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sharpToResize_1 = __importDefault(require("../utilities/sharpToResize"));
const request = (0, supertest_1.default)(index_1.default);
describe('Images API Tests', () => {
    const cacheFolderForTest = path_1.default.join(__dirname, '../../src/tests/cacheTest');
    const validImage = 'fjord'; //image exist in /images folder
    beforeAll(() => {
        if (!fs_1.default.existsSync(cacheFolderForTest)) {
            fs_1.default.mkdirSync(cacheFolderForTest, { recursive: true });
        }
    });
    afterAll(() => {
        fs_1.default.readdirSync(cacheFolderForTest).forEach((file) => {
            if (file.startsWith(validImage)) {
                fs_1.default.unlinkSync(path_1.default.join(cacheFolderForTest, file));
            }
        });
    });
    it('should return 200 and resized image for valid request', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/api/images?filename=${validImage}&width=200&height=200`);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('image');
    }));
    it('should return 400 if filename is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/api/images?width=200&height=200');
        expect(response.status).toBe(400);
        expect(response.text).toContain('Missing filename');
    }));
    it('should return 400 if width is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/api/images?filename=${validImage}&height=200`);
        expect(response.status).toBe(400);
        expect(response.text).toContain('Missing width');
    }));
    it('should return 400 if height is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/api/images?filename=${validImage}&width=200`);
        expect(response.status).toBe(400);
        expect(response.text).toContain('Missing height');
    }));
    it('should return 400 for invalid width/height values', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/api/images?filename=${validImage}&width=-10&height=0`);
        expect(response.status).toBe(400);
        expect(response.text).toContain('Width and height must be positive numbers');
    }));
    it('should return 404 if image does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/api/images?filename=notattachedpicname&width=200&height=200`);
        expect(response.status).toBe(404);
        expect(response.text).toContain('Original image not found');
    }));
});
describe('Enhanced Images API Tests', () => {
    const validImage = 'fjord';
    it('should accept quality parameter', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/api/images?filename=${validImage}&width=200&height=200&quality=50`);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('image');
    }));
    it('should return 400 for invalid quality value', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/api/images?filename=${validImage}&width=200&height=200&quality=150`);
        expect(response.status).toBe(400);
        expect(response.text).toContain('Quality must be between 1 and 100');
    }));
    it('should accept fit parameter', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/api/images?filename=${validImage}&width=200&height=200&fit=contain`);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('image');
    }));
    it('should return 400 for invalid fit value', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/api/images?filename=${validImage}&width=200&height=200&fit=invalid`);
        expect(response.status).toBe(400);
        expect(response.text).toContain('Fit must be one of');
    }));
    it('should accept grayscale parameter', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/api/images?filename=${validImage}&width=200&height=200&grayscale=true`);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('image');
    }));
    it('should accept rotation parameter', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/api/images?filename=${validImage}&width=200&height=200&rotate=90`);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('image');
    }));
    it('should return 400 for invalid rotation value', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/api/images?filename=${validImage}&width=200&height=200&rotate=invalid`);
        expect(response.status).toBe(400);
        expect(response.text).toContain('Rotate must be a valid number');
    }));
    it('should accept format conversion to webp', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/api/images?filename=${validImage}&width=200&height=200&format=jpg`);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('image');
    }));
    it('should handle multiple parameters together', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get(`/api/images?filename=${validImage}&width=300&height=300&quality=80&fit=cover&grayscale=true&rotate=45`);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('image');
    }));
});
describe('resizeImageWithSharp tests', () => {
    const cacheFolderForTest = path_1.default.join(__dirname, '../../src/tests/cacheTest');
    const testFilePath = path_1.default.resolve(__dirname, '../../images/santamonica.jpg');
    const testThumbPath = path_1.default.resolve(__dirname, '../../src/tests/cacheTest/santamonica_resized.jpg');
    const Width = 250;
    const Height = 250;
    beforeAll(() => {
        if (!fs_1.default.existsSync(cacheFolderForTest)) {
            fs_1.default.mkdirSync(cacheFolderForTest, { recursive: true });
        }
    });
    afterAll(() => {
        if (fs_1.default.existsSync(testThumbPath)) {
            fs_1.default.unlinkSync(testThumbPath);
        }
    });
    it('should resize image without throwing', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, sharpToResize_1.default)(testFilePath, testThumbPath, Width, Height);
        })).not.toThrow();
    }));
    it('should create a resized file', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, sharpToResize_1.default)(testFilePath, testThumbPath, Width, Height);
        expect(fs_1.default.existsSync(testThumbPath)).toBeTrue();
    }));
    it('should throw an error for invalid input file path', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidPath = path_1.default.resolve(__dirname, '../../images/notfound.jpg');
        const outputPath = path_1.default.resolve(__dirname, '../../src/tests/cacheTest/invalid_test.jpg');
        yield expectAsync((0, sharpToResize_1.default)(invalidPath, outputPath, 200, 200)).toBeRejected(); // Jasmine async matcher for errors
    }));
});
