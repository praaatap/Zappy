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
const bullmq_1 = require("bullmq");
const queue_1 = require("./core/config/queue");
const models_1 = require("./data/models");
const db_1 = __importDefault(require("./core/config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Connect Worker Microservice to Database
(0, db_1.default)();
console.log('👷 Worker Microservice initialized, waiting for jobs on [workflow-executions] queue...');
// Logic extracted from Webhook - now runs fully async in a separate Node process
const executeActions = (workflow, executionId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    let success = true;
    const results = [];
    for (const action of workflow.actions) {
        try {
            console.log(`[Worker] ✨ Executing action [${action.type}] for workflow [${workflow._id}]`);
            // Here is where you would make external API calls (e.g. to Slack, Email, APIs)
            yield new Promise(resolve => setTimeout(resolve, 1500)); // Fake network delay
            results.push({
                actionId: action.id,
                actionType: action.type,
                status: 'success',
                output: { result: `Successfully fired: ${action.type}` },
                executedAt: new Date()
            });
        }
        catch (err) {
            success = false;
            results.push({
                actionId: action.id,
                actionType: action.type,
                status: 'failed',
                error: err.message || 'Action execution failed',
                executedAt: new Date()
            });
            break; // Stop executing further downstream pipeline actions if one fails
        }
    }
    const finalStatus = success ? 'success' : 'failed';
    const completedAt = new Date();
    // Update execution log in DB
    yield models_1.ExecutionLog.findByIdAndUpdate(executionId, {
        status: finalStatus,
        results,
        completedAt
    });
    yield models_1.Workflow.findByIdAndUpdate(workflow._id, {
        $inc: { executionCount: 1 },
        lastExecutedAt: new Date()
    });
    // 💥 PUB/SUB ARCHITECTURE: Publish the completion event to the Redis Event Bus
    // Any running API server will receive this and pipe it down to the frontend via WebSockets
    yield queue_1.pubClient.publish('WORKFLOW_UPDATES', JSON.stringify({
        workflowId: workflow._id.toString(),
        executionId: executionId,
        status: finalStatus,
        completedAt
    }));
});
// Create a robust Redis-backed Worker process
const executionWorker = new bullmq_1.Worker('workflow-executions', (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { workflowId, executionId, payload } = job.data;
    console.log(`[Worker] 📥 Picked up execution job ${job.id} for Workflow ${workflowId}`);
    const workflow = yield models_1.Workflow.findById(workflowId);
    if (!workflow) {
        console.error(`[Worker] Workflow ${workflowId} not found`);
        return;
    }
    // Execute the business logic!
    yield executeActions(workflow, executionId, payload);
    console.log(`[Worker] ✅ Finished job ${job.id}`);
}), { connection: queue_1.redisConnection });
executionWorker.on('completed', (job) => {
    console.log(`[Worker Event] Job ${job === null || job === void 0 ? void 0 : job.id} marked as completed`);
});
executionWorker.on('failed', (job, err) => {
    console.log(`[Worker Event] Job ${job === null || job === void 0 ? void 0 : job.id} failed with error: ${err.message}`);
});
