"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from ".";
import { Ban } from "lucide-react";

export const NoOrganisation = () => {
  const session = useSession();

  const handleSignOut = async () => {
    const hasConfirmed = confirm("Are you sure you want to sign out?");
    if (hasConfirmed) {
      await signOut();
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-8 p-8">
      <Ban className="text-destructive" size={80} />
      <p className="text-center">
        It looks like you are not part of an organisation{" "}
        <b>{session.data?.user.name}</b>.
      </p>
      <Button
        className="w-full md:w-auto"
        variant="destructive"
        onClick={handleSignOut}
      >
        Sign out
      </Button>
    </div>
  );
};
