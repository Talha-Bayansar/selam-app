"use client";

import { useRouter } from "next/navigation";
import { PageWrapper } from "~/components";
import { routes } from "~/lib";
import { MembersForm } from "~/members";
import { api } from "~/trpc/react";

const Page = () => {
  const router = useRouter();
  const mutation = api.members.create.useMutation({
    onSuccess: () => {
      router.replace(routes.members);
    },
  });

  return (
    <PageWrapper
      className="flex flex-grow flex-col md:max-w-lg"
      title="New member"
    >
      <MembersForm
        onSubmit={mutation.mutate}
        isSubmitting={mutation.isLoading}
      />
    </PageWrapper>
  );
};

export default Page;
