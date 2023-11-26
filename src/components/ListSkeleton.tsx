import React from "react";
import { ListTileSkeleton } from ".";
import { generateArray } from "~/lib";

type Props = {
  size?: number;
};

export const ListSkeleton = ({ size }: Props) => {
  return generateArray(size).map((_, i) => (
    <ListTileSkeleton
      key={i}
      isLastItem={generateArray(size).length > i + 1}
      hasSubtitle
    />
  ));
};
