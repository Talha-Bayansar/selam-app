"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Button,
  ListTile,
  ListTileSkeleton,
  PageWrapper,
  PageWrapperSkeleton,
  PaginationButton,
} from "~/components";
import { cn, generateArray, reducePages, routes } from "~/lib";
import { api } from "~/trpc/react";

type Props = {
  params: {
    groupId: string;
  };
};

const Page = ({ params }: Props) => {
  const router = useRouter();
  const { data: group, isLoading: groupIsLoading } =
    api.groups.getById.useQuery({
      id: params.groupId,
    });
  const { data: membersGroup, isLoading: membersGroupIsLoading } =
    api.members.getAllByGroupID.useQuery({
      groupId: params.groupId,
    });
  const {
    data: membersPaginated,
    isLoading: membersIsLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = api.members.getAll.useInfiniteQuery(
    {},
    {
      getNextPageParam: (currentPage) => currentPage.meta.page.cursor,
    },
  );
  const mutation = api.groups.addMembers.useMutation({
    onSuccess: () => {
      router.replace(`${routes.groups}/${params.groupId}`);
    },
  });

  const [addedMemberIds, setAddedMemberIds] = useState<string[]>([]);

  const selectMember = (id: string) => {
    if (!membersGroup?.find((memberGroup) => memberGroup.member?.id === id)) {
      if (addedMemberIds.includes(id)) {
        setAddedMemberIds((ids) => ids.filter((val) => val !== id));
      } else {
        setAddedMemberIds((ids) => [...ids, id]);
      }
    }
  };

  const selectedMembers = useMemo(() => {
    const memberIdsGroup = membersGroup?.map((mg) => mg.member!.id);
    if (memberIdsGroup) return [...memberIdsGroup, ...addedMemberIds];
  }, [addedMemberIds, membersGroup]);

  const members = membersPaginated && reducePages(membersPaginated.pages);

  if (groupIsLoading)
    return (
      <PageWrapperSkeleton className="flex flex-col gap-4">
        <Button>Add members</Button>
        {generateArray(20).map((item, i) => (
          <ListTileSkeleton
            key={item}
            isLastItem={generateArray(20).length > i + 1}
          />
        ))}
        <PaginationButton canLoadMore={false} isLoading={false} />
      </PageWrapperSkeleton>
    );

  return (
    <PageWrapper className="flex flex-col gap-4" title={group!.name!}>
      <Button
        className="md:max-w-lg"
        onClick={() =>
          mutation.mutate({
            groupId: params.groupId,
            addMemberIds: addedMemberIds,
          })
        }
        disabled={
          JSON.stringify(selectedMembers) ===
            JSON.stringify(
              membersGroup?.map((memberGroup) => memberGroup.member?.id),
            ) || mutation.isLoading
        }
      >
        Add members
      </Button>
      <div className="flex flex-col">
        {membersIsLoading || membersGroupIsLoading
          ? generateArray(20).map((item, i) => (
              <ListTileSkeleton
                key={item}
                isLastItem={generateArray(20).length > i + 1}
              />
            ))
          : members?.records.map((member, i) => (
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
        canLoadMore={members?.meta.page.more ?? false}
        isLoading={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      />
    </PageWrapper>
  );
};

export default Page;
