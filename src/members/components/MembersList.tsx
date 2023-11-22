"use client";
import { format } from "date-fns";
import React from "react";
import { Button, ListTile, ShowEmpty } from "~/components";
import { api } from "~/trpc/react";
import { MembersListSkeleton } from ".";
import { Loader2 } from "lucide-react";
import { routes } from "~/lib";

export const MembersList = () => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    api.members.getAll.useInfiniteQuery(
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
      {members.records.map((member, i) => {
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
            isLastItem={(members.records.length ?? 0) > i + 1}
          />
        );
      })}
      <Button
        disabled={!members?.meta.page.more || isFetchingNextPage}
        className="mt-4 w-full"
        onClick={() => fetchNextPage()}
      >
        {isFetchingNextPage ? (
          <Loader2 className="animate-spin" />
        ) : members?.meta.page.more ? (
          "Load more"
        ) : (
          "No more data"
        )}
      </Button>
    </div>
  ) : (
    <ShowEmpty />
  );
};
