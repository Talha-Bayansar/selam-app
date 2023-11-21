"use client";

import { format } from "date-fns";
import React from "react";
import { ListTile, PageWrapper } from "~/components";
import { MembersListSkeleton } from "~/members";
import { api } from "~/trpc/react";

const Page = () => {
  const { data, isLoading } = api.member.getAll.useQuery({});

  return (
    <PageWrapper
      className="flex flex-grow flex-col items-start"
      title="Members"
    >
      {isLoading ? (
        <MembersListSkeleton />
      ) : (
        data?.records.map((member, i) => {
          return (
            <ListTile
              key={member.id}
              href={`./${member.id}`}
              title={`${member.firstName} ${member.lastName}`}
              subtitle={
                !!member.dateOfBirth
                  ? format(
                      Date.parse(member.dateOfBirth.toString()),
                      "dd/MM/yyyy",
                    )
                  : "undefined"
              }
              isLastItem={data.records.length > i + 1}
            />
          );
        })
      )}
    </PageWrapper>
  );
};

export default Page;
