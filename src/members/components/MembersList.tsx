"use client";
import { format } from "date-fns";
import React from "react";
import { ListTile, ShowEmpty } from "~/components";
import { cn, routes } from "~/lib";
import { type MembersRecord } from "~/server/db";

type Props = {
  members: MembersRecord[];
} & React.HTMLAttributes<HTMLDivElement>;

export const MembersList = ({ members, ...props }: Props) => {
  return (
    <div {...props} className={cn("w-full", props.className)}>
      {members.length > 0 ? (
        members.map((member, i) => {
          return (
            <ListTile
              key={member.id}
              href={`${routes.members}/${member.id}`}
              title={`${member.firstName} ${member.lastName}`}
              subtitle={
                !!member.dateOfBirth
                  ? format(
                      Date.parse(member.dateOfBirth.toString()),
                      "dd/MM/yyyy",
                    )
                  : "undefined"
              }
              isLastItem={(members.length ?? 0) > i + 1}
            />
          );
        })
      ) : (
        <ShowEmpty />
      )}
    </div>
  );
};
