import Link from "next/link";
import { ActivitiesList } from "~/activities";
import { ActionsButton, Button, PageWrapper } from "~/components";
import { routes } from "~/lib";

const Page = () => {
  return (
    <PageWrapper
      className="flex flex-grow flex-col items-start gap-4"
      title="Activities"
    >
      <ActionsButton
        actions={[
          <Button key="new-activity" asChild>
            <Link href={`${routes.activities}/create`}>New activity</Link>
          </Button>,
        ]}
      />
      <ActivitiesList />
    </PageWrapper>
  );
};

export default Page;
