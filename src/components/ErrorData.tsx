import { AlertCircle } from "lucide-react";
import React from "react";
import { cn } from "~/lib";

type Props = React.HTMLAttributes<HTMLDivElement>;

export const ErrorData = (props: Props) => {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full flex-grow flex-col items-center justify-center gap-4 ",
        props.className,
      )}
    >
      <AlertCircle className="text-destructive" size={80} />
      <p className="text-center">Something went wrong.</p>
    </div>
  );
};
