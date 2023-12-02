/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { type CategoriesRecord } from "~/server/db";

export const categoryRouter = createTRPCRouter({
  getByDepartmentId: protectedProcedure
    .input(
      z.object({
        departmentId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;
      const response = await xata.db.categories
        .filter({
          "department.id": input.departmentId,
        })
        .sort("name", "asc")
        .getMany();

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not get categories for given department.",
        });

      return response as CategoriesRecord[];
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata } = ctx;
      const response = await xata.db.categories
        .filter({
          id: input.id,
        })
        .getFirst();

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not get category with given ID.",
        });

      return response;
    }),
  create: protectedProcedure
    .input(
      z.object({
        departmentId: z.string().min(1),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata } = ctx;
      const response = await xata.db.categories.create({
        department: input.departmentId,
        name: input.name,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not create category with given input.",
        });

      return response;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata } = ctx;
      const response = await xata.db.categories.update({
        id: input.id,
        name: input.name,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not edit category with given input.",
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
      const response = await xata.db.categories.delete({
        id: input.id,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not delete category with given ID.",
        });

      return response;
    }),
});
