import { Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "~/lib";

export const Unauthenticated = () => {
  const pathName = usePathname();

  return (
    <div className="grid h-screen place-content-center place-items-center gap-8 p-8">
      <Lock className="text-destructive" size={80} />
      <p className="text-center">
        It looks like you are not authenticated.{" "}
        <Link
          href={`${routes.signIn}?callbackUrl=${pathName}`}
          className="cursor-pointer text-primary underline"
        >
          Authenticate
        </Link>{" "}
        to continue.
      </p>
    </div>
  );
};
