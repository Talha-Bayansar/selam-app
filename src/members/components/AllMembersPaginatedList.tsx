"use client";
import { format } from "date-fns";
import React from "react";
import {
  ErrorData,
  ListSkeleton,
  ListTile,
  NoData,
  PaginationButton,
} from "~/components";
import { cn, isArrayEmpty, reducePages, routes } from "~/lib";
import { api } from "~/trpc/react";

type Props = React.HTMLAttributes<HTMLDivElement>;

export const AllMembersPaginatedList = (props: Props) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage, error } =
    api.members.getAll.useInfiniteQuery(
      {},
      {
        getNextPageParam: (currentPage) => {
          return currentPage.meta.page.cursor;
        },
      },
    );

  if (isLoading) return <ListSkeleton withSubtitle />;
  if (error) return <ErrorData />;

  const members = reducePages(data?.pages);

  if (!members || isArrayEmpty(members.records)) return <NoData />;

  return (
    <div
      {...props}
      className={cn("flex w-full flex-col gap-4", props.className)}
    >
      <div className="flex w-full flex-col">
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
      </div>
      <PaginationButton
        canLoadMore={members?.meta.page.more}
        isLoading={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      />
    </div>
  );
};
