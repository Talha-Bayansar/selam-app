import Link from "next/link";
import { Button, PageWrapper } from "~/components";
import { DepartmentsList } from "~/departments";
import { routes } from "~/lib";

const Page = () => {
  return (
    <PageWrapper
      className="flex flex-col items-start gap-4"
      title="Departments"
    >
      <Button className="w-full md:w-auto" asChild>
        <Link href={`${routes.departments}/create`}>New department</Link>
      </Button>
      <DepartmentsList />
    </PageWrapper>
  );
};

export default Page;
