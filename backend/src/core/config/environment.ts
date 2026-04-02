import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  PORT: parseInt(process.env.PORT || '5000'),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database (PostgreSQL with Drizzle ORM)
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/zappy',
  
  // Clerk Authentication
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || '',
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || '',

  // Redis
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379'),


  // Rate Limiting
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),

  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5000'],

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Features
  ENABLE_RATE_LIMITING: process.env.ENABLE_RATE_LIMITING !== 'false',

  // External APIs (for Integration)
  SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID || '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
};
