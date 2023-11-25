"use client";
import { Loader2 } from "lucide-react";
import { Button, ListTile, ShowEmpty } from "~/components";
import { routes } from "~/lib";
import { MembersListSkeleton } from "~/members";
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

  const groups = data?.pages.reduce(
    (previous, current) => {
      if (previous.records) {
        return {
          ...current,
          records: [...previous.records, ...current.records],
        } as typeof current;
      } else {
        return current;
      }
    },
    {} as (typeof data.pages)[0],
  );

  return isLoading ? (
    <MembersListSkeleton />
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
      <Button
        disabled={!groups?.meta.page.more || isFetchingNextPage}
        className="mt-4 w-full"
        variant="secondary"
        onClick={() => fetchNextPage()}
      >
        {isFetchingNextPage ? (
          <Loader2 className="animate-spin" />
        ) : groups?.meta.page.more ? (
          "Load more"
        ) : (
          "No more data"
        )}
      </Button>
    </div>
  ) : (
    <ShowEmpty />
  );
};
