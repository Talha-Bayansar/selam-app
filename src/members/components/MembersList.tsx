"use client";
import { format } from "date-fns";
import React from "react";
import {
  ListSkeleton,
  ListTile,
  PaginationButton,
  ShowEmpty,
} from "~/components";
import { api } from "~/trpc/react";
import { reducePages, routes } from "~/lib";

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

  const members = data && reducePages(data?.pages);

  return isLoading ? (
    <ListSkeleton />
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
      <PaginationButton
        className="mt-4"
        canLoadMore={members?.meta.page.more}
        isLoading={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      />
    </div>
  ) : (
    <ShowEmpty />
  );
};
