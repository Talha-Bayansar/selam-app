"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { Button, PageWrapper } from "~/components";

const Page = () => {
  const session = useSession();

  const handleSignOut = async () => {
    const hasConfirmed = confirm("Are you sure you want to sign out?");
    if (hasConfirmed) {
      await signOut();
    }
  };

  return (
    <PageWrapper className="flex flex-col gap-4 md:max-w-lg" title="Settings">
      <h2 className="text-xl">{session.data?.user.name}</h2>
      <Button onClick={handleSignOut} variant="destructive">
        Sign out
      </Button>
    </PageWrapper>
  );
};

export default Page;
