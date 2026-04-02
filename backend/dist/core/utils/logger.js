"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganStream = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const environment_1 = require("../config/environment");
const { combine, timestamp, json, colorize, errors } = winston_1.default.format;
exports.logger = winston_1.default.createLogger({
    level: environment_1.config.LOG_LEVEL,
    format: combine(errors({ stack: true }), timestamp(), json()),
    defaultMeta: { service: 'zappy-backend' },
    transports: [
        new winston_1.default.transports.Console({
            format: combine(colorize(), timestamp(), json())
        })
    ]
});
// Morgan stream adapter for HTTP logging
exports.morganStream = {
    write: (message) => {
        exports.logger.info(message.trim());
    }
};
