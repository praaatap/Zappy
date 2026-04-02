"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionLog = exports.Workflow = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
const WorkflowSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ['draft', 'active', 'paused', 'error'],
        default: 'draft',
    },
    trigger: {
        type: { type: String, required: true },
        config: { type: mongoose_1.Schema.Types.Mixed, default: {} },
        webhookUrl: { type: String },
    },
    actions: [
        {
            id: { type: String, required: true },
            type: { type: String, required: true },
            config: { type: mongoose_1.Schema.Types.Mixed, default: {} },
            order: { type: Number, default: 0 },
        },
    ],
    templateId: { type: String },
    isTemplate: { type: Boolean, default: false },
    executionCount: { type: Number, default: 0 },
    lastExecutedAt: { type: Date },
}, { timestamps: true });
const ExecutionLogSchema = new mongoose_1.Schema({
    workflowId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Workflow', required: true },
    status: {
        type: String,
        enum: ['success', 'failed', 'running'],
        default: 'running',
    },
    triggerData: { type: mongoose_1.Schema.Types.Mixed },
    results: [
        {
            actionId: { type: String, required: true },
            actionType: { type: String, required: true },
            status: {
                type: String,
                enum: ['success', 'failed', 'skipped'],
                default: 'skipped',
            },
            output: { type: mongoose_1.Schema.Types.Mixed },
            error: { type: String },
            executedAt: { type: Date, default: Date.now },
        },
    ],
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    duration: { type: Number, default: 0 },
}, { timestamps: true });
exports.User = mongoose_1.default.models.User || mongoose_1.default.model('User', UserSchema);
exports.Workflow = mongoose_1.default.models.Workflow || mongoose_1.default.model('Workflow', WorkflowSchema);
exports.ExecutionLog = mongoose_1.default.models.ExecutionLog || mongoose_1.default.model('ExecutionLog', ExecutionLogSchema);
//# sourceMappingURL=index.js.map