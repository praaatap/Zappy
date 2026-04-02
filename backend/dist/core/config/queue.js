"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executionQueue = exports.pubSubListener = exports.subClient = exports.pubClient = exports.redisConnection = exports.redisOptions = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Redis connection options
exports.redisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    maxRetriesPerRequest: null,
};
// Reusable connections
exports.redisConnection = new ioredis_1.default(exports.redisOptions);
// Dedicated connections for Pub/Sub (Redis requires separate connections for sub)
exports.pubClient = new ioredis_1.default(exports.redisOptions);
exports.subClient = new ioredis_1.default(exports.redisOptions);
exports.pubSubListener = new ioredis_1.default(exports.redisOptions); // For general backend event listening
// Main Job Queue for executing Workflows/Zaps
exports.executionQueue = new bullmq_1.Queue('workflow-executions', {
    connection: exports.redisConnection
});
console.log('Redis Queue Configured: workflow-executions');
