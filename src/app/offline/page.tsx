import { PageWrapper } from "~/components";

const Page = () => {
  return (
    <PageWrapper className="gap-4 md:max-w-lg" title="Oops!">
      <p>It looks like you are offline.</p>
    </PageWrapper>
  );
};

export default Page;
