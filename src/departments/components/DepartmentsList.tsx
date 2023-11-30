"use client";
import {
  ListSkeleton,
  ListTile,
  PaginationButton,
  ShowEmpty,
} from "~/components";
import { cn, reducePages, routes } from "~/lib";
import { api } from "~/trpc/react";

type Props = React.HTMLAttributes<HTMLDivElement>;

export const DepartmentsList = (props: Props) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    api.departments.getAll.useInfiniteQuery(
      {},
      {
        getNextPageParam: (currentPage) => currentPage.meta.page.cursor,
      },
    );

  const departments = data && reducePages(data.pages);

  if (isLoading) return <ListSkeleton withSubtitle={false} />;

  if (!departments || departments.records.length <= 0) return <ShowEmpty />;

  return (
    <div {...props} className={cn("flex w-full flex-col", props.className)}>
      {departments.records.map((department, i) => (
        <ListTile
          key={department.id}
          href={`${routes.departments}/${department.id}`}
          title={department.name}
          isLastItem={departments.records.length > i + 1}
        />
      ))}
      <PaginationButton
        className="mt-4"
        canLoadMore={departments.meta.page.more}
        isLoading={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      />
    </div>
  );
};
