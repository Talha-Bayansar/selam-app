"use client";

import { ListTile, PaginationButton, ShowEmpty } from "~/components";
import { reducePages } from "~/lib";
import { api } from "~/trpc/react";

type Props = {
  activityId: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const AttendeesList = ({ activityId }: Props) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    api.members.getByActivityId.useInfiniteQuery(
      {
        activityId,
      },
      {
        getNextPageParam: (currentPage) => currentPage.meta.page.cursor,
      },
    );

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <ShowEmpty />;

  const membersActivity = reducePages(data.pages);
  if (membersActivity.records.length < 1) return <ShowEmpty />;

  return (
    <div className="flex flex-col">
      {membersActivity.records.map(({ member, id }, i) => (
        <ListTile
          key={id}
          title={`${member?.firstName} ${member?.lastName}`}
          isLastItem={membersActivity.records.length > i + 1}
        />
      ))}
      <PaginationButton
        className="mt-4"
        canLoadMore={membersActivity.meta.page.more}
        isLoading={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      />
    </div>
  );
};
