import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { config } from '../../core/config/environment';

// Simple in-memory rate limiter (no Redis dependency for basic setup)
export const createRateLimiter = (windowMs: number, max: number) => {
  if (!config.ENABLE_RATE_LIMITING) {
    return (req: Request, res: Response, next: NextFunction) => next();
  }

  return rateLimit({
    windowMs,
    max,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Global rate limiter
export const globalRateLimiter = createRateLimiter(
  config.RATE_LIMIT_WINDOW,
  config.RATE_LIMIT_MAX_REQUESTS
);

// Stricter limit for auth endpoints
export const authRateLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 attempts per 15 min

// Strict limit for webhooks (to prevent spam)
export const webhookRateLimiter = createRateLimiter(60 * 1000, 100); // 100 per minute
