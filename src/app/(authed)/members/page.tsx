import Link from "next/link";
import { Button, PageWrapper, ActionsButton } from "~/components";
import { routes } from "~/lib";
import { AllMembersPaginatedList } from "~/members";

const Page = () => {
  return (
    <PageWrapper
      className="flex flex-grow flex-col items-start gap-4"
      title="Members"
    >
      <ActionsButton
        actions={[
          <Button key="new-member" asChild>
            <Link href={`${routes.members}/create`}>New member</Link>
          </Button>,
        ]}
      />
      <AllMembersPaginatedList />
    </PageWrapper>
  );
};

export default Page;
