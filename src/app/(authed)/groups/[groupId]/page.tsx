"use client";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Button,
  ListTile,
  ListTileSkeleton,
  PageWrapper,
  PageWrapperSkeleton,
} from "~/components";
import { routes } from "~/lib";
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

  const members = data?.pages.reduce(
    (previous, current) => {
      if (previous.records) {
        return {
          ...current,
          records: [...previous.records, ...current.records],
        } as typeof current;
      } else {
        return current;
      }
    },
    {} as (typeof data.pages)[0],
  );

  const handleDelete = () => {
    confirm("Are you sure you want to delete this group?");
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
        {[...Array(20).keys()].map((val, i) => (
          <ListTileSkeleton
            key={val}
            isLastItem={[...Array(20).keys()].length > i + 1}
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
          <Link href={`${routes.members}/${params.groupId}/edit`}>Edit</Link>
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      <div className="flex flex-col">
        {membersAreLoading
          ? [...Array(20).keys()].map((val, i) => (
              <ListTileSkeleton
                key={val}
                hasSubtitle
                isLastItem={[...Array(20).keys()].length > i + 1}
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
        <Button
          disabled={!members?.meta.page.more || isFetchingNextPage}
          className="mt-4 w-full"
          variant="secondary"
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? (
            <Loader2 className="animate-spin" />
          ) : members?.meta.page.more ? (
            "Load more"
          ) : (
            "No more data"
          )}
        </Button>
      </div>
    </PageWrapper>
  );
};

export default Page;
