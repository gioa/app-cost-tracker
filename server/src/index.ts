import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import {
  costFiltersSchema,
  getCostDataInputSchema,
  getTopContributorsInputSchema,
  createTagInputSchema,
  assignTagInputSchema,
  removeTagInputSchema
} from './schema';

// Import handlers
import { getRecommendations } from './handlers/get_recommendations';
import { getCostSummary } from './handlers/get_cost_summary';
import { getCostTrends } from './handlers/get_cost_trends';
import { getTopContributors } from './handlers/get_top_contributors';
import { getUntaggedApplications } from './handlers/get_untagged_applications';
import { getTags } from './handlers/get_tags';
import { getCreators } from './handlers/get_creators';
import { createTag } from './handlers/create_tag';
import { assignTag } from './handlers/assign_tag';
import { removeTag } from './handlers/remove_tag';
import { getApplications } from './handlers/get_applications';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Cost tracking and analytics endpoints
  getRecommendations: publicProcedure
    .query(() => getRecommendations()),

  getCostSummary: publicProcedure
    .input(costFiltersSchema)
    .query(({ input }) => getCostSummary(input)),

  getCostTrends: publicProcedure
    .input(getCostDataInputSchema)
    .query(({ input }) => getCostTrends(input)),

  getTopContributors: publicProcedure
    .input(getTopContributorsInputSchema)
    .query(({ input }) => getTopContributors(input)),

  getUntaggedApplications: publicProcedure
    .input(costFiltersSchema.optional())
    .query(({ input }) => getUntaggedApplications(input)),

  // Data management endpoints
  getTags: publicProcedure
    .query(() => getTags()),

  getCreators: publicProcedure
    .input(costFiltersSchema.optional())
    .query(({ input }) => getCreators(input)),

  getApplications: publicProcedure
    .query(() => getApplications()),

  // Tag management endpoints
  createTag: publicProcedure
    .input(createTagInputSchema)
    .mutation(({ input }) => createTag(input)),

  assignTag: publicProcedure
    .input(assignTagInputSchema)
    .mutation(({ input }) => assignTag(input)),

  removeTag: publicProcedure
    .input(removeTagInputSchema)
    .mutation(({ input }) => removeTag(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Cost Tracking TRPC server listening at port: ${port}`);
}

start();