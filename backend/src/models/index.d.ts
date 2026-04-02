import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    subscriptionPlan: 'free' | 'pro' | 'enterprise';
    workflowsCount: number;
    executionsThisMonth: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface IWorkflow extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    status: 'draft' | 'active' | 'paused' | 'error';
    trigger: {
        type: string;
        config: Record<string, any>;
        webhookUrl?: string;
    };
    actions: Array<{
        id: string;
        type: string;
        config: Record<string, any>;
        order: number;
    }>;
    templateId?: string;
    isTemplate: boolean;
    executionCount: number;
    lastExecutedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IExecutionLog extends Document {
    workflowId: mongoose.Types.ObjectId;
    status: 'success' | 'failed' | 'running';
    triggerData?: Record<string, any>;
    results: Array<{
        actionId: string;
        actionType: string;
        status: 'success' | 'failed' | 'skipped';
        output?: Record<string, any>;
        error?: string;
        executedAt: Date;
    }>;
    startedAt: Date;
    completedAt?: Date;
    duration: number;
}
export declare const User: mongoose.Model<any, {}, {}, {}, any, any, any>;
export declare const Workflow: mongoose.Model<any, {}, {}, {}, any, any, any>;
export declare const ExecutionLog: mongoose.Model<any, {}, {}, {}, any, any, any>;
//# sourceMappingURL=index.d.ts.map