/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const activityRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        size: z.number().min(1).max(100).optional().default(30),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const response = await xata.db.activities
        .filter({
          "department.organisation.id": session.user.organisation?.id,
        })
        .sort("start", "desc")
        .select(["*", "category.*"])
        .getPaginated({
          pagination: {
            size: input.size,
            end: input.cursor,
          },
        });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not get activities with given input.",
        });

      return response;
    }),
});
