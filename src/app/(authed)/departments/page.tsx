import Link from "next/link";
import { Button, PageWrapper } from "~/components";
import { DepartmentsList } from "~/departments";
import { routes } from "~/lib";

const Page = () => {
  return (
    <PageWrapper className="flex flex-col gap-4" title="Departments">
      <div>
        <Button asChild>
          <Link href={`${routes.departments}/create`}>New department</Link>
        </Button>
      </div>
      <DepartmentsList />
    </PageWrapper>
  );
};

export default Page;
