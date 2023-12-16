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
  ListSkeleton,
  ErrorData,
  DataTile,
  DataTileSkeleton,
} from "~/components";
import { routes } from "~/lib";
import { AttendeesPaginatedList } from "~/members";
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

  if (isLoading)
    return (
      <PageWrapperSkeleton className="flex flex-col gap-4">
        <ActionsButton actions={[]} />
        <div className="flex flex-col gap-2">
          <DataTileSkeleton />
          <DataTileSkeleton />
          <DataTileSkeleton />
          <DataTileSkeleton />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-40" />
          <ListSkeleton withSubtitle={false} />
        </div>
      </PageWrapperSkeleton>
    );
  if (error) return <ErrorData />;
  if (!data) return <NoData />;

  return (
    <PageWrapper className="flex flex-col items-start gap-4" title={data.name!}>
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
        <DataTile
          label="Date"
          value={
            data.start &&
            `${format(new Date(data.start), "dd/MM/yyyy")}
          ${data.end && ` - ${format(new Date(data.end), "dd/MM/yyyy")}`}`
          }
        />
        <DataTile label="Group" value={data.group?.name} />
        <DataTile label="Department" value={data.department?.name} />
        <DataTile label="Category" value={data.category?.name} />
      </div>
      <div className="flex w-full flex-grow flex-col gap-4">
        <h2 className="text-2xl underline">Attendees</h2>
        <AttendeesPaginatedList activityId={params.activityId} />
      </div>
    </PageWrapper>
  );
};

export default Page;
