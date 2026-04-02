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
const models_1 = require("../models");
const router = (0, express_1.Router)();
// Get all workflows for a user
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // mock user ID from header for simplicity
        const userId = req.headers['x-user-id'];
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const workflows = yield models_1.Workflow.find({ userId });
        res.json({ workflows });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}));
// Get single workflow
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workflow = yield models_1.Workflow.findById(req.params.id);
        if (!workflow)
            return res.status(404).json({ error: 'Not found' });
        res.json({ workflow });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}));
// Create workflow
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        // Add a fake webhook URL
        const workflowData = Object.assign(Object.assign({}, req.body), { userId, trigger: Object.assign(Object.assign({}, req.body.trigger), { webhookUrl: `http://localhost:5000/api/v1/webhooks/trigger/${Date.now()}` // Mock URL for now
             }) });
        const workflow = yield models_1.Workflow.create(workflowData);
        res.status(201).json({ workflow });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}));
// Update workflow
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workflow = yield models_1.Workflow.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ workflow });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}));
exports.default = router;
