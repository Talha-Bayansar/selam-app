"use client";
import { PageWrapper } from "~/components";
import { DepartmentsForm } from "~/departments";

const Page = () => {
  return (
    <PageWrapper className="md:max-w-lg" title="New department">
      <DepartmentsForm onSubmit={console.log} isSubmitting={false} />
    </PageWrapper>
  );
};

export default Page;
