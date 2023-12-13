"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ActionsButton,
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
        <ActionsButton actions={[]} />
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
    <PageWrapper
      className="flex flex-col items-start gap-4"
      title={group!.name!}
    >
      <ActionsButton
        actions={[
          <Button key="edit-group" asChild>
            <Link href={`${routes.groups}/${params.groupId}/edit`}>
              Edit group
            </Link>
          </Button>,
          <Button key="add-members" asChild>
            <Link href={`${routes.groups}/${params.groupId}/add-members`}>
              Add members
            </Link>
          </Button>,
          <Button
            key="delete-group"
            variant="destructive"
            onClick={handleDelete}
          >
            Delete group
          </Button>,
        ]}
      />
      <GroupMembers groupId={params.groupId} />
    </PageWrapper>
  );
};

export default Page;
