"use client";
import { signOut, useSession } from "next-auth/react";
import { Button, PageWrapper } from ".";

export const NoOrganisation = () => {
  const session = useSession();

  const handleSignOut = async () => {
    const hasConfirmed = confirm("Are you sure you want to sign out?");
    if (hasConfirmed) {
      await signOut();
    }
  };

  return (
    <PageWrapper className="flex flex-col gap-4 md:max-w-lg" title="Oops!">
      <p>
        It looks like you are not part of an organisation{" "}
        <b>{session.data?.user.name}</b>.
      </p>
      <Button variant="destructive" onClick={handleSignOut}>
        Sign out
      </Button>
    </PageWrapper>
  );
};
