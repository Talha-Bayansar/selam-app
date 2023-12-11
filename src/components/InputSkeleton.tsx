import { cn } from "~/lib";
import { Skeleton } from ".";

type Props = React.HTMLAttributes<HTMLDivElement>;

export const InputSkeleton = (props: Props) => {
  return (
    <div
      {...props}
      className={cn("flex w-full flex-col gap-4", props.className)}
    >
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
