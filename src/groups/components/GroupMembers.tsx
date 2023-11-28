import { format } from "date-fns";
import React from "react";
import {
  Button,
  ListSkeleton,
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
import { cn, reducePages } from "~/lib";
import { type MembersGroupsRecord } from "~/server/db";
import { api } from "~/trpc/react";

type Props = {
  groupId: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const GroupMembers = ({ groupId, ...props }: Props) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage, refetch } =
    api.members.getByGroupID.useInfiniteQuery(
      {
        groupId: groupId,
      },
      {
        getNextPageParam: (currentPage) => currentPage.meta.page.cursor,
      },
    );

  const deleteMemberFromGroupMutation =
    api.groups.deleteMemberFromGroup.useMutation({
      onSuccess: async () => {
        await refetch();
      },
    });

  const handleDeleteFromGroup = (memberGroup: MembersGroupsRecord) => {
    const hasConfirmed = confirm(
      `Are you sure you want to delete ${memberGroup.member?.firstName} ${memberGroup.member?.lastName} from ${memberGroup.group?.name}?`,
    );
    if (hasConfirmed) {
      deleteMemberFromGroupMutation.mutate({
        memberGroupId: memberGroup.id,
      });
    }
  };

  const members = data && reducePages(data?.pages);

  if (isLoading) return <ListSkeleton />;

  return (
    <div className={cn("w-full", props.className)}>
      {members && members.records.length > 0 ? (
        members.records.map((memberGroup, i) => (
          <Sheet key={memberGroup.id}>
            <SheetTrigger asChild>
              <ListTile
                title={`${memberGroup.member?.firstName} ${memberGroup.member?.lastName}`}
                isLastItem={members?.records.length > i + 1}
                subtitle={
                  memberGroup.member?.dateOfBirth
                    ? format(
                        new Date(memberGroup.member.dateOfBirth.toString()),
                        "dd/MM/yyyy",
                      )
                    : "undefined"
                }
              />
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-4 pb-8" side="bottom">
              <SheetHeader>
                <SheetTitle className="text-left">{`${memberGroup.member?.firstName} ${memberGroup.member?.lastName}`}</SheetTitle>
              </SheetHeader>
              <SheetFooter className="sm:flex-col md:w-auto md:items-start">
                <SheetClose asChild>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleDeleteFromGroup(memberGroup as MembersGroupsRecord)
                    }
                  >
                    Delete from group
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))
      ) : (
        <ShowEmpty />
      )}
      <PaginationButton
        canLoadMore={members?.meta.page.more ?? false}
        isLoading={isFetchingNextPage}
        className="mt-4"
        onClick={() => fetchNextPage()}
      />
    </div>
  );
};
