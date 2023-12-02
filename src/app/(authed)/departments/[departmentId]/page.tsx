"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, PageWrapper, PageWrapperSkeleton } from "~/components";
import { CategoriesList } from "~/departments";
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
    return (
      <PageWrapperSkeleton className="flex flex-col gap-4 md:max-w-lg">
        <div className="grid grid-cols-2 gap-4">
          <Button disabled>Edit</Button>
          <Button variant="destructive" disabled>
            Delete
          </Button>
        </div>
      </PageWrapperSkeleton>
    );

  return (
    <PageWrapper className="flex flex-col gap-4 md:max-w-lg" title={data!.name}>
      <div className="grid grid-cols-3 gap-4">
        <Button asChild>
          <Link href={`${routes.departments}/${params.departmentId}/edit`}>
            Edit
          </Link>
        </Button>
        <Button asChild>
          <Link
            href={`${routes.departments}/${params.departmentId}/create-category`}
          >
            Add
          </Link>
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={mutation.isLoading}
        >
          Delete
        </Button>
      </div>
      <CategoriesList departmentId={params.departmentId} />
    </PageWrapper>
  );
};

export default Page;
