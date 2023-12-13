"use client";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  PageWrapper,
  PageWrapperSkeleton,
  NoData,
  Skeleton,
  ActionsButton,
} from "~/components";
import { routes } from "~/lib";
import { AttendeesList } from "~/members";
import { api } from "~/trpc/react";

type Props = {
  params: {
    activityId: string;
  };
};

const Page = ({ params }: Props) => {
  const router = useRouter();
  const { data: activity, isLoading: isLoadingActivity } =
    api.activities.getById.useQuery({
      id: params.activityId,
    });
  const mutation = api.activities.deleteById.useMutation({
    onSuccess: () => router.replace(routes.activities),
  });

  const handleDelete = () => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this activity?",
    );
    if (hasConfirmed) {
      mutation.mutate({
        id: params.activityId,
      });
    }
  };

  if (isLoadingActivity)
    return (
      <PageWrapperSkeleton className="flex flex-col gap-4">
        <ActionsButton actions={[]} />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      </PageWrapperSkeleton>
    );
  if (!activity) return <NoData />;
  return (
    <PageWrapper
      className="flex flex-col items-start gap-4"
      title={activity.name!}
    >
      <ActionsButton
        actions={[
          <Button key="edit-activity" asChild>
            <Link href={`${routes.activities}/${params.activityId}/edit`}>
              Edit activity
            </Link>
          </Button>,
          <Button key="add-members" asChild>
            <Link
              href={`${routes.activities}/${params.activityId}/add-attendees`}
            >
              Add members
            </Link>
          </Button>,
          <Button
            key="delete-activity"
            variant="destructive"
            onClick={handleDelete}
          >
            Delete activity
          </Button>,
        ]}
      />
      <div className="flex w-full flex-col">
        <div>
          Date:{" "}
          {activity.start
            ? format(new Date(activity.start), "dd/MM/yyyy")
            : "undefined"}
          {activity.end && ` - ${format(new Date(activity.end), "dd/MM/yyyy")}`}
        </div>
        <div>Department: {activity.department?.name ?? "undefined"}</div>
        <div>Category: {activity.category?.name ?? "undefined"}</div>
      </div>
      <div className="flex w-full flex-col gap-4">
        <h2 className="text-2xl underline">Attendees</h2>
        <AttendeesList activityId={params.activityId} />
      </div>
    </PageWrapper>
  );
};

export default Page;
