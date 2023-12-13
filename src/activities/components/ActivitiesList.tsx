/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import Link from "next/link";
import {
  ListTile,
  ListTileSkeleton,
  PaginationButton,
  NoData,
} from "~/components";
import { cn, generateArray, reducePages, routes } from "~/lib";
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
            hasSubtitle
            isLastItem={generateArray().length > i + 1}
          />
        ))}
      </div>
    );

  if (!data) return <NoData />;

  const activities = reducePages(data.pages);

  if (activities.records.length <= 0) return <NoData />;

  return (
    <div className={cn("flex w-full flex-col", props.className)}>
      {activities.records.map((activity, i) => (
        <Link key={activity.id} href={`${routes.activities}/${activity.id}`}>
          <ListTile
            title={`${
              activity.category?.name ? `${activity.category.name}: ` : ""
            }${activity.name ?? "undefined"}`}
            subtitle={activity.department?.name ?? "undefined"}
            isLastItem={activities.records.length > i + 1}
          />
        </Link>
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
