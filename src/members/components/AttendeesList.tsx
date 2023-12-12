/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import {
  Button,
  ListTile,
  PaginationButton,
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  ShowEmpty,
} from "~/components";
import { reducePages } from "~/lib";
import { type MembersActivitiesRecord } from "~/server/db";
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
  const mutation = api.activities.deleteMemberFromActivity.useMutation();
  const handleDeleteFromActivity = (
    memberActivity: MembersActivitiesRecord,
  ) => {
    const hasConfirmed = confirm(
      `Are you sure you want to delete ${memberActivity.member?.firstName} ${memberActivity.member?.lastName} from ${memberActivity.activity?.name}?`,
    );
    if (hasConfirmed) {
      mutation.mutate({
        memberActivityId: memberActivity.id,
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <ShowEmpty />;

  const membersActivity = reducePages(data.pages);
  if (membersActivity.records.length < 1) return <ShowEmpty />;

  return (
    <div className="flex flex-col">
      {membersActivity.records.map(({ member, id, ...rest }, i) => (
        <Sheet key={id}>
          <SheetTrigger asChild>
            <ListTile
              key={id}
              title={`${member?.firstName} ${member?.lastName}`}
              isLastItem={membersActivity.records.length > i + 1}
            />
          </SheetTrigger>
          <SheetContent className="flex flex-col gap-4 pb-8" side="bottom">
            <SheetHeader>
              <SheetTitle className="text-left">{`${member?.firstName} ${member?.lastName}`}</SheetTitle>
            </SheetHeader>
            <SheetFooter className="sm:flex-col md:w-auto md:items-start">
              <SheetClose asChild>
                <Button
                  variant="destructive"
                  onClick={() =>
                    handleDeleteFromActivity({
                      member,
                      id,
                      ...rest,
                    } as MembersActivitiesRecord)
                  }
                >
                  Delete from activity
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
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
