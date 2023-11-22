import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const memberRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        size: z.number().min(1).max(100).optional(),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata, session } = ctx;
      const members = await xata.db.members
        .filter({
          "organization.id": session.user.organisation?.id,
        })
        .sort("firstName", "asc")
        .getPaginated({
          pagination: {
            size: input.size ?? 30,
            after: input.cursor,
          },
        });

      return members;
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata, session } = ctx;
      const member = await xata.db.members
        .filter({
          id: input.id,
          "organization.id": session.user.organisation?.id,
        })
        .select(["*", "gender.*"])
        .getFirst();

      if (!member)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Member with given ID does not exist.",
        });

      return member;
    }),
});
