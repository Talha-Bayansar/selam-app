"use client";
import { format } from "date-fns";
import { Button, PageWrapper, Skeleton } from "~/components";
import { api } from "~/trpc/react";

type Props = {
  params: {
    memberId: string;
  };
};

const Page = ({ params }: Props) => {
  const { data, isLoading } = api.members.getById.useQuery({
    id: params.memberId,
  });

  const handleDelete = () => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this member?",
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-grow flex-col gap-8">
        <Skeleton className="h-10 w-64" />
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper
      className="flex flex-col gap-4 md:max-w-lg"
      title={`${data?.firstName} ${data?.lastName}`}
    >
      <div className="grid grid-cols-2 gap-4">
        <Button>Edit</Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      <div className="flex flex-col">
        <div>Address: {data?.address}</div>
        <div>
          Date of birth:{" "}
          {data?.dateOfBirth
            ? format(Date.parse(data?.dateOfBirth.toString()), "dd/MM/yyyy")
            : "undefined"}
        </div>
        <div>Gender: {data?.gender ? data?.gender?.name : "undefined"}</div>
      </div>
    </PageWrapper>
  );
};

export default Page;
