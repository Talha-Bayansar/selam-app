"use client";
import { PageWrapper } from "~/components";
import { EditGroupsForm } from "~/groups";

type Props = {
  params: {
    groupId: string;
  };
};

const Page = ({ params }: Props) => {
  return (
    <PageWrapper className="md:max-w-lg" title="Edit group">
      <EditGroupsForm groupId={params.groupId} />
    </PageWrapper>
  );
};

export default Page;
