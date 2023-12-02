"use client";

import { ListTile, ShowEmpty } from "~/components";
import { api } from "~/trpc/react";

type Props = {
  departmentId: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const CategoriesList = ({ departmentId, ...props }: Props) => {
  const { data, isLoading } = api.categories.getByDepartmentId.useQuery({
    departmentId,
  });

  if (isLoading) return <div {...props}>Loading...</div>;

  if (!data || data.length <= 0) return <ShowEmpty />;

  return (
    <div {...props}>
      {data.map((category, i) => (
        <ListTile
          key={category.id}
          title={category.name}
          isLastItem={data.length > i + 1}
        />
      ))}
    </div>
  );
};
