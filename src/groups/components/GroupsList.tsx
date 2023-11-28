"use client";
import {
  ListTile,
  ListTileSkeleton,
  PaginationButton,
  ShowEmpty,
} from "~/components";
import { generateArray, reducePages, routes } from "~/lib";
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
    generateArray(20).map((item, i) => (
      <ListTileSkeleton
        key={item}
        isLastItem={generateArray(20).length > i + 1}
      />
    ))
  ) : groups && groups.records.length > 0 ? (
    <div className="w-full">
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
