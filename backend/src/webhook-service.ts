import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './core/config/db';
import client from 'prom-client';
import webhookRoutes from './api/routes/webhooks';
import { morganStream, logger } from './core/utils/logger';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined', { stream: morganStream }));

connectDB();

// 📈 Prometheus Metrics Collection for Webhooks
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'zappy_webhook_' });

const httpRequestsTotal = new client.Counter({
  name: 'zappy_webhook_requests_total',
  help: 'Total number of webhook requests',
  labelNames: ['method', 'route', 'status']
});

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestsTotal.inc({ method: req.method, route: req.route?.path || req.path, status: res.statusCode });
  });
  next();
});

// Expose Metrics Endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Zappy Webhook Service is running',
    timestamp: new Date().toISOString()
  });
});

// Mount ONLY webhooks here
app.use('/api/v1/webhooks', webhookRoutes);

const PORT = process.env.WEBHOOK_PORT || 5001;

const server = app.listen(PORT, () => {
    logger.info(`🚀 Webhook Ingestion Microservice running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('Received SIGTERM, shutting down webhook service...');
    server.close(() => {
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('Received SIGINT, shutting down webhook service...');
    server.close(() => {
        process.exit(0);
    });
});
