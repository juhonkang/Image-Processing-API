"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    const start = Date.now();
    const { method, url } = req;
    res.on('finish', () => {
        const duration = Date.now() - start;
        const { statusCode } = res;
        const statusEmoji = statusCode >= 400 ? '❌' : '✅';
        console.log(`${statusEmoji} [${method}] ${url} - ${statusCode} (${duration}ms)`);
    });
    next();
};
exports.requestLogger = requestLogger;
const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.message);
    console.error(err.stack);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
    });
};
exports.errorHandler = errorHandler;
