import { PageWrapper } from "~/components";
import { GroupsForm } from "~/groups";

const Page = () => {
  return (
    <PageWrapper className="flex flex-grow" title="New group">
      <GroupsForm />
    </PageWrapper>
  );
};

export default Page;
