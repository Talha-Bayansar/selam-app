"use client";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { type ReactNode } from "react";
import { Unauthenticated } from "~/components";

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  const session = useSession({
    required: true,
  });

  switch (session.status) {
    case "loading":
      return (
        <div className="grid grow place-items-center">
          <Loader2 size={40} className="text-primary animate-spin" />
        </div>
      );
    case "authenticated":
      return children;

    default:
      return <Unauthenticated />;
  }
}
