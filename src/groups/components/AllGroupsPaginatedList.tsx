"use client";
import {
  ListSkeleton,
  ListTile,
  PaginationButton,
  NoData,
  ErrorData,
} from "~/components";
import { isArrayEmpty, reducePages, routes } from "~/lib";
import { api } from "~/trpc/react";

export const AllGroupsPaginatedList = () => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage, error } =
    api.groups.getAll.useInfiniteQuery(
      {},
      {
        getNextPageParam: (currentPage) => {
          return currentPage.meta.page.cursor;
        },
      },
    );

  if (isLoading) return <ListSkeleton withSubtitle={false} />;
  if (error) return <ErrorData />;

  const groups = data && reducePages(data.pages);

  if (!groups || isArrayEmpty(groups.records)) return <NoData />;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col">
        {groups.records.map((group, i) => {
          return (
            <ListTile
              key={group.id}
              href={`${routes.groups}/${group.id}`}
              title={group.name!}
              isLastItem={(groups.records.length ?? 0) > i + 1}
            />
          );
        })}
      </div>
      <PaginationButton
        canLoadMore={groups?.meta.page.more}
        isLoading={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      />
    </div>
  );
};
