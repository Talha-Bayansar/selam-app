"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Button,
  ButtonSkeleton,
  ErrorData,
  ListSkeleton,
  NoData,
  PageWrapper,
  PageWrapperSkeleton,
} from "~/components";
import { routes } from "~/lib";
import { SelectMembersPaginatedList } from "~/members";
import { api } from "~/trpc/react";

type Props = {
  params: {
    groupId: string;
  };
};

const Page = ({ params }: Props) => {
  const { data, isLoading, error } = api.groups.getById.useQuery({
    id: params.groupId,
  });

  if (isLoading)
    return (
      <PageWrapperSkeleton className="flex flex-col gap-4">
        <ButtonSkeleton />
        <ListSkeleton withSubtitle={false} />
      </PageWrapperSkeleton>
    );
  if (error) return <ErrorData />;
  if (!data) return <NoData />;

  return (
    <PageWrapper className="flex flex-col items-start gap-4" title={data.name!}>
      <Body groupId={params.groupId} />
    </PageWrapper>
  );
};

const Body = ({ groupId }: { groupId: string }) => {
  const router = useRouter();

  const { data, isLoading, error } = api.members.getAllByGroupID.useQuery({
    groupId: groupId,
  });

  const mutation = api.groups.addMembers.useMutation({
    onSuccess: () => {
      router.replace(`${routes.groups}/${groupId}`);
    },
  });

  const [addedMemberIds, setAddedMemberIds] = useState<string[]>([]);

  const selectMember = (id: string) => {
    if (!data?.find((memberGroup) => memberGroup.member?.id === id)) {
      if (addedMemberIds.includes(id)) {
        setAddedMemberIds((ids) => ids.filter((val) => val !== id));
      } else {
        setAddedMemberIds((ids) => [...ids, id]);
      }
    }
  };

  const selectedMembers = useMemo(() => {
    const memberIdsGroup = data?.map((mg) => mg.member!.id);
    if (memberIdsGroup) return [...memberIdsGroup, ...addedMemberIds];
  }, [addedMemberIds, data]);

  if (isLoading)
    return (
      <>
        <ButtonSkeleton />
        <ListSkeleton withSubtitle={false} />
      </>
    );

  if (error) return <ErrorData />;
  if (!selectedMembers || !data) return <NoData />;

  return (
    <>
      <Button
        className="w-full md:w-auto"
        onClick={() =>
          mutation.mutate({
            groupId: groupId,
            addMemberIds: addedMemberIds,
          })
        }
        disabled={
          JSON.stringify(selectedMembers) ===
            JSON.stringify(data.map((memberGroup) => memberGroup.member?.id)) ||
          mutation.isLoading
        }
      >
        Add members
      </Button>

      <SelectMembersPaginatedList
        selectedMembers={selectedMembers}
        onChange={selectMember}
      />
    </>
  );
};

export default Page;
