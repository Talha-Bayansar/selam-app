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
        .select(["*", "category.*", "department.*", "group.*"])
        .getFirst();

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not get activity with given ID.",
        });

      return response;
    }),
  addMembers: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        addMemberIds: z.string().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      if (session.user.organisation?.id) {
        try {
          for (const memberId of input.addMemberIds) {
            await xata.db.members_activities.create({
              activity: input.id,
              member: memberId,
            });
          }
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong while adding the members.",
          });
        }
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No organisation found.",
        });
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        departmentId: z.string().min(1),
        groupId: z.string().min(1),
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
        category: input.categoryId ? input.categoryId : null,
        department: input.departmentId,
        group: input.groupId,
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
        groupId: z.string().min(1),
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
        category: input.categoryId ? input.categoryId : null,
        department: input.departmentId,
        group: input.groupId,
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

      const membersActivities = await xata.db.members_activities
        .filter({
          "activity.id": input.id,
        })
        .getAll();

      const response = await xata.db.activities.delete({
        id: input.id,
      });

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Activity with given ID could not be deleted.",
        });

      try {
        for (const memberActivity of membersActivities) {
          await memberActivity.delete();
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not delete members of this activity.",
        });
      }

      return response;
    }),
  deleteMemberFromActivity: protectedProcedure
    .input(
      z.object({
        memberActivityId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;
      if (session.user.organisation?.id) {
        const response = await xata.db.members_activities.delete({
          id: input.memberActivityId,
        });

        if (!response)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Could not delete member from activity.",
          });

        return response;
      } else
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not part of an organisation.",
        });
    }),
});
