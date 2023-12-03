"use client";
import { useRouter } from "next/navigation";
import { ActivitiesForm } from "~/activities";
import { PageWrapper } from "~/components";
import { routes } from "~/lib";
import { api } from "~/trpc/react";

const Page = () => {
  const router = useRouter();
  const mutation = api.activities.create.useMutation({
    onSuccess: () => router.replace(routes.activities),
  });
  return (
    <PageWrapper
      className="flex flex-grow flex-col md:max-w-lg"
      title="New activity"
    >
      <ActivitiesForm
        isSubmitting={mutation.isLoading}
        onSubmit={mutation.mutate}
      />
    </PageWrapper>
  );
};

export default Page;
