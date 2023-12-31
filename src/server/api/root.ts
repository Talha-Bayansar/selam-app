import { createTRPCRouter } from "~/server/api/trpc";
import {
  organisationRouter,
  memberRouter,
  groupRouter,
  genderRouter,
  categoryRouter,
  departmentRouter,
  activityRouter,
  overviewRouter,
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
  departments: departmentRouter,
  categories: categoryRouter,
  activities: activityRouter,
  overview: overviewRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
