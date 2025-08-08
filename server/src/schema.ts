import { z } from 'zod';

// Enums for better type safety
export const timeRangeEnum = z.enum(['day', 'week', 'month', 'quarter', 'year', 'ytd', 'custom']);
export const aggregationEnum = z.enum(['daily', 'weekly', 'monthly']);
export const groupByEnum = z.enum(['app', 'creator', 'tag']);

// Core billing usage schema - matches Databricks Unity Catalog system.billing.usage structure
export const billingUsageSchema = z.object({
  id: z.string(),
  workspace_id: z.string(),
  sku_name: z.string(),
  cloud: z.string(),
  usage_date: z.coerce.date(),
  usage_unit: z.string(),
  usage_quantity: z.number(),
  pricing_unit_price: z.number(),
  usage_metadata: z.record(z.string()).nullable(), // JSON metadata
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type BillingUsage = z.infer<typeof billingUsageSchema>;

// Application schema for tracking apps
export const applicationSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  creator: z.string(),
  workspace_id: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Application = z.infer<typeof applicationSchema>;

// Tag schema
export const tagSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  color: z.string().nullable(), // Hex color for UI
  created_at: z.coerce.date()
});

export type Tag = z.infer<typeof tagSchema>;

// Application tags junction table schema
export const applicationTagSchema = z.object({
  application_id: z.number(),
  tag_id: z.number(),
  assigned_at: z.coerce.date()
});

export type ApplicationTag = z.infer<typeof applicationTagSchema>;

// AI Recommendation schema
export const recommendationSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  potential_savings: z.number().nullable(),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.string(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type Recommendation = z.infer<typeof recommendationSchema>;

// Input schemas for API endpoints

// Filter input schema
export const costFiltersSchema = z.object({
  time_range: timeRangeEnum.default('ytd'),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  creator: z.string().optional(), // null means all creators
  tag_ids: z.array(z.number()).default([]), // empty array means all tags
  workspace_ids: z.array(z.string()).default([]) // empty array means all workspaces
});

export type CostFilters = z.infer<typeof costFiltersSchema>;

// Aggregation options
export const aggregationOptionsSchema = z.object({
  period: aggregationEnum.default('monthly'),
  group_by: groupByEnum.default('app')
});

export type AggregationOptions = z.infer<typeof aggregationOptionsSchema>;

// Cost summary response schema
export const costSummarySchema = z.object({
  total_spend: z.number(),
  forecasted_spend: z.number(),
  average_spend: z.number(),
  period_start: z.coerce.date(),
  period_end: z.coerce.date()
});

export type CostSummary = z.infer<typeof costSummarySchema>;

// Trend data point schema
export const trendDataPointSchema = z.object({
  period: z.string(), // Date string or period label
  value: z.number(),
  group_label: z.string() // App name, creator, or tag name
});

export type TrendDataPoint = z.infer<typeof trendDataPointSchema>;

// Top contributors schema
export const topContributorSchema = z.object({
  name: z.string(),
  spend: z.number(),
  percentage: z.number()
});

export type TopContributor = z.infer<typeof topContributorSchema>;

// Untagged application schema
export const untaggedApplicationSchema = z.object({
  id: z.number(),
  name: z.string(),
  creator: z.string(),
  workspace_id: z.string(),
  total_spend: z.number(),
  last_activity: z.coerce.date()
});

export type UntaggedApplication = z.infer<typeof untaggedApplicationSchema>;

// Input schemas for mutations
export const createApplicationInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  creator: z.string().min(1),
  workspace_id: z.string().min(1)
});

export type CreateApplicationInput = z.infer<typeof createApplicationInputSchema>;

export const createTagInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional() // Hex color validation
});

export type CreateTagInput = z.infer<typeof createTagInputSchema>;

export const assignTagInputSchema = z.object({
  application_id: z.number(),
  tag_id: z.number()
});

export type AssignTagInput = z.infer<typeof assignTagInputSchema>;

export const removeTagInputSchema = z.object({
  application_id: z.number(),
  tag_id: z.number()
});

export type RemoveTagInput = z.infer<typeof removeTagInputSchema>;

// Query input schemas
export const getCostDataInputSchema = z.object({
  filters: costFiltersSchema,
  aggregation: aggregationOptionsSchema
});

export type GetCostDataInput = z.infer<typeof getCostDataInputSchema>;

export const getTopContributorsInputSchema = z.object({
  filters: costFiltersSchema,
  group_by: groupByEnum,
  limit: z.number().int().positive().default(5)
});

export type GetTopContributorsInput = z.infer<typeof getTopContributorsInputSchema>;