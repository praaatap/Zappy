"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prom_client_1 = __importDefault(require("prom-client"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const db_1 = __importDefault(require("./core/config/db"));
const http_1 = __importDefault(require("http"));
const environment_1 = require("./core/config/environment");
const rateLimiter_1 = require("./api/middlewares/rateLimiter");
const errorHandler_1 = require("./api/middlewares/errorHandler");
const logger_1 = require("./core/utils/logger");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Security & Monitoring
app.use((0, helmet_1.default)());
const collectDefaultMetrics = prom_client_1.default.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'zappy_api_' });
const httpRequestsTotal = new prom_client_1.default.Counter({
    name: 'zappy_api_http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status']
});
app.use((req, res, next) => {
    res.on('finish', () => {
        var _a;
        httpRequestsTotal.inc({
            method: req.method,
            route: ((_a = req.route) === null || _a === void 0 ? void 0 : _a.path) || req.path,
            status: res.statusCode
        });
    });
    next();
});
// Core Middleware
app.use((0, cors_1.default)({
    origin: environment_1.config.ALLOWED_ORIGINS,
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use((0, morgan_1.default)('combined', { stream: logger_1.morganStream }));
app.use(rateLimiter_1.globalRateLimiter);
// Database Connection
(0, db_1.default)();
// Routes
const auth_1 = __importDefault(require("./api/routes/auth"));
const workflows_1 = __importDefault(require("./api/routes/workflows"));
const webhooks_1 = __importDefault(require("./api/routes/webhooks"));
const executions_1 = __importDefault(require("./api/routes/executions"));
const zap_1 = __importDefault(require("./api/routes/zap"));
const stats_1 = __importDefault(require("./api/routes/stats"));
const templates_1 = __importDefault(require("./api/routes/templates"));
const integrations_1 = __importDefault(require("./api/routes/integrations"));
// API Endpoints
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/workflows', workflows_1.default);
app.use('/api/v1/webhooks', webhooks_1.default);
app.use('/api/v1/executions', executions_1.default);
app.use('/api/v1/zap', zap_1.default);
app.use('/api/v1/stats', stats_1.default);
app.use('/api/v1/templates', templates_1.default);
app.use('/api/v1/integrations', integrations_1.default);
// Metrics Endpoint
app.get('/metrics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.set('Content-Type', prom_client_1.default.register.contentType);
    res.end(yield prom_client_1.default.register.metrics());
}));
// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Zappy Core API is running',
        timestamp: new Date().toISOString()
    });
});
// Global Error Handler
app.use(errorHandler_1.errorHandler);
const PORT = environment_1.config.PORT;
server.listen(PORT, () => {
    errorHandler_1.logger.info(`🚀 Zappy Core API running on port ${PORT} | Environment: ${environment_1.config.NODE_ENV}`);
});
// Graceful shutdown
const shutdown = (signal) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        errorHandler_1.logger.warn(`Received ${signal}, shutting down gracefully...`);
        server.close(() => {
            errorHandler_1.logger.info('HTTP server closed');
            process.exit(0);
        });
        // Fallback exit if close hangs
        setTimeout(() => process.exit(0), 5000).unref();
    }
    catch (err) {
        errorHandler_1.logger.error('Error during shutdown', { err });
        process.exit(1);
    }
});
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
    errorHandler_1.logger.error('Unhandled Promise Rejection', { reason });
});
process.on('uncaughtException', (error) => {
    errorHandler_1.logger.error('Uncaught Exception', { error });
    shutdown('uncaughtException');
});
