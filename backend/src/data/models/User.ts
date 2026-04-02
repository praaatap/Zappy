import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  subscriptionPlan: 'free' | 'pro' | 'enterprise';
  workflowsCount: number;
  executionsThisMonth: number;
  integrations?: Array<{
    type: 'slack' | 'github' | 'email' | 'webhook';
    credentials: Record<string, any>;
    connectedAt: Date;
  }>;
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
    integrations: [
      {
        type: { type: String, enum: ['slack', 'github', 'email', 'webhook'] },
        credentials: { type: Schema.Types.Mixed },
        connectedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
