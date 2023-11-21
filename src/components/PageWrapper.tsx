import React, { type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  title: string;
} & HTMLAttributes<HTMLDivElement>;

export const PageWrapper = ({ title, ...props }: Props) => {
  return (
    <div className="flex flex-grow flex-col gap-8">
      <h1 className="text-4xl">{title}</h1>
      <div {...props} className={twMerge("flex flex-col", props.className)}>
        {props.children}
      </div>
    </div>
  );
};
