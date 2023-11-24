"use client";

import { useRouter } from "next/navigation";
import { PageWrapper } from "~/components";
import { routes } from "~/lib";
import { MembersForm, MembersFormSkeleton } from "~/members";
import { type MembersRecord } from "~/server/db";
import { api } from "~/trpc/react";

type Props = {
  params: {
    memberId: string;
  };
};

const Page = ({ params }: Props) => {
  const router = useRouter();
  const { data, isLoading } = api.members.getById.useQuery({
    id: params.memberId,
  });
  const mutation = api.members.edit.useMutation({
    onSuccess() {
      router.replace(routes.members);
    },
  });

  return (
    <PageWrapper className="md:max-w-lg" title="Edit member">
      {isLoading ? (
        <MembersFormSkeleton />
      ) : (
        <MembersForm
          onSubmit={(values) =>
            mutation.mutate({
              id: params.memberId,
              ...values,
            })
          }
          isSubmitting={mutation.isLoading}
          member={data as MembersRecord}
        />
      )}
    </PageWrapper>
  );
};

export default Page;
