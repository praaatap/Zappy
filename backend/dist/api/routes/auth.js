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
const express_1 = require("express");
const models_1 = require("../../data/models");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const auth_1 = require("../middlewares/auth");
const errorHandler_1 = require("../middlewares/errorHandler");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
// Login with proper security and JWT
router.post('/login', rateLimiter_1.authRateLimiter, (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    const user = yield models_1.User.findOne({ email });
    if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
        errorHandler_1.logger.warn('Failed login attempt', { email });
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = (0, auth_1.generateToken)(user._id.toString(), user.email);
    errorHandler_1.logger.info('User logged in', { email });
    res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, subscriptionPlan: user.subscriptionPlan }
    });
})));
// Signup with proper password hashing
router.post('/signup', rateLimiter_1.authRateLimiter, (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password required' });
    }
    const existingUser = yield models_1.User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const user = yield models_1.User.create({ name, email, password: hashedPassword });
    const token = (0, auth_1.generateToken)(user._id.toString(), user.email);
    errorHandler_1.logger.info('New user registered', { email });
    res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email }
    });
})));
// Get current user profile
router.get('/me', (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers['x-user-id'] || req.body.userId;
    if (!userId)
        return res.status(401).json({ error: 'Unauthorized' });
    const user = yield models_1.User.findById(userId).select('-password');
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    res.json({ user });
})));
exports.default = router;
