"use client";
import { format } from "date-fns";
import Link from "next/link";
import {
  Button,
  PageWrapper,
  PageWrapperSkeleton,
  ShowEmpty,
  Skeleton,
} from "~/components";
import { routes } from "~/lib";
import { api } from "~/trpc/react";

type Props = {
  params: {
    activityId: string;
  };
};

const Page = ({ params }: Props) => {
  const { data, isLoading } = api.activities.getById.useQuery({
    id: params.activityId,
  });

  const handleDelete = () => {
    confirm("Are you sure you want to delete this activity?");
  };

  if (isLoading)
    return (
      <PageWrapperSkeleton className="flex flex-col gap-4 md:max-w-lg">
        <div className="grid grid-cols-2 gap-4">
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
  if (!data) return <ShowEmpty />;
  return (
    <PageWrapper className="flex flex-col gap-4 md:max-w-lg" title={data.name!}>
      <div className="grid grid-cols-2 gap-4">
        <Button asChild>
          <Link href={`${routes.activities}/${params.activityId}/edit`}>
            Edit
          </Link>
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      <div className="flex flex-col">
        <div>
          Date:{" "}
          {data.start
            ? format(new Date(data.start), "dd/MM/yyyy")
            : "undefined"}
          {data.end && ` - ${format(new Date(data.end), "dd/MM/yyyy")}`}
        </div>
        <div>Department: {data.department?.name ?? "undefined"}</div>
        <div>Category: {data.category?.name ?? "undefined"}</div>
      </div>
    </PageWrapper>
  );
};

export default Page;
