"use client";

import {
  Button,
  PageWrapper,
  PageWrapperSkeleton,
  ShowEmpty,
} from "~/components";
import { api } from "~/trpc/react";

type Props = {
  params: { departmentId: string };
};

const Page = ({ params }: Props) => {
  const { data, isLoading } = api.departments.getById.useQuery({
    id: params.departmentId,
  });

  if (isLoading)
    return <PageWrapperSkeleton className="md:max-w-lg"></PageWrapperSkeleton>;
  return (
    <PageWrapper className="flex flex-col gap-4 md:max-w-lg" title={data!.name}>
      <div className="grid grid-cols-2 gap-4">
        <Button>Edit</Button>
        <Button variant="destructive">Delete</Button>
      </div>
      <ShowEmpty />
    </PageWrapper>
  );
};

export default Page;
