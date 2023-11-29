import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const departmentRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        size: z.number().min(1).max(100).optional().default(30),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata, session } = ctx;
      const response = await xata.db.departments
        .filter({
          "organisation.id": session.user.organisation?.id,
        })
        .getPaginated({
          pagination: {
            size: input.size,
            after: input.cursor,
          },
        });

      if (!response)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not find departments for this organisation.",
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
      const response = await xata.db.departments
        .filter({
          id: input.id,
          "organisation.id": session.user.organisation?.id,
        })
        .getFirst();

      if (!response)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not find department with given ID.",
        });

      return response;
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;
      if (!!session.user.organisation?.id) {
        const response = await xata.db.departments.create({
          name: input.name,
          organisation: session.user.organisation?.id,
        });

        if (!response) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not create department.",
          });
        }

        return response;
      } else {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not allowed to create a department without organisation.",
        });
      }
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;
      const response = await xata.db.departments.update({
        id: input.id,
        name: input.name,
        organisation: session.user.organisation?.id,
      });

      if (!response) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not update department.",
        });
      }

      return response;
    }),
});
