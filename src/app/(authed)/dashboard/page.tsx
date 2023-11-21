"use client";

import { User, type LucideIcon, Users } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, PageWrapper } from "~/components";
import { routes } from "~/lib";

interface App {
  name: string;
  Icon: LucideIcon;
  href: string;
}

const Page = () => {
  const apps: App[] = [
    {
      name: "Members",
      Icon: User,
      href: routes.members,
    },
    {
      name: "Groups",
      Icon: Users,
      href: routes.groups,
    },
  ];

  return (
    <PageWrapper className="flex flex-col" title="Apps">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {apps.map((app) => (
          <Link key={app.name} href={app.href}>
            <Card>
              <CardContent className="grid place-items-center gap-2 p-4">
                <app.Icon size={36} />
                {app.name}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageWrapper>
  );
};

export default Page;
