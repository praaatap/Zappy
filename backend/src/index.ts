import express from 'express';
import client from 'prom-client';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './core/config/db';
import http from 'http';
import { Server } from 'socket.io';
import { config } from './core/config/environment';
import { globalRateLimiter } from './api/middlewares/rateLimiter';
import { errorHandler, logger } from './api/middlewares/errorHandler';
import { morganStream } from './core/utils/logger';

const app = express();
const server = http.createServer(app);

// Security & Monitoring
app.use(helmet());
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'zappy_api_' });

const httpRequestsTotal = new client.Counter({
  name: 'zappy_api_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status']
});

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode
    });
  });
  next();
});

// Core Middleware
app.use(cors({
  origin: config.ALLOWED_ORIGINS,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined', { stream: morganStream }));
app.use(globalRateLimiter);

// Database Connection
connectDB();

// Routes
import authRoutes from './api/routes/auth';
import workflowRoutes from './api/routes/workflows';
import webhookRoutes from './api/routes/webhooks';
import executionRoutes from './api/routes/executions';
import zapRoutes from './api/routes/zap';
import statsRoutes from './api/routes/stats';
import templateRoutes from './api/routes/templates';
import integrationRoutes from './api/routes/integrations';

// API Endpoints
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/workflows', workflowRoutes);
app.use('/api/v1/webhooks', webhookRoutes);
app.use('/api/v1/executions', executionRoutes);
app.use('/api/v1/zap', zapRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1/integrations', integrationRoutes);

// Metrics Endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Zappy Core API is running',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = config.PORT;

if (process.env.NODE_ENV !== "production") {
  server.listen(PORT, () => {
    logger.info(`🚀 Zappy Core API running on port ${PORT} | Environment: ${config.NODE_ENV}`);
  });
}

export default app;

// Graceful shutdown
const shutdown = async (signal: string) => {
  try {
    logger.warn(`Received ${signal}, shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
    // Fallback exit if close hangs
    setTimeout(() => process.exit(0), 5000).unref();
  } catch (err) {
    logger.error('Error during shutdown', { err });
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection', { reason });
});
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error });
  shutdown('uncaughtException');
});
