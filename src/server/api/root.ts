import { createTRPCRouter } from "~/server/api/trpc";
import {
  organisationRouter,
  memberRouter,
  groupRouter,
  genderRouter,
} from "./routers";
import { departmentRouter } from "./routers/department";

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
});

// export type definition of API
export type AppRouter = typeof appRouter;
