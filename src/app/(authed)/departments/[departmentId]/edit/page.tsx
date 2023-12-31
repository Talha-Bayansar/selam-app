"use client";

import { useRouter } from "next/navigation";
import { PageWrapper, PageWrapperSkeleton } from "~/components";
import { DepartmentsForm, DepartmentsFormSkeleton } from "~/departments";
import { routes } from "~/lib";
import { type DepartmentsRecord } from "~/server/db";
import { api } from "~/trpc/react";

type Props = {
  params: {
    departmentId: string;
  };
};

const Page = ({ params }: Props) => {
  const router = useRouter();
  const { data, isLoading } = api.departments.getById.useQuery({
    id: params.departmentId,
  });
  const mutation = api.departments.edit.useMutation({
    onSuccess: () => {
      router.replace(routes.departments);
    },
  });

  if (isLoading)
    return (
      <PageWrapperSkeleton className="flex flex-grow flex-col md:max-w-lg">
        <DepartmentsFormSkeleton />
      </PageWrapperSkeleton>
    );

  return (
    <PageWrapper
      className="flex flex-grow flex-col md:max-w-lg"
      title="Edit department"
    >
      <DepartmentsForm
        department={data as DepartmentsRecord}
        onSubmit={(values) =>
          mutation.mutate({
            ...values,
            id: params.departmentId,
          })
        }
        isSubmitting={mutation.isLoading}
      />
    </PageWrapper>
  );
};

export default Page;
