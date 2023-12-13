/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Button,
  ListTile,
  ListTileSkeleton,
  PageWrapper,
  PaginationButton,
  NoData,
} from "~/components";
import { cn, generateArray, reducePages, routes } from "~/lib";
import { api } from "~/trpc/react";

type Props = {
  params: {
    activityId: string;
  };
};

const Page = ({ params }: Props) => {
  const router = useRouter();
  const {
    data: membersData,
    isLoading: isLoadingMembers,
    fetchNextPage,
    isFetchingNextPage,
  } = api.members.getAll.useInfiniteQuery(
    {},
    {
      getNextPageParam: (currentPage) => currentPage.meta.page.cursor,
    },
  );
  const { data: activityMembers, isLoading: isLoadingActivityMembers } =
    api.members.getAllByActivityId.useQuery({
      activityId: params.activityId,
    });
  const mutation = api.activities.addMembers.useMutation({
    onSuccess: () =>
      router.replace(`${routes.activities}/${params.activityId}`),
  });

  const [addedMemberIds, setAddedMemberIds] = useState<string[]>([]);

  const selectMember = (id: string) => {
    if (
      !activityMembers?.find(
        (memberActivity) => memberActivity.member?.id === id,
      )
    ) {
      if (addedMemberIds.includes(id)) {
        setAddedMemberIds((ids) => ids.filter((val) => val !== id));
      } else {
        setAddedMemberIds((ids) => [...ids, id]);
      }
    }
  };

  const selectedMembers = useMemo(() => {
    const memberIdsActivity = activityMembers?.map((am) => am.member?.id);
    if (memberIdsActivity) return [...memberIdsActivity, ...addedMemberIds];
  }, [addedMemberIds, activityMembers]);

  const members = membersData && reducePages(membersData.pages);

  return (
    <PageWrapper title="Add attendees">
      {isLoadingMembers || isLoadingActivityMembers ? (
        generateArray().map((v, i) => (
          <ListTileSkeleton
            key={v}
            isLastItem={generateArray().length > i + 1}
          />
        ))
      ) : !membersData || !members || members.records.length < 1 ? (
        <NoData />
      ) : (
        <div className="flex flex-col gap-4">
          <Button
            className="md:max-w-lg"
            onClick={() =>
              mutation.mutate({
                id: params.activityId,
                addMemberIds: addedMemberIds,
              })
            }
            disabled={
              JSON.stringify(selectedMembers) ===
                JSON.stringify(
                  activityMembers?.map(
                    (activityMember) => activityMember.member?.id,
                  ),
                ) || mutation.isLoading
            }
          >
            Add members
          </Button>
          <div className="flex flex-col">
            {members?.records.map((member, i) => (
              <ListTile
                key={member.id}
                className={cn({
                  "text-primary [&>button]:hover:text-primary":
                    selectedMembers?.includes(member.id),
                })}
                onClick={() => selectMember(member.id)}
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
      )}
    </PageWrapper>
  );
};

export default Page;
