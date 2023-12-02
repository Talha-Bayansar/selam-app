"use client";
import { useRouter } from "next/navigation";
import { PageWrapper } from "~/components";
import { CategoriesForm } from "~/departments";
import { routes } from "~/lib";
import { api } from "~/trpc/react";

type Props = {
  params: {
    departmentId: string;
  };
};

const Page = ({ params }: Props) => {
  const router = useRouter();
  const mutation = api.categories.create.useMutation({
    onSuccess: () => {
      router.replace(`${routes.departments}/${params.departmentId}`);
    },
  });

  return (
    <PageWrapper className="md:max-w-lg" title="New category">
      <CategoriesForm
        isSubmitting={mutation.isLoading}
        onSubmit={(values) =>
          mutation.mutate({
            ...values,
            departmentId: params.departmentId,
          })
        }
      />
    </PageWrapper>
  );
};

export default Page;
