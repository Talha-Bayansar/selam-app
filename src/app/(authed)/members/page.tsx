"use client";
import React from "react";
import { PageWrapper } from "~/components";
import { MembersList } from "~/members";

const Page = () => {
  return (
    <PageWrapper
      className="flex flex-grow flex-col items-start"
      title="Members"
    >
      <MembersList />
    </PageWrapper>
  );
};

export default Page;
