import { pgTable, serial, text, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const zaps = pgTable("zaps", {
  id: text("id").primaryKey(),
  triggerId: text("trigger_id"),
  userId: integer("user_id").references(() => users.id),
});

export const triggers = pgTable("triggers", {
  id: text("id").primaryKey(),
  zapId: text("zap_id").references(() => zaps.id),
  triggerId: text("trigger_type_id"),
  metadata: jsonb("metadata").default({}),
});

export const actions = pgTable("actions", {
  id: text("id").primaryKey(),
  zapId: text("zap_id").references(() => zaps.id),
  actionId: text("action_type_id"),
  metadata: jsonb("metadata").default({}),
  sortingOrder: integer("sorting_order").default(0),
});

export const zapRuns = pgTable("zap_runs", {
  id: text("id").primaryKey(),
  zapId: text("zap_id").references(() => zaps.id),
  metadata: jsonb("metadata"),
  status: integer("status").default(0),
});

// Relations
export const zapsRelations = relations(zaps, ({ one, many }) => ({
  trigger: one(triggers, { fields: [zaps.id], references: [triggers.zapId] }),
  actions: many(actions),
}));

export const triggersRelations = relations(triggers, ({ one }) => ({
  zap: one(zaps, { fields: [triggers.zapId], references: [zaps.id] }),
}));

export const actionsRelations = relations(actions, ({ one }) => ({
  zap: one(zaps, { fields: [actions.zapId], references: [zaps.id] }),
}));