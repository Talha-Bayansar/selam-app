import { FileX } from "lucide-react";

export const NoData = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <FileX size={80} />
      <p className="text-center">There is no data yet.</p>
    </div>
  );
};
