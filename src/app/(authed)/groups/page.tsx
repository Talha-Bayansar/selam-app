import Link from "next/link";
import { Button, PageWrapper } from "~/components";
import { GroupsList } from "~/groups";
import { routes } from "~/lib";

const Page = () => {
  return (
    <PageWrapper className="flex flex-col items-start gap-4" title="Groups">
      <Button className="w-full md:w-auto" asChild>
        <Link href={`${routes.groups}/create`}>New group</Link>
      </Button>
      <GroupsList />
    </PageWrapper>
  );
};

export default Page;
