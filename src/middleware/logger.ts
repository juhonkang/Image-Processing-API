import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
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

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
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
