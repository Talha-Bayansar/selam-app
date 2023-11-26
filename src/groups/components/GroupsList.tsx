"use client";
import {
  ListSkeleton,
  ListTile,
  PaginationButton,
  ShowEmpty,
} from "~/components";
import { reducePages, routes } from "~/lib";
import { api } from "~/trpc/react";

export const GroupsList = () => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    api.groups.getAll.useInfiniteQuery(
      {},
      {
        getNextPageParam: (currentPage) => {
          return currentPage.meta.page.cursor;
        },
      },
    );

  const groups = data && reducePages(data.pages);

  return isLoading ? (
    <ListSkeleton />
  ) : groups && groups.records.length > 0 ? (
    <div className="w-full">
      {groups.records.map((group, i) => {
        return (
          <ListTile
            key={group.id}
            href={`${routes.groups}/${group.id}`}
            title={group.name!}
            subtitle={`Members: ${group.membersCount}`}
            isLastItem={(groups.records.length ?? 0) > i + 1}
          />
        );
      })}
      <PaginationButton
        className="mt-4"
        canLoadMore={groups?.meta.page.more}
        isLoading={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      />
    </div>
  ) : (
    <ShowEmpty />
  );
};
