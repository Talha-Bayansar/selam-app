"use client";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  PageWrapper,
  PageWrapperSkeleton,
  ShowEmpty,
  Skeleton,
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
        <div className="grid grid-cols-3 gap-4 md:max-w-lg">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      </PageWrapperSkeleton>
    );
  if (!activity) return <ShowEmpty />;
  return (
    <PageWrapper className="flex flex-col gap-4" title={activity.name!}>
      <div className="grid grid-cols-3 gap-4 md:max-w-lg">
        <Button asChild>
          <Link href={`${routes.activities}/${params.activityId}/edit`}>
            Edit
          </Link>
        </Button>
        <Button asChild>
          <Link
            href={`${routes.activities}/${params.activityId}/add-attendees`}
          >
            Add
          </Link>
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      <div className="flex flex-col">
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
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl underline">Attendees</h2>
        <AttendeesList activityId={params.activityId} />
      </div>
    </PageWrapper>
  );
};

export default Page;
