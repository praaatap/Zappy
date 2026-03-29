// Workflow Engine - Execute workflows with trigger-action logic using Drizzle ORM

import { db } from "@/lib/db";
import { zaps, zapRuns, actions } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { actionHandlers, ActionContext } from "./actionHandlers";

export interface WorkflowExecutionResult {
  success: boolean;
  executionId: string;
  workflowId: string;
  results: Array<{
    actionId: string;
    actionType: string;
    status: 'success' | 'failed' | 'skipped';
    output?: Record<string, any>;
    error?: string;
  }>;
  duration: number;
}

/**
 * Execute a workflow with the given trigger data
 */
export async function executeWorkflow(
  workflowId: string,
  triggerData: Record<string, any>
): Promise<WorkflowExecutionResult> {
  const startTime = Date.now();
  
  try {
    // Find the workflow with its actions
    const zap = await db.query.zaps.findFirst({
      where: eq(zaps.id, workflowId),
      with: {
        actions: {
          orderBy: [desc(actions.sortingOrder)]
        }
      }
    });

    if (!zap) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    // Check if workflow is active
    if (zap.status !== 'active') {
      throw new Error(`Workflow is not active (status: ${zap.status})`);
    }

    const executionId = uuidv4();

    // Create execution log (zapRuns)
    await db.insert(zapRuns).values({
      id: executionId,
      zapId: zap.id,
      status: 'running',
      metadata: triggerData,
      startedAt: new Date(),
    });

    console.log(`⚡ Executing workflow: ${zap.name} (${zap.id})`);

    // Context for variable replacement - starts with trigger data
    // subsequent steps can access this via {{trigger.field}} or {{step_N.field}}
    const contextData: Record<string, any> = {
      trigger: triggerData,
    };

    // Execute each action in order
    const results: WorkflowExecutionResult['results'] = [];
    let hasFailed = false;
    let hasPendingApproval = false;

    // Sorting order is ascending
    const sortedActions = [...zap.actions].sort((a, b) => (a.sortingOrder || 0) - (b.sortingOrder || 0));

    for (let i = 0; i < sortedActions.length; i++) {
      const action = sortedActions[i];
      const stepKey = `step_${i + 1}`;

      if ((hasFailed && action.type !== 'condition') || hasPendingApproval) {
        // Skip remaining actions if one failed or pending approval
        results.push({
          actionId: action.id,
          actionType: action.type,
          status: 'skipped',
        });
        continue;
      }

      const result = await executeAction(action, contextData, zap, executionId);
      results.push(result);

      if (result.status === 'success') {
        // Add this step's output to the context for future steps
        contextData[stepKey] = result.output;
        if (action.type === 'wait-for-approval') {
          hasPendingApproval = true;
        }
      } else if (result.status === 'failed') {
        hasFailed = true;
      }
    }

    // Update execution log
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    let finalStatus = 'success';
    if (hasFailed) finalStatus = 'failed';
    else if (hasPendingApproval) finalStatus = 'pending_approval';

    await db.update(zapRuns).set({
      status: finalStatus,
      completedAt: hasPendingApproval ? null : new Date(),
    }).where(eq(zapRuns.id, executionId));

    // Update zap's updatedAt
    await db.update(zaps).set({
      updatedAt: new Date(),
    }).where(eq(zaps.id, zap.id));

    console.log(
      `✅ Workflow execution completed: ${finalStatus.toUpperCase()} in ${duration}ms`
    );

    return {
      success: !hasFailed,
      executionId: executionId,
      workflowId: zap.id,
      results,
      duration,
    };
  } catch (error: any) {
    console.error('❌ Workflow execution error:', error);
    return {
      success: false,
      executionId: '',
      workflowId,
      results: [],
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Execute a single action
 */
async function executeAction(
  action: any,
  contextData: Record<string, any>,
  zap: any,
  executionId: string
): Promise<WorkflowExecutionResult['results'][0]> {
  const handler = actionHandlers[action.type];

  if (!handler) {
    console.warn(`⚠️ No handler found for action type: ${action.type}`);
    return {
      actionId: action.id,
      actionType: action.type,
      status: 'failed',
      error: `Unknown action type: ${action.type}`,
    };
  }

  try {
    const context: ActionContext = {
      workflowId: zap.id,
      executionId,
      data: contextData, // Pass the cumulative data context
      userId: zap.userId.toString(),
    };

    console.log(`🔧 Executing action: ${action.type} (${action.id})`);

    const result = await handler(action.metadata || {}, context);

    if (result.success) {
      return {
        actionId: action.id,
        actionType: action.type,
        status: 'success',
        output: result.output,
      };
    } else {
      return {
        actionId: action.id,
        actionType: action.type,
        status: 'failed',
        error: result.error,
      };
    }
  } catch (error: any) {
    console.error(`❌ Action ${action.type} failed:`, error);
    return {
      actionId: action.id,
      actionType: action.type,
      status: 'failed',
      error: error.message,
    };
  }
}
