import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import { type PaginationQueryMeta } from "@xata.io/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateArray = (size?: number) => {
  return [...Array(size ?? 20).keys()];
};

export function reducePages<T>(
  pages: {
    records: T[];
    meta: PaginationQueryMeta;
  }[],
) {
  return pages.reduce(
    (previous, current) => {
      if (previous.records) {
        return {
          ...current,
          records: [...previous.records, ...current.records],
        } as typeof current;
      } else {
        return current;
      }
    },
    {} as (typeof pages)[0],
  );
}
