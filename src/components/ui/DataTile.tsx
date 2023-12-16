/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { type HTMLAttributes } from "react";
import { Separator, Skeleton } from ".";
import { cn } from "~/lib";

type Props = {
  label: string;
  value?: string | null;
  isLastItem?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const DataTile = ({
  label,
  value,
  isLastItem = false,
  ...props
}: Props) => {
  return (
    <div {...props} className={cn("w-full", props.className)}>
      <div className="flex h-auto w-full flex-col items-start py-1">
        <span className="w-full overflow-hidden text-ellipsis text-start text-xs">
          {label}
        </span>
        <div className="w-full overflow-hidden text-ellipsis text-start">
          {value || "undefined"}
        </div>
      </div>
      {!isLastItem && <Separator />}
    </div>
  );
};

type SkeletonProps = {
  isLastItem?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const DataTileSkeleton = ({
  isLastItem = false,
  ...props
}: SkeletonProps) => {
  return (
    <div {...props} className={cn("w-full", props.className)}>
      <div className="flex h-auto w-full flex-col items-start gap-1 py-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
      {!isLastItem && <Separator />}
    </div>
  );
};
