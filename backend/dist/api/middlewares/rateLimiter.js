"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookRateLimiter = exports.authRateLimiter = exports.globalRateLimiter = exports.createRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const environment_1 = require("../../core/config/environment");
// Simple in-memory rate limiter (no Redis dependency for basic setup)
const createRateLimiter = (windowMs, max) => {
    if (!environment_1.config.ENABLE_RATE_LIMITING) {
        return (req, res, next) => next();
    }
    return (0, express_rate_limit_1.default)({
        windowMs,
        max,
        message: 'Too many requests, please try again later',
        standardHeaders: true,
        legacyHeaders: false,
    });
};
exports.createRateLimiter = createRateLimiter;
// Global rate limiter
exports.globalRateLimiter = (0, exports.createRateLimiter)(environment_1.config.RATE_LIMIT_WINDOW, environment_1.config.RATE_LIMIT_MAX_REQUESTS);
// Stricter limit for auth endpoints
exports.authRateLimiter = (0, exports.createRateLimiter)(15 * 60 * 1000, 5); // 5 attempts per 15 min
// Strict limit for webhooks (to prevent spam)
exports.webhookRateLimiter = (0, exports.createRateLimiter)(60 * 1000, 100); // 100 per minute
