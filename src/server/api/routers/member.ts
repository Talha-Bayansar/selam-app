/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
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
  create: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        dateOfBirth: z.string().optional(),
        address: z.string().optional(),
        phoneNumber: z.string().optional(),
        gender: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;
      const newMember = await xata.db.members.create({
        ...input,
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
        gender: input.gender || null,
        organization: session.user.organisation?.id,
      });

      if (!newMember)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Member could not be created.",
        });

      return newMember;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        dateOfBirth: z.string().optional(),
        address: z.string().optional(),
        phoneNumber: z.string().optional(),
        gender: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;
      const member = await xata.db.members
        .filter({
          id: input.id,
          "organization.id": session.user.organisation?.id,
        })
        .getFirst();

      if (member) {
        const editedMember = await xata.db.members.update({
          ...input,
          dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
          gender: input.gender || null,
        });
        if (!editedMember)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Could not edit member",
          });
        return editedMember;
      }
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Could not edit member",
      });
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xata, session } = ctx;

      const response = await xata.db.members.delete({
        id: input.id,
        organization: session.user.organisation?.id,
      });

      console.log(response);

      if (!response)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to delete member.",
        });

      return response;
    }),
});
