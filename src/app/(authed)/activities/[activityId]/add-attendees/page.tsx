/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Button,
  PageWrapper,
  NoData,
  ListSkeleton,
  ErrorData,
  ListTile,
  PaginationButton,
} from "~/components";
import { cn, isArrayEmpty, reducePages, routes } from "~/lib";
import { api } from "~/trpc/react";

type Props = {
  params: {
    activityId: string;
  };
};

const Page = ({ params }: Props) => {
  const router = useRouter();
  const {
    data: activity,
    isLoading: isLoadingActivity,
    error: errorActivity,
  } = api.activities.getById.useQuery({
    id: params.activityId,
  });
  const { data, isLoading, error } = api.members.getAllByActivityId.useQuery({
    activityId: params.activityId,
  });
  const mutation = api.activities.addMembers.useMutation({
    onSuccess: () =>
      router.replace(`${routes.activities}/${params.activityId}`),
  });

  const [addedMemberIds, setAddedMemberIds] = useState<string[]>([]);

  const selectMember = (id: string) => {
    if (!data?.find((memberActivity) => memberActivity.member?.id === id)) {
      if (addedMemberIds.includes(id)) {
        setAddedMemberIds((ids) => ids.filter((val) => val !== id));
      } else {
        setAddedMemberIds((ids) => [...ids, id]);
      }
    }
  };

  const selectedMembers = useMemo(() => {
    const memberIdsActivity = data?.map((am) => am.member!.id);
    if (memberIdsActivity) return [...memberIdsActivity, ...addedMemberIds];
  }, [addedMemberIds, data]);

  return (
    <PageWrapper title="Add attendees">
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
                data?.map((activityMember) => activityMember.member?.id),
              ) ||
            mutation.isLoading ||
            isLoading
          }
        >
          Add members
        </Button>
        {isLoading || isLoadingActivity ? (
          <ListSkeleton withSubtitle={false} />
        ) : error || errorActivity ? (
          <ErrorData />
        ) : !selectedMembers || !activity ? (
          <NoData />
        ) : (
          <MembersList
            groupId={activity.department?.group?.id}
            onChange={selectMember}
            selectedMembers={selectedMembers}
          />
        )}
      </div>
    </PageWrapper>
  );
};

type MembersListProps = {
  groupId?: string;
  className?: string;
  selectedMembers: string[];
  onChange: (memberId: string) => unknown;
};

const MembersList = ({
  groupId,
  className,
  selectedMembers,
  onChange,
}: MembersListProps) => {
  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    api.members.getByGroupID.useInfiniteQuery(
      {
        groupId,
      },
      {
        getNextPageParam: (currentPage) => currentPage.meta.page.cursor,
      },
    );

  if (isLoading) return <ListSkeleton withSubtitle={false} />;
  if (error) return <ErrorData />;

  const membersGroup = data && reducePages(data.pages);

  if (!membersGroup || isArrayEmpty(membersGroup.records)) return <NoData />;

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <div className="flex w-full flex-col">
        {membersGroup.records.map((memberGroup, i) => (
          <ListTile
            key={memberGroup.id}
            className={cn({
              "text-primary [&>button]:hover:text-primary":
                selectedMembers.includes(memberGroup.member!.id),
            })}
            onClick={() => onChange(memberGroup.member!.id)}
            title={`${memberGroup.member?.firstName} ${memberGroup.member?.lastName}`}
            isLastItem={membersGroup.records.length > i + 1}
          />
        ))}
      </div>
      <PaginationButton
        canLoadMore={membersGroup.meta.page.more}
        isLoading={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      />
    </div>
  );
};

export default Page;
