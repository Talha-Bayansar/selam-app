import { AlertCircle } from "lucide-react";
import React from "react";
import { cn } from "~/lib";

type Props = React.HTMLAttributes<HTMLDivElement>;

export const ErrorData = (props: Props) => {
  return (
    <div
      {...props}
      className={cn("flex flex-col items-center gap-4", props.className)}
    >
      <AlertCircle className="text-destructive" size={80} />
      <p className="text-center">There is no data yet.</p>
    </div>
  );
};
