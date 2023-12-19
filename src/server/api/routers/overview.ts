import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const overviewRouter = createTRPCRouter({
  getAttendanceData: protectedProcedure
    .input(
      z.object({
        size: z.number().optional().default(20),
        offset: z.number().optional().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { xata, session } = ctx;
      try {
        const members = await xata.db.members
          .filter({
            "organization.id": session.user.organisation?.id,
          })
          .sort("firstName", "asc")
          .getPaginated({
            pagination: {
              size: input.size,
              offset: input.offset,
            },
          });
        const result = [];
        for (const member of members.records) {
          const attendanceCount = await xata.db.members_activities.aggregate({
            totalCount: {
              count: {
                filter: {
                  "member.id": member.id,
                },
              },
            },
          });
          result.push({
            fullName: `${member.firstName} ${member.lastName}`,
            count: attendanceCount.aggs.totalCount,
          });
        }

        return {
          ...members,
          records: result,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong.",
        });
      }
    }),
});
