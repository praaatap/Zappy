import mongoose, { Schema, Document } from 'mongoose';

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

export const ExecutionLog = mongoose.models.ExecutionLog || mongoose.model<IExecutionLog>('ExecutionLog', ExecutionLogSchema);
