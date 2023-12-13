"use client";
import { useRouter } from "next/navigation";
import { routes } from "~/lib";
import { type MembersRecord } from "~/server/db";
import { api } from "~/trpc/react";
import { MembersForm, MembersFormSkeleton } from ".";
import { ErrorData, NoData } from "~/components";

type Props = {
  className?: string;
  memberId: string;
};

export const EditMembersForm = ({ className, memberId }: Props) => {
  const router = useRouter();
  const { data, isLoading, error } = api.members.getById.useQuery({
    id: memberId,
  });
  const mutation = api.members.edit.useMutation({
    onSuccess() {
      router.replace(routes.members);
    },
  });

  if (isLoading) return <MembersFormSkeleton />;
  if (error) return <ErrorData />;
  if (!data) return <NoData />;

  return (
    <MembersForm
      className={className}
      onSubmit={(values) =>
        mutation.mutate({
          id: memberId,
          ...values,
        })
      }
      isSubmitting={mutation.isLoading}
      member={data as MembersRecord}
    />
  );
};
