"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useOverviewParams = () => {
  const params = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const pageParam = params.get("page") ?? "1";
  const categoryId = params.get("category") ?? undefined;
  const page = parseInt(pageParam);

  const setParams = ({
    page,
    category,
  }: {
    page?: string;
    category?: string;
  }) => {
    router.push(
      `${pathName}?${page ? `page=${page}` : ""}${page && category ? "&" : ""}${
        category ? `category=${category}` : ""
      }`,
    );
  };
  return {
    categoryId,
    page,
    setParams,
  };
};
