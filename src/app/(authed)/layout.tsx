"use client";

import { LayoutGrid, Loader2, type LucideIcon, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { Button, NoOrganisation, Unauthenticated } from "~/components";
import { cn, routes } from "~/lib";

type Props = {
  children: ReactNode;
};

interface NavItem {
  name: string;
  Icon: LucideIcon;
  href: string;
}

const Layout = ({ children }: Props) => {
  const pathName = usePathname();

  const navItems: NavItem[] = [
    {
      name: "dashboard",
      href: routes.dashboard,
      Icon: LayoutGrid,
    },
    {
      name: "Settings",
      href: routes.settings,
      Icon: Settings,
    },
  ];

  return (
    <div className="flex flex-grow flex-col md:flex-row-reverse">
      <main className="flex flex-grow flex-col p-8 pb-32 md:pb-8">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 flex justify-evenly bg-gradient-to-t from-white from-80% to-transparent py-8 md:relative md:flex-col md:justify-start md:gap-4 md:px-4 md:py-6 md:shadow-xl">
        {navItems.map((item) => {
          return (
            <Button key={item.name} variant="ghost" asChild>
              <Link href={item.href} title={item.name}>
                <item.Icon
                  size={28}
                  className={cn("text-primary opacity-25", {
                    "opacity-100": pathName.includes(item.href),
                  })}
                ></item.Icon>
              </Link>
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default function AuthLayout({ children }: Props) {
  const session = useSession({
    required: true,
  });

  switch (session.status) {
    case "loading":
      return (
        <div className="grid grow place-items-center">
          <Loader2 size={40} className="animate-spin text-primary" />
        </div>
      );
    case "authenticated":
      return (
        <Layout>
          {session.data.user.organisation ? children : <NoOrganisation />}
        </Layout>
      );

    default:
      return <Unauthenticated />;
  }
}
