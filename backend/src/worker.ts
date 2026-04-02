import { Worker, Job } from 'bullmq';
import { redisConnection, pubClient } from './core/config/queue';
import { Workflow, ExecutionLog } from './data/models';
import connectDB from './core/config/db';
import dotenv from 'dotenv';
dotenv.config();

// Connect Worker Microservice to Database
connectDB();

console.log('👷 Worker Microservice initialized, waiting for jobs on [workflow-executions] queue...');

// Logic extracted from Webhook - now runs fully async in a separate Node process
const executeActions = async (workflow: any, executionId: string, payload: any) => {
    let success = true;
    const results = [];

    for (const action of workflow.actions) {
        try {
            console.log(`[Worker] ✨ Executing action [${action.type}] for workflow [${workflow._id}]`);
            // Here is where you would make external API calls (e.g. to Slack, Email, APIs)
            await new Promise(resolve => setTimeout(resolve, 1500)); // Fake network delay

            results.push({
                actionId: action.id,
                actionType: action.type,
                status: 'success',
                output: { result: `Successfully fired: ${action.type}` },
                executedAt: new Date()
            });
        } catch (err: any) {
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
    await ExecutionLog.findByIdAndUpdate(executionId, {
        status: finalStatus,
        results,
        completedAt
    });

    await Workflow.findByIdAndUpdate(workflow._id, {
        $inc: { executionCount: 1 },
        lastExecutedAt: new Date()
    });

    // 💥 PUB/SUB ARCHITECTURE: Publish the completion event to the Redis Event Bus
    // Any running API server will receive this and pipe it down to the frontend via WebSockets
    await pubClient.publish('WORKFLOW_UPDATES', JSON.stringify({
        workflowId: workflow._id.toString(),
        executionId: executionId,
        status: finalStatus,
        completedAt
    }));
};

// Create a robust Redis-backed Worker process
const executionWorker = new Worker('workflow-executions', async (job: Job) => {
    const { workflowId, executionId, payload } = job.data;
    console.log(`[Worker] 📥 Picked up execution job ${job.id} for Workflow ${workflowId}`);

    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
        console.error(`[Worker] Workflow ${workflowId} not found`);
        return;
    }

    // Execute the business logic!
    await executeActions(workflow, executionId, payload);
    console.log(`[Worker] ✅ Finished job ${job.id}`);

}, { connection: redisConnection });

executionWorker.on('completed', (job) => {
    console.log(`[Worker Event] Job ${job?.id} marked as completed`);
});

executionWorker.on('failed', (job, err) => {
    console.log(`[Worker Event] Job ${job?.id} failed with error: ${err.message}`);
});
