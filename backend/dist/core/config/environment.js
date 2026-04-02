"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    // Server
    PORT: parseInt(process.env.PORT || '5000'),
    NODE_ENV: process.env.NODE_ENV || 'development',
    // Database (PostgreSQL with Drizzle ORM)
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/zappy',
    // Legacy MongoDB support (deprecated)
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/zappy',
    // Redis
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379'),
    // JWT Security
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
    // Rate Limiting
    RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    // CORS
    ALLOWED_ORIGINS: ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) || ['http://localhost:3000', 'http://localhost:5000'],
    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    // Features
    ENABLE_RATE_LIMITING: process.env.ENABLE_RATE_LIMITING !== 'false',
    ENABLE_JWT_AUTH: process.env.ENABLE_JWT_AUTH !== 'false',
    // External APIs (for Integration)
    SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID || '',
    GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
};
