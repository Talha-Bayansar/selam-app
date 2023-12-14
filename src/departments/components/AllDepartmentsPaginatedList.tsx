"use client";
import {
  ListSkeleton,
  ListTile,
  PaginationButton,
  NoData,
  ErrorData,
} from "~/components";
import { cn, isArrayEmpty, reducePages, routes } from "~/lib";
import { api } from "~/trpc/react";

type Props = React.HTMLAttributes<HTMLDivElement>;

export const AllDepartmentsPaginatedList = (props: Props) => {
  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    api.departments.getAll.useInfiniteQuery(
      {},
      {
        getNextPageParam: (currentPage) => currentPage.meta.page.cursor,
      },
    );

  if (isLoading) return <ListSkeleton withSubtitle={false} />;
  if (error) return <ErrorData />;

  const departments = data && reducePages(data.pages);

  if (!departments || isArrayEmpty(departments.records)) return <NoData />;

  return (
    <div
      {...props}
      className={cn("flex w-full flex-col gap-4", props.className)}
    >
      <div className="flex w-full flex-col">
        {departments.records.map((department, i) => (
          <ListTile
            key={department.id}
            href={`${routes.departments}/${department.id}`}
            title={department.name}
            isLastItem={departments.records.length > i + 1}
          />
        ))}
      </div>
      <PaginationButton
        canLoadMore={departments.meta.page.more}
        isLoading={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      />
    </div>
  );
};
