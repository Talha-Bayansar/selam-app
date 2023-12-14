"use client";
import Link from "next/link";
import {
  Button,
  ListTile,
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  NoData,
  ListSkeleton,
  ErrorData,
} from "~/components";
import { cn, isArrayEmpty, routes } from "~/lib";
import { type CategoriesRecord } from "~/server/db";
import { api } from "~/trpc/react";

type Props = {
  departmentId: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const CategoriesList = ({ departmentId, ...props }: Props) => {
  const { data, isLoading, error } = api.categories.getByDepartmentId.useQuery({
    departmentId,
  });
  const mutation = api.categories.deleteById.useMutation();

  const handleDelete = (category: CategoriesRecord) => {
    const hasConfirmed = confirm(
      `Are you sure you want to delete ${category.name}?`,
    );
    if (hasConfirmed) {
      mutation.mutate({
        id: category.id,
      });
    }
  };

  if (isLoading) return <ListSkeleton withSubtitle={false} />;

  if (error) return <ErrorData />;

  if (!data || isArrayEmpty(data)) return <NoData />;

  return (
    <div {...props} className={cn("flex w-full flex-col", props.className)}>
      {data.map((category, i) => (
        <Sheet key={category.id}>
          <SheetTrigger asChild>
            <ListTile title={category.name} isLastItem={data.length > i + 1} />
          </SheetTrigger>
          <SheetContent
            className="flex flex-col items-start gap-4 pb-8"
            side="bottom"
          >
            <SheetHeader>
              <SheetTitle>{category.name}</SheetTitle>
            </SheetHeader>
            <SheetFooter className="grid w-full grid-cols-2 gap-4 md:w-auto">
              <SheetClose asChild>
                <Button asChild>
                  <Link
                    href={`${routes.departments}/${departmentId}/edit/${category.id}`}
                  >
                    Edit
                  </Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(category)}
                >
                  Delete
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
};
