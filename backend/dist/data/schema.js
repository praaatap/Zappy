"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrationsRelations = exports.executionLogsRelations = exports.workflowsRelations = exports.usersRelations = exports.integrations = exports.executionLogs = exports.workflows = exports.users = void 0;
// Backend Drizzle ORM Schema - Compatible with Frontend
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// Users table
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    avatar: (0, pg_core_1.text)("avatar"),
    subscriptionPlan: (0, pg_core_1.text)("subscription_plan").default("free").notNull(), // 'free' | 'pro' | 'enterprise'
    workflowsCount: (0, pg_core_1.integer)("workflows_count").default(0).notNull(),
    executionsThisMonth: (0, pg_core_1.integer)("executions_this_month").default(0).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Workflows/Zaps table
exports.workflows = (0, pg_core_1.pgTable)("workflows", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").references(() => exports.users.id).notNull(),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    status: (0, pg_core_1.text)("status").default("draft").notNull(), // 'draft' | 'active' | 'paused' | 'error'
    triggerType: (0, pg_core_1.text)("trigger_type").notNull(),
    triggerConfig: (0, pg_core_1.jsonb)("trigger_config").default({}),
    webhookUrl: (0, pg_core_1.text)("webhook_url"),
    actions: (0, pg_core_1.jsonb)("actions").default([]), // Array of action objects
    templateId: (0, pg_core_1.text)("template_id"),
    isTemplate: (0, pg_core_1.boolean)("is_template").default(false).notNull(),
    executionCount: (0, pg_core_1.integer)("execution_count").default(0).notNull(),
    lastExecutedAt: (0, pg_core_1.timestamp)("last_executed_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Execution logs table
exports.executionLogs = (0, pg_core_1.pgTable)("execution_logs", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    workflowId: (0, pg_core_1.text)("workflow_id").references(() => exports.workflows.id).notNull(),
    status: (0, pg_core_1.text)("status").default("running").notNull(), // 'success' | 'failed' | 'running'
    triggerData: (0, pg_core_1.jsonb)("trigger_data"),
    results: (0, pg_core_1.jsonb)("results").default([]),
    startedAt: (0, pg_core_1.timestamp)("started_at").defaultNow(),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    duration: (0, pg_core_1.integer)("duration").default(0).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Integrations table
exports.integrations = (0, pg_core_1.pgTable)("integrations", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").references(() => exports.users.id).notNull(),
    type: (0, pg_core_1.text)("type").notNull(), // 'slack' | 'github' | 'email' | 'webhook'
    credentials: (0, pg_core_1.jsonb)("credentials"),
    connectedAt: (0, pg_core_1.timestamp)("connected_at").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Relations
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    workflows: many(exports.workflows),
    integrations: many(exports.integrations),
}));
exports.workflowsRelations = (0, drizzle_orm_1.relations)(exports.workflows, ({ one, many }) => ({
    user: one(exports.users, { fields: [exports.workflows.userId], references: [exports.users.id] }),
    executionLogs: many(exports.executionLogs),
}));
exports.executionLogsRelations = (0, drizzle_orm_1.relations)(exports.executionLogs, ({ one }) => ({
    workflow: one(exports.workflows, { fields: [exports.executionLogs.workflowId], references: [exports.workflows.id] }),
}));
exports.integrationsRelations = (0, drizzle_orm_1.relations)(exports.integrations, ({ one }) => ({
    user: one(exports.users, { fields: [exports.integrations.userId], references: [exports.users.id] }),
}));
