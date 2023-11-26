"use client";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  ListTile,
  ListTileSkeleton,
  PageWrapper,
  PageWrapperSkeleton,
  PaginationButton,
} from "~/components";
import { generateArray, reducePages, routes } from "~/lib";
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
  const {
    data,
    isLoading: membersAreLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = api.members.getByGroupID.useInfiniteQuery(
    {
      groupId: params.groupId,
    },
    {
      getNextPageParam: (currentPage) => currentPage.meta.page.cursor,
    },
  );
  const mutation = api.groups.deleteById.useMutation({
    onSuccess() {
      router.replace(routes.groups);
    },
  });

  const members = data && reducePages(data?.pages);

  const handleDelete = () => {
    const hasConfirmed = confirm("Are you sure you want to delete this group?");
    if (hasConfirmed) {
      mutation.mutate({
        id: params.groupId,
      });
    }
  };

  if (groupIsLoading) {
    return (
      <PageWrapperSkeleton className="flex flex-col">
        <div className="grid grid-cols-2 gap-4 md:max-w-lg">
          <Button disabled>Edit</Button>
          <Button variant="destructive" disabled>
            Delete
          </Button>
        </div>
        {generateArray().map((val, i) => (
          <ListTileSkeleton
            key={val}
            isLastItem={generateArray().length > i + 1}
            hasSubtitle
          />
        ))}
      </PageWrapperSkeleton>
    );
  }
  return (
    <PageWrapper className="flex flex-col gap-4" title={group!.name!}>
      <div className="grid grid-cols-2 gap-4 md:max-w-lg">
        <Button asChild>
          <Link href={`${routes.groups}/${params.groupId}/edit`}>Edit</Link>
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      <div className="flex flex-col">
        {membersAreLoading
          ? generateArray().map((val, i) => (
              <ListTileSkeleton
                key={val}
                hasSubtitle
                isLastItem={generateArray().length > i + 1}
              />
            ))
          : members?.records.map((member, i) => (
              <ListTile
                key={member.id}
                href={`${routes.members}/${member.member?.id}`}
                title={`${member.member?.firstName} ${member.member?.lastName}`}
                isLastItem={members.records.length > i + 1}
                subtitle={
                  member.member?.dateOfBirth
                    ? format(
                        new Date(member.member.dateOfBirth.toString()),
                        "dd/MM/yyyy",
                      )
                    : "undefined"
                }
              />
            ))}
        <PaginationButton
          canLoadMore={members?.meta.page.more ?? false}
          isLoading={isFetchingNextPage}
          className="mt-4"
          onClick={() => fetchNextPage()}
        />
      </div>
    </PageWrapper>
  );
};

export default Page;
