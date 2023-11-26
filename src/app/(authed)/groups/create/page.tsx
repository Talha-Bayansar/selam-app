"use client";
import { useRouter } from "next/navigation";
import { PageWrapper } from "~/components";
import { GroupsForm } from "~/groups";
import { routes } from "~/lib";
import { api } from "~/trpc/react";

const Page = () => {
  const router = useRouter();
  const mutation = api.groups.create.useMutation({
    onSuccess: () => {
      router.replace(routes.groups);
    },
  });

  return (
    <PageWrapper className="flex flex-grow" title="New group">
      <GroupsForm
        onSubmit={mutation.mutate}
        isSubmitting={mutation.isLoading}
      />
    </PageWrapper>
  );
};

export default Page;
