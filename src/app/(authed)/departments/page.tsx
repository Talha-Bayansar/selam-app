import Link from "next/link";
import { ActionsButton, Button, PageWrapper } from "~/components";
import { AllDepartmentsPaginatedList } from "~/departments";
import { routes } from "~/lib";

const Page = () => {
  return (
    <PageWrapper
      className="flex flex-col items-start gap-4"
      title="Departments"
    >
      <ActionsButton
        actions={[
          <Button key="new-department" asChild>
            <Link href={`${routes.departments}/create`}>New department</Link>
          </Button>,
        ]}
      />
      <AllDepartmentsPaginatedList />
    </PageWrapper>
  );
};

export default Page;
