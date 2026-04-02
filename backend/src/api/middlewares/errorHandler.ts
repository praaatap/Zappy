import { Request, Response, NextFunction } from 'express';
import { config } from '../../core/config/environment';
import { logger } from '../../core/utils/logger';
export { logger };

// Global error handler middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Unhandled Error:', error);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    ...(config.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

// Async handler to wrap async route handlers
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
