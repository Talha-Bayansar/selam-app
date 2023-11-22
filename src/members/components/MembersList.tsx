"use client";
import { format } from "date-fns";
import React from "react";
import { Button, ListTile, ShowEmpty } from "~/components";
import { api } from "~/trpc/react";
import { MembersListSkeleton } from ".";

export const MembersList = () => {
  const { data, isLoading, fetchNextPage } = api.member.getAll.useInfiniteQuery(
    {},
    {
      getNextPageParam: (currentPage) => {
        return currentPage.meta.page.cursor;
      },
    },
  );

  const members = data?.pages.reduce(
    (previous, current) => {
      if (previous.records) {
        return {
          ...current,
          records: [...previous.records, ...current.records],
        } as typeof current;
      } else {
        return current;
      }
    },
    {} as (typeof data.pages)[0],
  );

  return isLoading ? (
    <MembersListSkeleton />
  ) : members && members.records.length > 0 ? (
    <div className="w-full">
      <Button
        disabled={!members?.meta.page.more}
        className="mb-4"
        onClick={() => fetchNextPage()}
      >
        More
      </Button>
      {members.records.map((member, i) => {
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
            isLastItem={(members.records.length ?? 0) > i + 1}
          />
        );
      })}
    </div>
  ) : (
    <ShowEmpty />
  );
};
