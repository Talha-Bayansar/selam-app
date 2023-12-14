/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import Link from "next/link";
import {
  ListTile,
  PaginationButton,
  NoData,
  ErrorData,
  ListSkeleton,
} from "~/components";
import { cn, isArrayEmpty, reducePages, routes } from "~/lib";
import { api } from "~/trpc/react";

type Props = {
  className?: string;
};

export const AllActivitiesPaginatedList = (props: Props) => {
  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    api.activities.getAll.useInfiniteQuery(
      {},
      {
        getNextPageParam: (currentPage) => currentPage.meta.page.cursor,
      },
    );

  if (isLoading) return <ListSkeleton />;

  if (error) return <ErrorData />;

  const activities = data && reducePages(data.pages);

  if (!activities || isArrayEmpty(activities.records)) return <NoData />;

  return (
    <div className={cn("flex w-full flex-col gap-4", props.className)}>
      <div className="flex w-full flex-col">
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
      </div>
      <PaginationButton
        isLoading={isFetchingNextPage}
        canLoadMore={activities.meta.page.more}
        onClick={() => fetchNextPage()}
      />
    </div>
  );
};
