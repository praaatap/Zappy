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
// Webhook endpoint to trigger a workflow
router.post('/trigger/:workflowId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workflowId } = req.params;
        const payload = req.body;
        // Try to find the workflow by ID or by webhook URL fragment (in real app, use a unique token)
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
        // Create an execution log
        const execution = yield models_1.ExecutionLog.create({
            workflowId: workflow._id,
            status: 'running',
            triggerData: payload,
            startedAt: new Date(),
            results: []
        });
        // Simulate Action Execution
        // In a real app, this should be sent to a message queue (like RabbitMQ, Kafka, or Bull)
        executeActions(workflow, execution._id, payload);
        res.status(200).json({ message: 'Workflow triggered', executionId: execution._id });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}));
function executeActions(workflow, executionId, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        let success = true;
        const results = [];
        for (const action of workflow.actions) {
            // Mock processing an action
            try {
                console.log(`Executing action ${action.type} for workflow ${workflow._id}`);
                // Fake delay
                yield new Promise(resolve => setTimeout(resolve, 1000));
                results.push({
                    actionId: action.id,
                    actionType: action.type,
                    status: 'success',
                    output: { result: `Completed ${action.type}` },
                    executedAt: new Date()
                });
            }
            catch (err) {
                success = false;
                results.push({
                    actionId: action.id,
                    actionType: action.type,
                    status: 'failed',
                    error: err.message || 'Action failed',
                    executedAt: new Date()
                });
                break; // Stop executing further actions if one fails (pipeline behavior)
            }
        }
        // Update execution log and workflow stats
        yield models_1.ExecutionLog.findByIdAndUpdate(executionId, {
            status: success ? 'success' : 'failed',
            results,
            completedAt: new Date()
        });
        yield models_1.Workflow.findByIdAndUpdate(workflow._id, {
            $inc: { executionCount: 1 },
            lastExecutedAt: new Date()
        });
    });
}
exports.default = router;
