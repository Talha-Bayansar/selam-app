"use client";
import {
  ErrorData,
  ListSkeleton,
  ListTile,
  NoData,
  PaginationButton,
} from "~/components";
import { cn, isArrayEmpty, reducePages } from "~/lib";
import { api } from "~/trpc/react";

type Props = {
  onChange: (memberId: string) => unknown;
  selectedMembers: string[];
  className?: string;
};

export const SelectMembersPaginatedList = ({
  onChange,
  selectedMembers,
  className,
}: Props) => {
  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    api.members.getAll.useInfiniteQuery(
      {},
      {
        getNextPageParam: (currentPage) => currentPage.meta.page.cursor,
      },
    );

  if (isLoading) return <ListSkeleton withSubtitle={false} />;
  if (error) return <ErrorData />;

  const members = data && reducePages(data.pages);

  if (!members || isArrayEmpty(members.records)) return <NoData />;

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <div className="flex w-full flex-col">
        {members.records.map((member, i) => (
          <ListTile
            key={member.id}
            className={cn({
              "text-primary [&>button]:hover:text-primary":
                selectedMembers.includes(member.id),
            })}
            onClick={() => onChange(member.id)}
            title={`${member.firstName} ${member.lastName}`}
            isLastItem={members.records.length > i + 1}
          />
        ))}
      </div>
      <PaginationButton
        canLoadMore={members.meta.page.more}
        isLoading={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      />
    </div>
  );
};
