import { FileX } from "lucide-react";
import { cn } from "~/lib";

type Props = React.HTMLAttributes<HTMLDivElement>;

export const NoData = (props: Props) => {
  return (
    <div
      {...props}
      className={cn("flex flex-col items-center gap-4", props.className)}
    >
      <FileX size={80} />
      <p className="text-center">There is no data yet.</p>
    </div>
  );
};
