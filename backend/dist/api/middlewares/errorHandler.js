"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = exports.logger = void 0;
const environment_1 = require("../../core/config/environment");
const logger_1 = require("../../core/utils/logger");
Object.defineProperty(exports, "logger", { enumerable: true, get: function () { return logger_1.logger; } });
// Global error handler middleware
const errorHandler = (error, req, res, next) => {
    logger_1.logger.error('Unhandled Error:', error);
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    res.status(statusCode).json(Object.assign({ error: message }, (environment_1.config.NODE_ENV === 'development' && { stack: error.stack })));
};
exports.errorHandler = errorHandler;
// Async handler to wrap async route handlers
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
