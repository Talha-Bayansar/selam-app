"use client";
import Link from "next/link";
import React from "react";
import {
  Button,
  ListSkeleton,
  PageWrapper,
  PaginationButton,
  NoData,
  ActionsButton,
} from "~/components";
import { reducePages, routes } from "~/lib";
import { MembersList } from "~/members";
import { type MembersRecord } from "~/server/db";
import { api } from "~/trpc/react";

const Page = () => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    api.members.getAll.useInfiniteQuery(
      {},
      {
        getNextPageParam: (currentPage) => {
          return currentPage.meta.page.cursor;
        },
      },
    );

  const members = data && reducePages(data?.pages);

  return (
    <PageWrapper
      className="flex flex-grow flex-col items-start gap-4"
      title="Members"
    >
      <ActionsButton
        actions={[
          <Button key="new-member" asChild>
            <Link href={`${routes.members}/create`}>New member</Link>
          </Button>,
        ]}
      />
      {isLoading ? (
        <ListSkeleton />
      ) : !!members ? (
        <>
          <MembersList members={members.records as MembersRecord[]} />
          <PaginationButton
            canLoadMore={members?.meta.page.more}
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          />
        </>
      ) : (
        <NoData />
      )}
    </PageWrapper>
  );
};

export default Page;
