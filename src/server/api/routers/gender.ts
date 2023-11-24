import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type GendersRecord } from "~/server/db";

export const genderRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { xata } = ctx;
    const genders = await xata.db.genders.getAll();
    if (!genders)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No genders found.",
      });

    return genders as GendersRecord[];
  }),
});
