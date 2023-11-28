"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  ListTileSkeleton,
  PageWrapper,
  PageWrapperSkeleton,
} from "~/components";
import { GroupMembers } from "~/groups";
import { generateArray, routes } from "~/lib";
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
  const mutation = api.groups.deleteById.useMutation({
    onSuccess() {
      router.replace(routes.groups);
    },
  });

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
      <PageWrapperSkeleton className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4 md:max-w-lg">
          <Button disabled>Edit</Button>
          <Button disabled>Add</Button>
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
      <div className="grid grid-cols-3 gap-4 md:max-w-lg">
        <Button asChild>
          <Link href={`${routes.groups}/${params.groupId}/edit`}>Edit</Link>
        </Button>
        <Button asChild>
          <Link href={`${routes.groups}/${params.groupId}/add-members`}>
            Add
          </Link>
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      <GroupMembers groupId={params.groupId} />
    </PageWrapper>
  );
};

export default Page;
