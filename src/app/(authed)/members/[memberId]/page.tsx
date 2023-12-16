"use client";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ActionsButton,
  Button,
  DataTile,
  DataTileSkeleton,
  ErrorData,
  NoData,
  PageWrapper,
  PageWrapperSkeleton,
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
  const { data, isLoading, error } = api.members.getById.useQuery({
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
      <PageWrapperSkeleton className="flex flex-col items-start gap-4">
        <ActionsButton actions={[]} />
        <div className="flex w-full flex-col">
          <DataTileSkeleton />
          <DataTileSkeleton />
          <DataTileSkeleton />
          <DataTileSkeleton isLastItem />
        </div>
      </PageWrapperSkeleton>
    );
  }

  return (
    <PageWrapper
      className="flex flex-grow flex-col items-start gap-4"
      title={`${data?.firstName} ${data?.lastName}`}
    >
      <ActionsButton
        actions={[
          <Button key="edit-member" asChild>
            <Link href={`${routes.members}/${params.memberId}/edit`}>
              Edit member
            </Link>
          </Button>,
          <Button
            key="delete member"
            variant="destructive"
            onClick={handleDelete}
          >
            Delete member
          </Button>,
        ]}
      />
      {error ? (
        <ErrorData />
      ) : !data ? (
        <NoData />
      ) : (
        <div className="flex w-full flex-col">
          <DataTile
            label="Date of birth"
            value={
              data?.dateOfBirth &&
              format(Date.parse(data.dateOfBirth.toString()), "dd/MM/yyyy")
            }
          />
          <DataTile label="Address" value={data?.address} />
          <DataTile label="Phone number" value={data?.phoneNumber} />
          <DataTile label="Gender" value={data?.gender?.name} isLastItem />
        </div>
      )}
    </PageWrapper>
  );
};

export default Page;
