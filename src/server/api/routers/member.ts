import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const memberRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        size: z.number().default(20),
        offset: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata, session } = ctx;
      const members = await xata.db.members
        .filter({
          "organization.id": session.user.organisation?.id,
        })
        .getPaginated({
          pagination: {
            size: input.size,
            offset: input.offset,
          },
        });

      return members;
    }),
});
