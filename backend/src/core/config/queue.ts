import { Queue, ConnectionOptions } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

// Redis connection options
export const redisOptions: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
};

// Reusable connections
export const redisConnection = new IORedis(redisOptions);

// Dedicated connections for Pub/Sub (Redis requires separate connections for sub)
export const pubClient = new IORedis(redisOptions);
export const subClient = new IORedis(redisOptions);
export const pubSubListener = new IORedis(redisOptions); // For general backend event listening

// Main Job Queue for executing Workflows/Zaps
export const executionQueue = new Queue('workflow-executions', { 
  connection: redisConnection 
});

console.log('Redis Queue Configured: workflow-executions');
