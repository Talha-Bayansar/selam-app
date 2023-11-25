import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { type GroupsRecord } from "~/server/db";

type Group = {
  membersCount: number;
} & GroupsRecord;

export const groupRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        size: z.number().min(1).max(100).optional(),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata, session } = ctx;
      const response = await xata.db.groups
        .filter({
          "organization.id": session.user.organisation?.id,
        })
        .sort("name", "asc")
        .getPaginated({
          pagination: {
            size: input.size ?? 30,
            after: input.cursor,
          },
        });
      const groups: Group[] = [];
      for (const groupRecord of response.records as GroupsRecord[]) {
        const response = await xata.db.members_groups.aggregate({
          count: {
            count: {
              filter: {
                "group.id": groupRecord.id,
              },
            },
          },
        });
        groups.push({
          membersCount: response.aggs.count,
          ...groupRecord,
        });
      }

      const result = {
        ...response,
        records: groups,
      };

      if (!groups)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Something went wrong while getting the groups.",
        });

      return result;
    }),
});
