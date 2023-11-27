"use client";
import { ListTile, PageWrapper } from "~/components";
import { reducePages } from "~/lib";
import { api } from "~/trpc/react";

type Props = {
  params: {
    groupId: string;
  };
};

const Page = ({ params }: Props) => {
  const { data: group, isLoading: groupIsLoading } =
    api.groups.getById.useQuery({
      id: params.groupId,
    });

  const { data: membersGroupPaginated, isLoading: membersIsLoading } =
    api.members.getByGroupID.useInfiniteQuery(
      {
        groupId: params.groupId,
      },
      {
        getNextPageParam: (currentPage) => currentPage.meta.page.cursor,
      },
    );

  const membersGroup =
    membersGroupPaginated && reducePages(membersGroupPaginated.pages);

  if (groupIsLoading) return "Loading...";

  return (
    <PageWrapper title={group!.name!}>
      {membersIsLoading
        ? "Loading..."
        : membersGroup?.records.map((memberGroup, i) => (
            <ListTile
              key={memberGroup.id}
              title={`${memberGroup.member?.firstName} ${memberGroup.member?.lastName}`}
              isLastItem={membersGroup.records.length > i + 1}
            />
          ))}
    </PageWrapper>
  );
};

export default Page;
