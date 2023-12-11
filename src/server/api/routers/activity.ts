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
        .select(["*", "category.*", "department.*"])
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
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const response = await xata.db.activities
        .filter({
          id: input.id,
          "department.organisation.id": session.user.organisation?.id,
        })
        .select(["*", "category.*", "department.*"])
        .getFirst();

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not get activity with given ID.",
        });

      return response;
    }),
  create: protectedProcedure
    .input(
      z.object({
        departmentId: z.string().min(1),
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
        end: input.end ? new Date(input.end) : null,
        category: input.categoryId,
        department: input.departmentId,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not create activity with given input.",
        });

      return response;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        departmentId: z.string().min(1),
        name: z.string().min(1),
        start: z.string().min(1),
        end: z.string().optional(),
        categoryId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata } = ctx;
      const response = await xata.db.activities.update({
        id: input.id,
        name: input.name,
        start: new Date(input.start),
        end: input.end ? new Date(input.end) : null,
        category: input.categoryId,
        department: input.departmentId,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not update activity with given input.",
        });

      return response;
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata } = ctx;
      const response = await xata.db.activities.delete({
        id: input.id,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not delete activity.",
        });

      return response;
    }),
});
