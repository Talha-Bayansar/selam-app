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

      if (!response)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Something went wrong while getting the groups.",
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
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;
      const response = await xata.db.groups.create({
        ...input,
        organization: session.user.organisation?.id,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Group could not be created.",
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
      const { xata, session } = ctx;
      const response = await xata.db.groups.update({
        ...input,
        organization: session.user.organisation?.id,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Group could not be updated.",
        });

      return response;
    }),
  editMembersByGroupId: protectedProcedure
    .input(
      z.object({
        groupId: z.string().min(1),
        addMemberIds: z.string().array(),
        deleteMemberIds: z.string().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      if (session.user.organisation?.id) {
        for (const memberId of input.addMemberIds) {
          await xata.db.members_groups.create({
            group: input.groupId,
            member: memberId,
          });
        }
        for (const memberId of input.deleteMemberIds) {
          const response = await xata.db.members_groups
            .filter({
              "group.id": input.groupId,
              "member.id": memberId,
            })
            .getFirst();
          if (response) {
            await xata.db.members_groups.delete({
              id: response.id,
            });
          }
        }
      }
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
  deleteMemberFromGroup: protectedProcedure
    .input(
      z.object({
        memberGroupId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;
      if (session.user.organisation?.id) {
        const response = await xata.db.members_groups.delete({
          id: input.memberGroupId,
        });

        if (!response)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Could not delete member from group.",
          });

        return response;
      } else
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not part of an organisation.",
        });
    }),
});
