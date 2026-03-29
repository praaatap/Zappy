import mongoose, { Schema, Document } from 'mongoose';

// User Schema
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

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    workflowsCount: { type: Number, default: 0 },
    executionsThisMonth: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Workflow Schema
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

const WorkflowSchema = new Schema<IWorkflow>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['draft', 'active', 'paused', 'error'],
      default: 'draft',
    },
    trigger: {
      type: { type: String, required: true },
      config: { type: Schema.Types.Mixed, default: {} },
      webhookUrl: { type: String },
    },
    actions: [
      {
        id: { type: String, required: true },
        type: { type: String, required: true },
        config: { type: Schema.Types.Mixed, default: {} },
        order: { type: Number, default: 0 },
      },
    ],
    templateId: { type: String },
    isTemplate: { type: Boolean, default: false },
    executionCount: { type: Number, default: 0 },
    lastExecutedAt: { type: Date },
  },
  { timestamps: true }
);

// Execution Log Schema
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

const ExecutionLogSchema = new Schema<IExecutionLog>(
  {
    workflowId: { type: Schema.Types.ObjectId, ref: 'Workflow', required: true },
    status: {
      type: String,
      enum: ['success', 'failed', 'running'],
      default: 'running',
    },
    triggerData: { type: Schema.Types.Mixed },
    results: [
      {
        actionId: { type: String, required: true },
        actionType: { type: String, required: true },
        status: {
          type: String,
          enum: ['success', 'failed', 'skipped'],
          default: 'skipped',
        },
        output: { type: Schema.Types.Mixed },
        error: { type: String },
        executedAt: { type: Date, default: Date.now },
      },
    ],
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    duration: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Template Schema
export interface ITemplate extends Document {
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  trigger: {
    type: string;
    name: string;
    config: Record<string, any>;
  };
  actions: Array<{
    type: string;
    name: string;
    config: Record<string, any>;
  }>;
  uses: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, default: '#3B82F6' },
    trigger: {
      type: { type: String, required: true },
      name: { type: String, required: true },
      config: { type: Schema.Types.Mixed, default: {} },
    },
    actions: [
      {
        type: { type: String, required: true },
        name: { type: String, required: true },
        config: { type: Schema.Types.Mixed, default: {} },
      },
    ],
    uses: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// API Key Schema
export interface IApiKey extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  key: string;
  permissions: string[];
  lastUsedAt?: Date;
  createdAt: Date;
}

const ApiKeySchema = new Schema<IApiKey>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    permissions: { type: [String], default: ['workflow:execute'] },
    lastUsedAt: { type: Date },
  },
  { timestamps: true }
);

// Models
export const User =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Workflow =
  mongoose.models.Workflow ||
  mongoose.model<IWorkflow>('Workflow', WorkflowSchema);
export const ExecutionLog =
  mongoose.models.ExecutionLog ||
  mongoose.model<IExecutionLog>('ExecutionLog', ExecutionLogSchema);
export const Template =
  mongoose.models.Template ||
  mongoose.model<ITemplate>('Template', TemplateSchema);
export const ApiKey =
  mongoose.models.ApiKey ||
  mongoose.model<IApiKey>('ApiKey', ApiKeySchema);
