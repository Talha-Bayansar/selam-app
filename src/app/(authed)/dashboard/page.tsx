"use client";

import { signOut, useSession } from "next-auth/react";
import React from "react";
import { Button } from "~/components";

const Page = () => {
  const session = useSession({
    required: true,
  });

  return (
    <div className="flex flex-col">
      <p>Dashboard (only for authenticated users)</p>
      <Button onClick={() => signOut()}>Sign out</Button>
    </div>
  );
};

export default Page;
