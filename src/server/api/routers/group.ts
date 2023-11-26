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
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata, session } = ctx;
      const group = await xata.db.groups
        .filter({
          id: input.id,
          "organization.id": session.user.organisation?.id,
        })
        .getFirst();

      if (!group)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Group with given ID does not exist.",
        });

      const aggregate = await xata.db.members_groups.aggregate({
        count: {
          count: {
            filter: {
              "group.id": input.id,
            },
          },
        },
      });

      const result = {
        ...group,
        membersCount: aggregate.aggs.count,
      } as Group;

      return result;
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const response = await xata.db.groups.delete({
        id: input.id,
        organization: session.user.organisation?.id,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Group with given ID could not be deleted.",
        });

      const membersGroups = await xata.db.members_groups
        .filter({
          "group.id": input.id,
        })
        .getAll();

      for (const memberGroup of membersGroups) {
        await memberGroup.delete();
      }

      return response;
    }),
});
