import { createTRPCRouter } from "~/server/api/trpc";
import { organisationRouter, memberRouter, groupRouter } from "./routers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  organisation: organisationRouter,
  member: memberRouter,
  group: groupRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
