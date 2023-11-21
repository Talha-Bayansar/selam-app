"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "~/components";
import { routes } from "~/lib";

const Page = () => {
  const searchParams = useSearchParams();
  return (
    <div className="flex flex-grow flex-col items-center">
      <div className="flex flex-grow flex-col items-center justify-evenly md:mb-40 md:max-w-3xl md:justify-center md:gap-8">
        <Image
          priority
          className="md:w-96"
          src="/icon.svg"
          alt="Selam Jongeren logo"
          width={250}
          height={250}
        />
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl md:text-6xl">
            Welcome to <span className="text-primary">Selam</span>!
          </h1>
          <p className="text-xl md:text-2xl">Sign in to continue</p>
        </div>

        <Button
          className="w-full"
          onClick={() =>
            signIn("google", {
              callbackUrl: searchParams.get("callbackUrl") ?? routes.dashboard,
            })
          }
        >
          Sign in with google
        </Button>
      </div>
    </div>
  );
};

export default Page;
