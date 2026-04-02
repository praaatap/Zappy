import mongoose, { Schema, Document } from 'mongoose';

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

export const Workflow = mongoose.models.Workflow || mongoose.model<IWorkflow>('Workflow', WorkflowSchema);
