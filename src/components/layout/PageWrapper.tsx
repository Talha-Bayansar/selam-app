import React, { type HTMLAttributes } from "react";
import { cn } from "~/lib";
import { Skeleton } from "..";

type Props = {
  title: string;
} & HTMLAttributes<HTMLDivElement>;

export const PageWrapper = ({ title, ...props }: Props) => {
  return (
    <main className="flex flex-grow flex-col gap-8">
      <h1 className="text-4xl">{title}</h1>
      <div {...props} className={cn(props.className)}>
        {props.children}
      </div>
    </main>
  );
};

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const PageWrapperSkeleton = (props: SkeletonProps) => {
  return (
    <main className="flex flex-grow flex-col gap-8">
      <Skeleton className="h-10 w-64" />
      <div {...props} className={cn(props.className)}>
        {props.children}
      </div>
    </main>
  );
};
