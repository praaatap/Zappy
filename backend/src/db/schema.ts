import { pgTable, serial, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk User ID
  name: text("name"),
  email: text("email").notNull().unique(),
  imageUrl: text("image_url"),
  metadata: jsonb("metadata").default({}), // Store integrations here
  createdAt: timestamp("created_at").defaultNow(),
});

export const zaps = pgTable("zaps", {
  id: text("id").primaryKey(),
  name: text("name").notNull().default("Untitled Zap"),
  description: text("description").default(""),
  status: text("status").notNull().default("paused"), // "active" | "paused"
  userId: text("user_id").references(() => users.id).notNull(),
  triggerId: text("trigger_id"), // Reference to a trigger
  isTemplate: text("is_template").default("false"), // Simplified string boolean for compatibility
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const triggers = pgTable("triggers", {
  id: text("id").primaryKey(),
  zapId: text("zap_id").references(() => zaps.id).notNull(),
  type: text("type").notNull(), // Webhook, Schedule, etc.
  metadata: jsonb("metadata").default({}),
});

export const actions = pgTable("actions", {
  id: text("id").primaryKey(),
  zapId: text("zap_id").references(() => zaps.id).notNull(),
  type: text("type").notNull(), // Slack, Email, etc.
  metadata: jsonb("metadata").default({}),
  sortingOrder: integer("sorting_order").default(0).notNull(),
});

export const zapRuns = pgTable("zap_runs", {
  id: text("id").primaryKey(),
  zapId: text("zap_id").references(() => zaps.id).notNull(),
  metadata: jsonb("metadata").default({}),
  status: text("status").notNull().default("success"), // "success" | "failed"
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Relations
export const zapsRelations = relations(zaps, ({ one, many }) => ({
  user: one(users, { fields: [zaps.userId], references: [users.id] }),
  trigger: one(triggers, { fields: [zaps.triggerId], references: [triggers.id] }),
  actions: many(actions),
  runs: many(zapRuns),
}));

export const triggersRelations = relations(triggers, ({ one }) => ({
  zap: one(zaps, { fields: [triggers.zapId], references: [zaps.id] }),
}));

export const actionsRelations = relations(actions, ({ one }) => ({
  zap: one(zaps, { fields: [actions.zapId], references: [zaps.id] }),
}));

export const zapRunsRelations = relations(zapRuns, ({ one }) => ({
  zap: one(zaps, { fields: [zapRuns.zapId], references: [zaps.id] }),
}));