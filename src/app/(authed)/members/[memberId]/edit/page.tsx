"use client";
import { PageWrapper } from "~/components";
import { EditMembersForm } from "~/members";

type Props = {
  params: {
    memberId: string;
  };
};

const Page = ({ params }: Props) => {
  return (
    <PageWrapper
      className="flex flex-grow flex-col md:max-w-lg"
      title="Edit member"
    >
      <EditMembersForm memberId={params.memberId} />
    </PageWrapper>
  );
};

export default Page;
