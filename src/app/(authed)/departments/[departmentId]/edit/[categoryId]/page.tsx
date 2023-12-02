/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
"use client";

import { useRouter } from "next/navigation";
import { PageWrapper, PageWrapperSkeleton } from "~/components";
import { CategoriesForm, CategoriesFormSkeleton } from "~/departments";
import { routes } from "~/lib";
import { type CategoriesRecord } from "~/server/db";
import { api } from "~/trpc/react";

type Props = {
  params: {
    departmentId: string;
    categoryId: string;
  };
};

const Page = ({ params }: Props) => {
  const router = useRouter();
  const { data, isLoading } = api.categories.getById.useQuery({
    id: params.categoryId,
  });
  const mutation = api.categories.edit.useMutation({
    onSuccess: () => {
      router.replace(`${routes.departments}/${params.departmentId}`);
    },
  });

  if (isLoading)
    return (
      <PageWrapperSkeleton>
        <CategoriesFormSkeleton />
      </PageWrapperSkeleton>
    );

  return (
    <PageWrapper title="Edit category">
      <CategoriesForm
        category={data as CategoriesRecord}
        onSubmit={(values) =>
          mutation.mutate({
            ...values,
            id: params.categoryId,
          })
        }
        isSubmitting={mutation.isLoading}
      />
    </PageWrapper>
  );
};

export default Page;
