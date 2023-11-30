"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  PageWrapper,
  PageWrapperSkeleton,
  ShowEmpty,
} from "~/components";
import { routes } from "~/lib";
import { api } from "~/trpc/react";

type Props = {
  params: { departmentId: string };
};

const Page = ({ params }: Props) => {
  const router = useRouter();
  const { data, isLoading } = api.departments.getById.useQuery({
    id: params.departmentId,
  });
  const mutation = api.departments.deleteById.useMutation({
    onSuccess: () => {
      router.replace(routes.departments);
    },
  });

  const handleDelete = () => {
    const hasConfirmed = confirm(
      "Are you sure you want do delete this department?",
    );
    if (hasConfirmed) {
      mutation.mutate({
        id: params.departmentId,
      });
    }
  };

  if (isLoading)
    return <PageWrapperSkeleton className="md:max-w-lg"></PageWrapperSkeleton>;

  return (
    <PageWrapper className="flex flex-col gap-4 md:max-w-lg" title={data!.name}>
      <div className="grid grid-cols-2 gap-4">
        <Button>Edit</Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={mutation.isLoading}
        >
          Delete
        </Button>
      </div>
      <ShowEmpty />
    </PageWrapper>
  );
};

export default Page;
