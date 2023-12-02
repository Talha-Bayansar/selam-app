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
          message: "Could not create department with given input.",
        });

      return response;
    }),
});
