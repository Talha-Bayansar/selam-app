"use client";
import Link from "next/link";
import React from "react";
import { Button, PageWrapper } from "~/components";
import { routes } from "~/lib";
import { MembersList } from "~/members";

const Page = () => {
  return (
    <PageWrapper
      className="flex flex-grow flex-col items-start"
      title="Members"
    >
      <Button asChild className="mb-4 w-full md:w-auto">
        <Link href={`${routes.members}/create`}>New member</Link>
      </Button>
      <MembersList />
    </PageWrapper>
  );
};

export default Page;
