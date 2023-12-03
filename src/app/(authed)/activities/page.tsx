import { ActivitiesList } from "~/activities";
import { Button, PageWrapper } from "~/components";

const Page = () => {
  return (
    <PageWrapper
      className="flex flex-grow flex-col items-start gap-4"
      title="Activities"
    >
      <Button className="w-full md:w-auto">New activity</Button>
      <ActivitiesList />
    </PageWrapper>
  );
};

export default Page;
