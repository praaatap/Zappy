// Workflow Engine - Execute workflows with trigger-action logic using Appwrite

import { v4 as uuidv4 } from "uuid";
import {
  getWorkflowById,
  createExecutionLog,
  updateExecutionLog,
  updateExecutionStatus,
  AppwriteWorkflow,
} from "@/lib/appwrite";
import { actionHandlers, ActionContext } from "./actionHandlers";

export interface WorkflowExecutionResult {
  success: boolean;
  executionId: string;
  workflowId: string;
  results: Array<{
    actionId: string;
    actionType: string;
    status: "success" | "failed" | "skipped";
    output?: Record<string, any>;
    error?: string;
  }>;
  duration: number;
}

/**
 * Execute a workflow with the given trigger data
 */
export async function executeWorkflow(
  workflow: AppwriteWorkflow,
  triggerData: Record<string, any>,
  executionId: string
): Promise<WorkflowExecutionResult> {
  const startTime = Date.now();

  try {
    // Update execution status to running
    await updateExecutionStatus(executionId, "running");

    console.log(`⚡ Executing workflow: ${workflow.name} (${workflow.$id})`);

    // Context for variable replacement - starts with trigger data
    // subsequent steps can access this via {{trigger.field}} or {{step_N.field}}
    const contextData: Record<string, any> = {
      trigger: triggerData,
    };

    // Execute each action in order
    const results: WorkflowExecutionResult["results"] = [];
    let hasFailed = false;

    // Sort actions by ID (assuming they come pre-sorted from Appwrite)
    const sortedActions = (workflow.actions || []).sort(
      (a, b) => (a.id?.localeCompare(b.id || "") || 0)
    );

    for (let i = 0; i < sortedActions.length; i++) {
      const action = sortedActions[i];
      const stepKey = `step_${i + 1}`;

      if (hasFailed && action.type !== "condition") {
        // Skip remaining actions if one failed (unless it's a condition)
        results.push({
          actionId: action.id,
          actionType: action.type,
          status: "skipped",
        });
        continue;
      }

      const result = await executeAction(
        action,
        contextData,
        workflow,
        executionId
      );
      results.push(result);

      if (result.status === "success") {
        // Add this step's output to the context for future steps
        contextData[stepKey] = result.output;
      } else if (result.status === "failed") {
        hasFailed = true;
      }
    }

    // Update execution log
    const endTime = Date.now();
    const duration = endTime - startTime;

    await updateExecutionStatus(
      executionId,
      hasFailed ? "failed" : "completed"
    );

    console.log(
      `✅ Workflow execution completed: ${hasFailed ? "FAILED" : "SUCCESS"} in ${duration}ms`
    );

    return {
      success: !hasFailed,
      executionId,
      workflowId: workflow.$id,
      results,
      duration,
    };
  } catch (error: any) {
    console.error("❌ Workflow execution error:", error);
    await updateExecutionStatus(executionId, "failed", error.message);
    return {
      success: false,
      executionId,
      workflowId: workflow.$id,
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
  workflow: AppwriteWorkflow,
  executionId: string
): Promise<WorkflowExecutionResult["results"][0]> {
  const handler = actionHandlers[action.type];

  if (!handler) {
    console.warn(`⚠️ No handler found for action type: ${action.type}`);
    return {
      actionId: action.id,
      actionType: action.type,
      status: "failed",
      error: `Unknown action type: ${action.type}`,
    };
  }

  try {
    const context: ActionContext = {
      workflowId: workflow.$id,
      executionId,
      data: contextData,
      userId: workflow.userId,
    };

    console.log(`🔧 Executing action: ${action.type} (${action.id})`);

    const result = await handler(action.config || {}, context);

    if (result.success) {
      return {
        actionId: action.id,
        actionType: action.type,
        status: "success",
        output: result.output,
      };
    } else {
      return {
        actionId: action.id,
        actionType: action.type,
        status: "failed",
        error: result.error,
      };
    }
  } catch (error: any) {
    console.error(`❌ Action ${action.type} failed:`, error);
    return {
      actionId: action.id,
      actionType: action.type,
      status: "failed",
      error: error.message,
    };
  }
}
