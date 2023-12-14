import React from "react";
import { ListTileSkeleton } from ".";
import { generateArray } from "~/lib";

type Props = {
  size?: number;
  withSubtitle?: boolean;
};

export const ListSkeleton = ({ size, withSubtitle = true }: Props) => {
  return (
    <div className="flex w-full flex-col">
      {generateArray(size).map((_, i) => (
        <ListTileSkeleton
          key={i}
          isLastItem={generateArray(size).length > i + 1}
          hasSubtitle={withSubtitle}
        />
      ))}
    </div>
  );
};
