"use client";
import { useRouter } from "next/navigation";
import { ActivitiesForm, ActivitiesFormSkeleton } from "~/activities";
import {
  PageWrapper,
  PageWrapperSkeleton,
  NoData,
  ErrorData,
} from "~/components";
import { routes } from "~/lib";
import { type ActivitiesRecord } from "~/server/db";
import { api } from "~/trpc/react";

type Props = {
  params: {
    activityId: string;
  };
};

const Page = ({ params }: Props) => {
  const router = useRouter();
  const { data, isLoading, error } = api.activities.getById.useQuery({
    id: params.activityId,
  });
  const mutation = api.activities.edit.useMutation({
    onSuccess: () => router.replace(routes.activities),
  });

  if (isLoading)
    return (
      <PageWrapperSkeleton className="flex flex-grow md:max-w-lg">
        <ActivitiesFormSkeleton />
      </PageWrapperSkeleton>
    );
  if (error) return <ErrorData />;
  if (!data) return <NoData />;
  return (
    <PageWrapper className="flex flex-grow md:max-w-lg" title={data.name!}>
      <ActivitiesForm
        isSubmitting={mutation.isLoading}
        activity={data as ActivitiesRecord}
        onSubmit={(values) =>
          mutation.mutate({
            id: params.activityId,
            departmentId: values.department,
            name: values.name,
            categoryId: values.category,
            start: values.start,
            end: values.end,
          })
        }
      />
    </PageWrapper>
  );
};

export default Page;
