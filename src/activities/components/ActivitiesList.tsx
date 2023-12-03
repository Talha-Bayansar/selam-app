/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import {
  ListTile,
  ListTileSkeleton,
  PaginationButton,
  ShowEmpty,
} from "~/components";
import { cn, generateArray, reducePages } from "~/lib";
import { api } from "~/trpc/react";

type Props = {
  className?: string;
};

export const ActivitiesList = (props: Props) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    api.activities.getAll.useInfiniteQuery(
      {},
      {
        getNextPageParam: (currentPage) => currentPage.meta.page.cursor,
      },
    );

  if (isLoading)
    return (
      <div className={cn("flex w-full flex-col", props.className)}>
        {generateArray().map((val, i) => (
          <ListTileSkeleton
            key={val}
            isLastItem={generateArray().length > i + 1}
          />
        ))}
      </div>
    );

  if (!data) return <ShowEmpty />;

  const activities = reducePages(data.pages);

  if (activities.records.length <= 0) return <ShowEmpty />;

  return (
    <div className={cn("flex w-full flex-col", props.className)}>
      {activities.records.map((activity, i) => (
        <ListTile
          key={activity.id}
          title={activity.name ?? "undefined"}
          isLastItem={activities.records.length > i + 1}
        />
      ))}
      <PaginationButton
        className="mt-4"
        isLoading={isFetchingNextPage}
        canLoadMore={activities.meta.page.more}
        onClick={() => fetchNextPage()}
      />
    </div>
  );
};
