"use client";
import { useRouter } from "next/navigation";
import { PageWrapper } from "~/components";
import { DepartmentsForm } from "~/departments";
import { routes } from "~/lib";
import { api } from "~/trpc/react";

const Page = () => {
  const router = useRouter();
  const mutation = api.departments.create.useMutation({
    onSuccess: () => {
      router.replace(routes.departments);
    },
  });

  return (
    <PageWrapper
      className="flex flex-grow flex-col md:max-w-lg"
      title="New department"
    >
      <DepartmentsForm
        onSubmit={mutation.mutate}
        isSubmitting={mutation.isLoading}
      />
    </PageWrapper>
  );
};

export default Page;
