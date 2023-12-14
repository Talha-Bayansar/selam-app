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
} from "~/components";
import { routes } from "~/lib";
import { SelectMembersPaginatedList } from "~/members";
import { api } from "~/trpc/react";

type Props = {
  params: {
    activityId: string;
  };
};

const Page = ({ params }: Props) => {
  const router = useRouter();
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
        {isLoading ? (
          <ListSkeleton withSubtitle={false} />
        ) : error ? (
          <ErrorData />
        ) : !selectedMembers ? (
          <NoData />
        ) : (
          <SelectMembersPaginatedList
            selectedMembers={selectedMembers}
            onChange={selectMember}
          />
        )}
      </div>
    </PageWrapper>
  );
};

export default Page;
