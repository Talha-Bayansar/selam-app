import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "~/lib";

export const Unauthenticated = () => {
  const pathName = usePathname();

  return (
    <div className="place-items-centerp-4 grid h-screen place-content-center">
      <p className="text-center">
        It looks like you are not authenticated.
        <Link
          href={`${routes.signIn}?callbackUrl=${pathName}`}
          className="cursor-pointer text-blue-600"
        >
          Authenticate
        </Link>
      </p>
    </div>
  );
};
