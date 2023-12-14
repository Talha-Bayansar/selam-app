"use client";

import { api } from "~/trpc/react";
import { GroupsForm, GroupsFormSkeleton } from ".";
import { useRouter } from "next/navigation";
import { cn, routes } from "~/lib";
import { ErrorData, NoData } from "~/components";

type Props = {
  className?: string;
  groupId: string;
};

export const EditGroupsForm = ({ className, groupId }: Props) => {
  const router = useRouter();
  const { data, isLoading, error } = api.groups.getById.useQuery({
    id: groupId,
  });
  const mutation = api.groups.edit.useMutation({
    onSuccess: () => {
      router.replace(routes.groups);
    },
  });

  if (isLoading) return <GroupsFormSkeleton />;
  if (error) return <ErrorData />;
  if (!data) return <NoData />;

  return (
    <GroupsForm
      className={cn(className)}
      onSubmit={(values) =>
        mutation.mutate({
          id: groupId,
          ...values,
        })
      }
      isSubmitting={mutation.isLoading}
      group={data}
    />
  );
};
