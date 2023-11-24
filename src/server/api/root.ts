import { createTRPCRouter } from "~/server/api/trpc";
import {
  organisationRouter,
  memberRouter,
  groupRouter,
  genderRouter,
} from "./routers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  organisations: organisationRouter,
  members: memberRouter,
  groups: groupRouter,
  genders: genderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
