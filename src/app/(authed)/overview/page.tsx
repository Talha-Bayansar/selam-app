"use client";
import {
  Button,
  ErrorData,
  NoData,
  PageWrapper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components";
import { generateArray, routes } from "~/lib";
import { api } from "~/trpc/react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  return (
    <PageWrapper title="Overview">
      <Body />
    </PageWrapper>
  );
};

const Body = () => {
  const router = useRouter();
  const params = useSearchParams();
  const page = params.get("page") ? parseInt(params.get("page") ?? "1") : 1;
  const { data, isLoading, error } = api.overview.getAttendanceData.useQuery({
    size: 10,
    offset: page && page > 1 ? (page - 1) * 10 : 0,
  });

  if (isLoading)
    return (
      <div className="flex w-full flex-grow flex-col">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>All</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {generateArray(10).map((v) => (
              <TableRow key={v}>
                <TableCell>
                  {" "}
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between space-x-2 py-4 md:justify-end">
          <Button variant="outline" size="sm" disabled={true}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={true}>
            Next
          </Button>
        </div>
      </div>
    );
  if (error) return <ErrorData />;
  if (!data) return <NoData />;

  return (
    <div className="flex w-full flex-grow flex-col">
      <DataTable data={data.records} />
      <div className="flex items-center justify-between space-x-2 py-4 md:justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`${routes.overview}?page=${page - 1}`)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`${routes.overview}?page=${page + 1}`)}
          disabled={!data.meta.page.more}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

const DataTable = ({ data }: { data: TData[] }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export type TData = {
  count: number;
  fullName: string;
};

export const columns: ColumnDef<TData>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "count",
    header: "All",
  },
];

export default Page;
