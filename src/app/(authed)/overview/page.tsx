/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";
import {
  Button,
  ErrorData,
  NoData,
  PageWrapper,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  InputSkeleton,
  SelectGroup,
  SelectLabel,
} from "~/components";
import { api } from "~/trpc/react";

import { DataTable, DataTableSkeleton, useOverviewParams } from "~/overview";

const Page = () => {
  return (
    <PageWrapper className="flex flex-col items-start gap-4" title="Overview">
      <Dialog>
        <DialogTrigger>
          <Button variant="outline" className="w-full md:w-auto">
            Filter
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90%]">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <Filters />
        </DialogContent>
      </Dialog>
      <Body />
    </PageWrapper>
  );
};

const Body = () => {
  const { page, categoryId, setParams } = useOverviewParams();
  const {
    data: attendance,
    isLoading: isLoadingAttendance,
    error: errorAttendance,
  } = api.overview.getAttendanceData.useQuery({
    size: 10,
    offset: page > 1 ? (page - 1) * 10 : 0,
    categoryId: categoryId,
  });
  const {
    data: category,
    isLoading: isLoadingCategory,
    error: errorCategory,
  } = api.categories.getById.useQuery(
    {
      id: categoryId!,
    },
    {
      enabled: !!categoryId,
    },
  );

  if (isLoadingAttendance || (categoryId && isLoadingCategory))
    return <DataTableSkeleton />;
  if (errorAttendance || errorCategory) return <ErrorData />;
  if (!attendance) return <NoData />;

  return (
    <div className="flex w-full flex-grow flex-col">
      <div className="flex items-center justify-between space-x-2 py-4 md:justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setParams({
              page: `${page - 1}`,
              category: categoryId,
            })
          }
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setParams({
              page: `${page + 1}`,
              category: categoryId,
            })
          }
          disabled={!attendance.meta.page.more}
        >
          Next
        </Button>
      </div>
      <DataTable data={attendance.records} header={category?.name ?? "All"} />
    </div>
  );
};

const Filters = () => {
  const { categoryId, setParams } = useOverviewParams();
  const { data, isLoading, error } = api.categories.getAll.useQuery();

  if (isLoading) return <InputSkeleton />;
  if (error) return <ErrorData />;
  if (!data) return <NoData />;

  const duplicateDepartments = data.map((category) => category.department);
  const duplicateDepartmentIds = duplicateDepartments.map(
    (department) => department!.id,
  );
  const uniqueDepartmentIds = [...new Set(duplicateDepartmentIds)];
  const departments = uniqueDepartmentIds.map((id) =>
    duplicateDepartments.find((department) => department!.id === id),
  );

  return (
    <>
      <label className="mb-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Categories
      </label>
      <Select
        onValueChange={(value) =>
          setParams({ category: value !== "all" ? value : undefined })
        }
        defaultValue={categoryId ?? "all"}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="All" value="all">
            All
          </SelectItem>
          {departments.map((department) => (
            <SelectGroup key={department?.id}>
              <SelectLabel>{department?.name}</SelectLabel>
              {data
                .filter(
                  (category) => category.department?.id === department?.id,
                )
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default Page;
