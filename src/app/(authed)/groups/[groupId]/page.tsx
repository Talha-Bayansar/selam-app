"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ActionsButton,
  Button,
  ListSkeleton,
  PageWrapper,
  PageWrapperSkeleton,
} from "~/components";
import { AllGroupMembersPaginatedList } from "~/groups";
import { routes } from "~/lib";
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
        <ListSkeleton />
      </PageWrapperSkeleton>
    );
  }
  return (
    <PageWrapper className="items-start gap-4" title={group!.name!}>
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
      <AllGroupMembersPaginatedList groupId={params.groupId} />
    </PageWrapper>
  );
};

export default Page;
