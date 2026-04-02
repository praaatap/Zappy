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
exports.connectDB = exports.db = void 0;
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const environment_1 = require("./environment");
const logger_1 = require("../../core/utils/logger");
// Create postgres client
const client = (0, postgres_1.default)(environment_1.config.DATABASE_URL, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 5
});
// Create drizzle instance
exports.db = (0, postgres_js_1.drizzle)(client);
// Test connection
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client `SELECT 1`;
        logger_1.logger.info('PostgreSQL Connected successfully');
    }
    catch (error) {
        logger_1.logger.error('Error connecting to PostgreSQL', { error });
        throw error;
    }
});
exports.connectDB = connectDB;
exports.default = exports.db;
