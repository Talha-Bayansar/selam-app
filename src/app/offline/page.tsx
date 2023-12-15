import { WifiOff } from "lucide-react";

const Page = () => {
  return (
    <div className="grid h-screen place-content-center place-items-center gap-8 p-8">
      <WifiOff className="text-destructive" size={80} />
      <p className="text-center">It looks like you are offline.</p>
    </div>
  );
};

export default Page;
