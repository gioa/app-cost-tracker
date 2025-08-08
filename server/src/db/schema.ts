import { serial, text, pgTable, timestamp, numeric, integer, boolean, json, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums for database
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high']);

// Billing usage table - mirrors Databricks Unity Catalog structure
export const billingUsageTable = pgTable('billing_usage', {
  id: text('id').primaryKey(), // UUID from Databricks
  workspace_id: text('workspace_id').notNull(),
  sku_name: text('sku_name').notNull(),
  cloud: text('cloud').notNull(),
  usage_date: timestamp('usage_date').notNull(),
  usage_unit: text('usage_unit').notNull(),
  usage_quantity: numeric('usage_quantity', { precision: 10, scale: 4 }).notNull(),
  pricing_unit_price: numeric('pricing_unit_price', { precision: 10, scale: 4 }).notNull(),
  usage_metadata: json('usage_metadata'), // JSON metadata from Databricks
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Applications table
export const applicationsTable = pgTable('applications', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'), // Nullable by default
  creator: text('creator').notNull(),
  workspace_id: text('workspace_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Tags table
export const tagsTable = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'), // Nullable by default
  color: text('color'), // Hex color for UI, nullable
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Application tags junction table
export const applicationTagsTable = pgTable('application_tags', {
  application_id: integer('application_id').notNull().references(() => applicationsTable.id, { onDelete: 'cascade' }),
  tag_id: integer('tag_id').notNull().references(() => tagsTable.id, { onDelete: 'cascade' }),
  assigned_at: timestamp('assigned_at').defaultNow().notNull()
}, (table) => ({
  pk: primaryKey({ columns: [table.application_id, table.tag_id] })
}));

// AI Recommendations table
export const recommendationsTable = pgTable('recommendations', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  potential_savings: numeric('potential_savings', { precision: 10, scale: 2 }), // Nullable
  priority: priorityEnum('priority').notNull(),
  category: text('category').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Define relations
export const applicationsRelations = relations(applicationsTable, ({ many }) => ({
  applicationTags: many(applicationTagsTable),
}));

export const tagsRelations = relations(tagsTable, ({ many }) => ({
  applicationTags: many(applicationTagsTable),
}));

export const applicationTagsRelations = relations(applicationTagsTable, ({ one }) => ({
  application: one(applicationsTable, {
    fields: [applicationTagsTable.application_id],
    references: [applicationsTable.id],
  }),
  tag: one(tagsTable, {
    fields: [applicationTagsTable.tag_id],
    references: [tagsTable.id],
  }),
}));

// TypeScript types for the table schemas
export type BillingUsage = typeof billingUsageTable.$inferSelect;
export type NewBillingUsage = typeof billingUsageTable.$inferInsert;

export type Application = typeof applicationsTable.$inferSelect;
export type NewApplication = typeof applicationsTable.$inferInsert;

export type Tag = typeof tagsTable.$inferSelect;
export type NewTag = typeof tagsTable.$inferInsert;

export type ApplicationTag = typeof applicationTagsTable.$inferSelect;
export type NewApplicationTag = typeof applicationTagsTable.$inferInsert;

export type Recommendation = typeof recommendationsTable.$inferSelect;
export type NewRecommendation = typeof recommendationsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  billingUsage: billingUsageTable,
  applications: applicationsTable,
  tags: tagsTable,
  applicationTags: applicationTagsTable,
  recommendations: recommendationsTable
};

export const tableRelations = {
  applicationsRelations,
  tagsRelations,
  applicationTagsRelations
};