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
const queue_1 = require("../../core/config/queue");
const router = (0, express_1.Router)();
// Webhook endpoint to trigger a workflow
router.post('/trigger/:workflowId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workflowId } = req.params;
        const payload = req.body;
        // Try to find the workflow by ID or by webhook URL fragment
        let workflow = yield models_1.Workflow.findById(workflowId).catch(() => null);
        // If not found by ID, try searching if the ID string matches part of the webhook Url
        if (!workflow) {
            const workflows = yield models_1.Workflow.find({ 'trigger.webhookUrl': { $regex: workflowId } });
            if (workflows.length > 0)
                workflow = workflows[0];
        }
        if (!workflow) {
            return res.status(404).json({ error: 'Workflow (Zap) not found' });
        }
        if (workflow.status !== 'active') {
            return res.status(400).json({ error: 'Workflow is not active' });
        }
        // Create an execution log - PENDING state
        const execution = yield models_1.ExecutionLog.create({
            workflowId: workflow._id,
            status: 'running',
            triggerData: payload,
            startedAt: new Date(),
            results: []
        });
        // 💥 MICROSERVICES ARCHITECTURE: Push to Job Queue instead of executing inline
        yield queue_1.executionQueue.add('execute-zap', {
            workflowId: workflow._id.toString(),
            executionId: execution._id.toString(),
            payload
        });
        res.status(200).json({
            message: 'Workflow triggered and queued for execution',
            executionId: execution._id
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}));
exports.default = router;
