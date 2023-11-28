import { PageWrapper } from "~/components";
import { DepartmentsForm } from "~/departments";

const Page = () => {
  return (
    <PageWrapper title="New department">
      <DepartmentsForm onSubmit={console.log} isSubmitting={false} />
    </PageWrapper>
  );
};

export default Page;
