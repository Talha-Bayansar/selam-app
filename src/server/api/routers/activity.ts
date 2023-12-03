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
  create: protectedProcedure
    .input(
      z.object({
        // departmentId: z.string().min(1),
        name: z.string().min(1),
        start: z.string().min(1),
        end: z.string().optional(),
        categoryId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata } = ctx;
      const response = await xata.db.activities.create({
        name: input.name,
        start: new Date(input.start),
        end: input.end ? new Date(input.end) : undefined,
        category: input.categoryId,
        // department: input.departmentId,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not create activity with given input.",
        });

      return response;
    }),
});
