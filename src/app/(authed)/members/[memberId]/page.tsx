"use client";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  PageWrapper,
  PageWrapperSkeleton,
  Skeleton,
} from "~/components";
import { routes } from "~/lib";
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

  const mutation = api.members.deleteById.useMutation({
    onSuccess() {
      router.replace(routes.members);
    },
  });

  const handleDelete = () => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this member?",
    );
    if (hasConfirmed) {
      mutation.mutate({
        id: params.memberId,
      });
    }
  };

  if (isLoading) {
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
  }

  return (
    <PageWrapper
      className="flex flex-col gap-4 md:max-w-lg"
      title={`${data?.firstName} ${data?.lastName}`}
    >
      <div className="grid grid-cols-2 gap-4">
        <Button asChild>
          <Link href={`${routes.members}/${params.memberId}/edit`}>Edit</Link>
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      <div className="flex flex-col">
        <div>
          Date of birth:{" "}
          {data?.dateOfBirth
            ? format(Date.parse(data?.dateOfBirth.toString()), "dd/MM/yyyy")
            : "undefined"}
        </div>
        <div>Address: {data?.address ?? "undefined"}</div>
        <div>Phone number: {data?.phoneNumber ?? "undefined"}</div>
        <div>Gender: {data?.gender ? data?.gender?.name : "undefined"}</div>
      </div>
    </PageWrapper>
  );
};

export default Page;
