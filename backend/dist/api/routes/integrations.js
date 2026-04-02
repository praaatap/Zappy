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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../../data/models");
const errorHandler_1 = require("../middlewares/errorHandler");
const router = (0, express_1.Router)();
// Get all integrations for a user
router.get('/', (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers['x-user-id'] || '60c72b2f9b1d8b3a4c8e4d1f';
    const user = yield models_1.User.findById(userId);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    const integrations = user.integrations || [];
    res.json({ integrations });
})));
// Connect Slack integration
router.post('/slack/connect', (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers['x-user-id'] || '60c72b2f9b1d8b3a4c8e4d1f';
    const { slackToken, slackTeamId } = req.body;
    if (!slackToken || !slackTeamId) {
        return res.status(400).json({ error: 'Slack token and team ID required' });
    }
    const user = yield models_1.User.findById(userId);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    // Store Slack integration
    if (!user.integrations)
        user.integrations = [];
    user.integrations.push({
        type: 'slack',
        credentials: { slackToken, slackTeamId },
        connectedAt: new Date()
    });
    yield user.save();
    errorHandler_1.logger.info('Slack integration connected', { userId });
    res.json({ message: 'Slack connected successfully' });
})));
// Connect GitHub integration
router.post('/github/connect', (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers['x-user-id'] || '60c72b2f9b1d8b3a4c8e4d1f';
    const { githubToken } = req.body;
    if (!githubToken) {
        return res.status(400).json({ error: 'GitHub token required' });
    }
    const user = yield models_1.User.findById(userId);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    if (!user.integrations)
        user.integrations = [];
    user.integrations.push({
        type: 'github',
        credentials: { githubToken },
        connectedAt: new Date()
    });
    yield user.save();
    errorHandler_1.logger.info('GitHub integration connected', { userId });
    res.json({ message: 'GitHub connected successfully' });
})));
// Disconnect integration
router.delete('/:type', (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers['x-user-id'] || '60c72b2f9b1d8b3a4c8e4d1f';
    const { type } = req.params;
    const user = yield models_1.User.findById(userId);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    user.integrations = (user.integrations || []).filter((i) => i.type !== type);
    yield user.save();
    errorHandler_1.logger.info('Integration disconnected', { userId, type });
    res.json({ message: `${type} integration removed` });
})));
exports.default = router;
