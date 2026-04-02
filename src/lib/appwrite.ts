/**
 * Appwrite Client Configuration and Helpers
 * Replaces Drizzle ORM with Appwrite Database API
 */

import { Client, Databases, Storage, Functions, Query } from "appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "");

export const appwriteDB = new Databases(client);
export const appwriteStorage = new Storage(client);
export const appwriteFunctions = new Functions(client);

// Database and collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE || "default";

export const COLLECTIONS = {
  USERS: "users",
  WORKFLOWS: "workflows",
  EXECUTIONS: "executions",
  INTEGRATIONS: "integrations",
  EXECUTION_LOGS: "execution_logs",
  TEMPLATES: "templates",
};

/**
 * Appwrite Data Models
 */

export interface AppwriteUser {
  $id: string;
  clerkId: string;
  email: string;
  name: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppwriteWorkflow {
  $id: string;
  userId: string;
  name: string;
  description?: string;
  trigger: {
    type: string;
    config: Record<string, any>;
  };
  actions: Array<{
    id: string;
    type: string;
    config: Record<string, any>;
  }>;
  status: "active" | "inactive" | "draft";
  webhookId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppwriteExecution {
  $id: string;
  workflowId: string;
  userId: string;
  status: "pending" | "running" | "completed" | "failed";
  startedAt: string;
  completedAt?: string;
  executionData: Record<string, any>;
  errorMessage?: string;
}

export interface AppwriteExecutionLog {
  $id: string;
  executionId: string;
  workflowId: string;
  userId: string;
  actionId: string;
  actionType: string;
  status: "pending" | "completed" | "failed";
  input: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  timestamp: string;
}

export interface AppwriteIntegration {
  $id: string;
  userId: string;
  type: string;
  name: string;
  credentials: Record<string, any>;
  isActive: boolean;
  createdAt: string;
}

/**
 * User Operations
 */
export async function getUserByClerkId(clerkId: string) {
  try {
    const response = await appwriteDB.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [Query.equal("clerkId", clerkId)]
    );
    return response.documents[0] as unknown as AppwriteUser | undefined;
  } catch (error) {
    console.error("Error fetching user:", error);
    return undefined;
  }
}

export async function createOrUpdateUser(
  clerkId: string,
  email: string,
  name: string,
  imageUrl?: string
) {
  try {
    const existing = await getUserByClerkId(clerkId);
    if (existing) {
      return await appwriteDB.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        existing.$id,
        {
          email,
          name,
          imageUrl: imageUrl || existing.imageUrl,
          updatedAt: new Date().toISOString(),
        }
      );
    }

    return await appwriteDB.createDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      clerkId,
      {
        clerkId,
        email,
        name,
        imageUrl: imageUrl || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }
}

/**
 * Workflow Operations
 */
export async function getWorkflowsByUser(userId: string) {
  try {
    const response = await appwriteDB.listDocuments(
      DATABASE_ID,
      COLLECTIONS.WORKFLOWS,
      [Query.equal("userId", userId)]
    );
    return response.documents as unknown as AppwriteWorkflow[];
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return [];
  }
}

export async function getWorkflowById(workflowId: string, userId: string) {
  try {
    const doc = await appwriteDB.getDocument(
      DATABASE_ID,
      COLLECTIONS.WORKFLOWS,
      workflowId
    );
    if (doc.userId !== userId) throw new Error("Unauthorized");
    return doc as unknown as AppwriteWorkflow;
  } catch (error) {
    console.error("Error fetching workflow:", error);
    return undefined;
  }
}

export async function createWorkflow(
  userId: string,
  name: string,
  trigger: any,
  actions: any
) {
  try {
    return await appwriteDB.createDocument(
      DATABASE_ID,
      COLLECTIONS.WORKFLOWS,
      "unique()",
      {
        userId,
        name,
        trigger,
        actions: actions || [],
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error creating workflow:", error);
    throw error;
  }
}

export async function updateWorkflow(
  workflowId: string,
  userIdOrUpdates?: string | Partial<AppwriteWorkflow>,
  updates?: Partial<AppwriteWorkflow>
) {
  try {
    // Support both old signature (workflowId, userId, updates) and new signature (workflowId, updates)
    let actualUpdates: Partial<AppwriteWorkflow>;
    let userId: string | undefined;

    if (typeof userIdOrUpdates === "string") {
      userId = userIdOrUpdates;
      actualUpdates = updates || {};
    } else {
      actualUpdates = userIdOrUpdates || {};
    }

    // If userId is provided, verify ownership
    if (userId) {
      const workflow = await getWorkflowById(workflowId, userId);
      if (!workflow) throw new Error("Workflow not found");
    }

    return await appwriteDB.updateDocument(
      DATABASE_ID,
      COLLECTIONS.WORKFLOWS,
      workflowId,
      {
        ...actualUpdates,
        updatedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error updating workflow:", error);
    throw error;
  }
}

export async function deleteWorkflow(workflowId: string, userId?: string) {
  try {
    // If userId is provided, verify ownership first
    if (userId) {
      const workflow = await getWorkflowById(workflowId, userId);
      if (!workflow) throw new Error("Workflow not found");
    }

    return await appwriteDB.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.WORKFLOWS,
      workflowId
    );
  } catch (error) {
    console.error("Error deleting workflow:", error);
    throw error;
  }
}

/**
 * Execution Operations
 */
export async function createExecution(
  workflowId: string,
  userId: string,
  executionData: Record<string, any>
) {
  try {
    return await appwriteDB.createDocument(
      DATABASE_ID,
      COLLECTIONS.EXECUTIONS,
      "unique()",
      {
        workflowId,
        userId,
        status: "pending",
        executionData,
        startedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error creating execution:", error);
    throw error;
  }
}

export async function updateExecutionStatus(
  executionId: string,
  status: "running" | "completed" | "failed",
  errorMessage?: string
) {
  try {
    const updates: any = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (status === "completed" || status === "failed") {
      updates.completedAt = new Date().toISOString();
    }
    if (errorMessage) {
      updates.errorMessage = errorMessage;
    }
    return await appwriteDB.updateDocument(
      DATABASE_ID,
      COLLECTIONS.EXECUTIONS,
      executionId,
      updates
    );
  } catch (error) {
    console.error("Error updating execution:", error);
    throw error;
  }
}

export async function getExecutionsByWorkflow(workflowId: string) {
  try {
    const response = await appwriteDB.listDocuments(
      DATABASE_ID,
      COLLECTIONS.EXECUTIONS,
      [Query.equal("workflowId", workflowId)]
    );
    return response.documents as unknown as AppwriteExecution[];
  } catch (error) {
    console.error("Error fetching executions:", error);
    return [];
  }
}

/**
 * Execution Log Operations
 */
export async function createExecutionLog(
  executionId: string,
  workflowId: string,
  userId: string,
  actionId: string,
  actionType: string,
  input: Record<string, any>
) {
  try {
    return await appwriteDB.createDocument(
      DATABASE_ID,
      COLLECTIONS.EXECUTION_LOGS,
      "unique()",
      {
        executionId,
        workflowId,
        userId,
        actionId,
        actionType,
        status: "pending",
        input,
        timestamp: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error creating execution log:", error);
    throw error;
  }
}

export async function updateExecutionLog(
  logId: string,
  status: "completed" | "failed",
  output?: Record<string, any>,
  error?: string
) {
  try {
    return await appwriteDB.updateDocument(
      DATABASE_ID,
      COLLECTIONS.EXECUTION_LOGS,
      logId,
      {
        status,
        output: output || null,
        error: error || null,
        timestamp: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error updating execution log:", error);
    throw error;
  }
}

export async function getExecutionLogs(executionId: string) {
  try {
    const response = await appwriteDB.listDocuments(
      DATABASE_ID,
      COLLECTIONS.EXECUTION_LOGS,
      [Query.equal("executionId", executionId)]
    );
    return response.documents as unknown as AppwriteExecutionLog[];
  } catch (error) {
    console.error("Error fetching execution logs:", error);
    return [];
  }
}

/**
 * Integration Operations
 */
export async function getIntegrationsByUser(userId: string) {
  try {
    const response = await appwriteDB.listDocuments(
      DATABASE_ID,
      COLLECTIONS.INTEGRATIONS,
      [Query.equal("userId", userId)]
    );
    return response.documents as unknown as AppwriteIntegration[];
  } catch (error) {
    console.error("Error fetching integrations:", error);
    return [];
  }
}

export async function createIntegration(
  userId: string,
  type: string,
  name: string,
  credentials: Record<string, any>
) {
  try {
    return await appwriteDB.createDocument(
      DATABASE_ID,
      COLLECTIONS.INTEGRATIONS,
      "unique()",
      {
        userId,
        type,
        name,
        credentials,
        isActive: true,
        createdAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error creating integration:", error);
    throw error;
  }
}

/**
 * Stats Operations
 */
export async function getStats(userId: string) {
  try {
    const workflows = await appwriteDB.listDocuments(
      DATABASE_ID,
      COLLECTIONS.WORKFLOWS,
      [Query.equal("userId", userId)]
    );

    const executions = await appwriteDB.listDocuments(
      DATABASE_ID,
      COLLECTIONS.EXECUTIONS,
      [Query.equal("userId", userId)]
    );

    const activeWorkflows = workflows.documents.filter(
      (w) => w.status === "active"
    ).length;
    const totalExecutions = executions.total;
    const successfulExecutions = executions.documents.filter(
      (e) => e.status === "completed"
    ).length;
    const failedExecutions = executions.documents.filter(
      (e) => e.status === "failed"
    ).length;

    return {
      activeWorkflows,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      successRate:
        totalExecutions > 0
          ? Math.round((successfulExecutions / totalExecutions) * 100)
          : 0,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      activeWorkflows: 0,
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      successRate: 0,
    };
  }
}
