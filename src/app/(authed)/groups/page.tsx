import Link from "next/link";
import { ActionsButton, Button, PageWrapper } from "~/components";
import { GroupsList } from "~/groups";
import { routes } from "~/lib";

const Page = () => {
  return (
    <PageWrapper className="flex flex-col items-start gap-4" title="Groups">
      <ActionsButton
        actions={[
          <Button key="new-group" asChild>
            <Link href={`${routes.groups}/create`}>New group</Link>
          </Button>,
        ]}
      />
      <GroupsList />
    </PageWrapper>
  );
};

export default Page;
