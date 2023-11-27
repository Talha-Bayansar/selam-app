"use client";
import { useRouter } from "next/navigation";
import { PageWrapper, PageWrapperSkeleton } from "~/components";
import { GroupsForm, GroupsFormSkeleton } from "~/groups";
import { routes } from "~/lib";
import { api } from "~/trpc/react";

type Props = {
  params: {
    groupId: string;
  };
};

const Page = ({ params }: Props) => {
  const router = useRouter();
  const { data, isLoading } = api.groups.getById.useQuery({
    id: params.groupId,
  });
  const mutation = api.groups.edit.useMutation({
    onSuccess: () => {
      router.replace(routes.groups);
    },
  });

  if (isLoading)
    return (
      <PageWrapperSkeleton className="md:max-w-lg">
        <GroupsFormSkeleton />
      </PageWrapperSkeleton>
    );

  return (
    <PageWrapper className="md:max-w-lg" title="Edit group">
      <GroupsForm
        onSubmit={(values) =>
          mutation.mutate({
            id: params.groupId,
            ...values,
          })
        }
        isSubmitting={mutation.isLoading}
        group={data}
      />
    </PageWrapper>
  );
};

export default Page;
