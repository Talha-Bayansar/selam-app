"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ActionsButton,
  Button,
  PageWrapper,
  PageWrapperSkeleton,
} from "~/components";
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
      <PageWrapperSkeleton className="flex flex-col items-start gap-4">
        <ActionsButton actions={[]} />
      </PageWrapperSkeleton>
    );

  return (
    <PageWrapper className="flex flex-col items-start gap-4" title={data!.name}>
      <ActionsButton
        actions={[
          <Button key="edit-department" asChild>
            <Link href={`${routes.departments}/${params.departmentId}/edit`}>
              Edit department
            </Link>
          </Button>,
          <Button key="add-category" asChild>
            <Link
              href={`${routes.departments}/${params.departmentId}/create-category`}
            >
              Add category
            </Link>
          </Button>,
          <Button
            key="delete department"
            variant="destructive"
            onClick={handleDelete}
            disabled={mutation.isLoading}
          >
            Delete department
          </Button>,
        ]}
      />
      <CategoriesList departmentId={params.departmentId} />
    </PageWrapper>
  );
};

export default Page;
