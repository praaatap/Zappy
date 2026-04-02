"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.optionalAuthMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../../core/config/environment");
const authMiddleware = (req, res, next) => {
    var _a;
    if (!environment_1.config.ENABLE_JWT_AUTH)
        return next();
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No authentication token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, environment_1.config.JWT_SECRET);
        req.userId = decoded.userId;
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.authMiddleware = authMiddleware;
const optionalAuthMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, environment_1.config.JWT_SECRET);
            req.userId = decoded.userId;
            req.user = decoded;
        }
        catch (err) {
            console.log('Token validation failed but continuing');
        }
    }
    next();
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
const generateToken = (userId, email) => {
    return jsonwebtoken_1.default.sign({ userId, email }, environment_1.config.JWT_SECRET, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
