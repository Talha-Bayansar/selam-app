import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components";
import { routes } from "~/lib";

export default function Page() {
  return (
    <main className="grid min-h-screen place-items-center p-8">
      <header className="flex flex-col items-center gap-4 md:grid md:grow md:grid-cols-2 md:place-items-center">
        <Image
          priority
          className="md:w-full"
          src="/icon.svg"
          alt="Selam Jongeren logo"
          width={250}
          height={250}
        />
        <div className="flex flex-col gap-8 md:items-start">
          <h1 className="flex flex-col gap-4 text-4xl md:text-6xl">
            Welcome to Selam
            <span className="text-2xl md:text-4xl">
              Organize, Connect, and Manage Events
            </span>
          </h1>
          <p className="md:max-w-2xl">
            Selam simplifies organization management by allowing you to create
            and manage groups within your organization. Add members, organize
            them into groups, and effortlessly keep an organized record of
            attendance at events and activities. Stay connected, coordinate
            events, and build a closer-knit community.
          </p>
          <Button asChild>
            <Link href={routes.dashboard}>Get started</Link>
          </Button>
        </div>
      </header>
    </main>
  );
}
