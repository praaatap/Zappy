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
const models_1 = require("../models"); // We can map "Zap" to "Workflow" internally
const router = (0, express_1.Router)();
// Create a zap
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { triggerId, actions, name } = req.body;
        // mock user ID from header for simplicity, use a default if missing
        const userId = req.headers['x-user-id'] || '60c72b2f9b1d8b3a4c8e4d1f'; // dummy mongo object id
        // In the existing project schema, trigger uses string type like "Schedule", "Webhook"
        const workflowData = {
            userId,
            name: name || 'Untitled Zap',
            trigger: {
                type: triggerId,
                webhookUrl: `http://localhost:5000/api/v1/webhooks/trigger/${Date.now()}`
            },
            actions: actions.map((a, index) => ({
                id: a.actionId || a.id || `action-${index}`,
                type: a.actionId || 'Unknown',
                order: index
            })),
            status: 'active'
        };
        const workflow = yield models_1.Workflow.create(workflowData);
        res.status(201).json({ id: workflow._id, zap: workflow });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}));
// Get Zaps
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.headers['x-user-id'] || '60c72b2f9b1d8b3a4c8e4d1f';
        const workflows = yield models_1.Workflow.find({ userId });
        res.json({ zaps: workflows });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}));
// Get single Zap
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workflow = yield models_1.Workflow.findById(req.params.id);
        if (!workflow)
            return res.status(404).json({ error: 'Not found' });
        res.json({ zap: workflow });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}));
exports.default = router;
