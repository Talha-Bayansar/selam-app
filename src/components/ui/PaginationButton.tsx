import React from "react";
import { Button, type ButtonProps } from ".";
import { cn } from "~/lib";
import { Loader2 } from "lucide-react";

type Props = {
  isLoading: boolean;
  canLoadMore: boolean;
} & ButtonProps &
  React.RefAttributes<HTMLButtonElement>;

export const PaginationButton = (props: Props) => {
  return (
    <Button
      {...props}
      disabled={!!props.disabled || !props.canLoadMore || props.isLoading}
      className={cn("w-full", props.className)}
      variant="secondary"
      onClick={props.onClick}
    >
      {props.isLoading ? (
        <Loader2 className="animate-spin" />
      ) : props.canLoadMore ? (
        "Load more"
      ) : (
        "No more data"
      )}
    </Button>
  );
};
