import React from "react";
import { Button, Separator, Skeleton } from "~/components";

type Props = {
  size?: number;
};

export const MembersListSkeleton = ({ size = 20 }: Props) => {
  return [...Array(size).keys()].map((_, i) => (
    <div key={i} className="w-full">
      <Button
        disabled
        className="flex h-auto w-full flex-col items-start gap-1 px-0"
        variant="ghost"
      >
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
      </Button>
      {[...Array(size).keys()].length > i + 1 && <Separator />}
    </div>
  ));
};
