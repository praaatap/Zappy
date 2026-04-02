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
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./core/config/db"));
const prom_client_1 = __importDefault(require("prom-client"));
const webhooks_1 = __importDefault(require("./api/routes/webhooks"));
const logger_1 = require("./core/utils/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use((0, morgan_1.default)('combined', { stream: logger_1.morganStream }));
(0, db_1.default)();
// 📈 Prometheus Metrics Collection for Webhooks
const collectDefaultMetrics = prom_client_1.default.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'zappy_webhook_' });
const httpRequestsTotal = new prom_client_1.default.Counter({
    name: 'zappy_webhook_requests_total',
    help: 'Total number of webhook requests',
    labelNames: ['method', 'route', 'status']
});
app.use((req, res, next) => {
    res.on('finish', () => {
        var _a;
        httpRequestsTotal.inc({ method: req.method, route: ((_a = req.route) === null || _a === void 0 ? void 0 : _a.path) || req.path, status: res.statusCode });
    });
    next();
});
// Expose Metrics Endpoint
app.get('/metrics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.set('Content-Type', prom_client_1.default.register.contentType);
    res.end(yield prom_client_1.default.register.metrics());
}));
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Zappy Webhook Service is running',
        timestamp: new Date().toISOString()
    });
});
// Mount ONLY webhooks here
app.use('/api/v1/webhooks', webhooks_1.default);
const PORT = process.env.WEBHOOK_PORT || 5001;
const server = app.listen(PORT, () => {
    logger_1.logger.info(`🚀 Webhook Ingestion Microservice running on port ${PORT}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger_1.logger.info('Received SIGTERM, shutting down webhook service...');
    server.close(() => {
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    logger_1.logger.info('Received SIGINT, shutting down webhook service...');
    server.close(() => {
        process.exit(0);
    });
});
