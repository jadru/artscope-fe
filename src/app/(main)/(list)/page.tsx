"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";

import useToken from "@/hooks/useToken";

import {
  jsonLdNav,
  jsonLdOrg,
  jsonLdSearch,
  jsonLdThumb,
} from "@/app/(main)/(list)/searchSchema";
import { useUser } from "@/states";
import jxios from "@/utils/jxios";

import { articleListType } from "@/types/article";
import ArticleCard from "./article-card";

const LIMIT = 21;

const fetchFeeds = async () =>
  await jxios
    .get("/api/magazines", {
      params: {
        page: 0,
        size: LIMIT,
      },
    })
    .then((res) => res.data as articleListType);

export default function Feeds() {
  useToken();
  const { user, isLogin } = useUser();
  const { data, isLoading, refetch, isSuccess, isError } = useQuery({
    queryKey: ["main"],
    queryFn: fetchFeeds,
  });

  useEffect(() => {
    refetch();
  }, [refetch, user]);

  useEffect(() => {
    if (isError) {
      notFound();
    }
  }, [isError]);

  return (
    <div className="px-2 md:px-6 lg:px-8">
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdNav) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdThumb) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSearch) }}
        />
      </section>
      {isLoading && (
        <div className="w-full">
          <p>Loading...</p>
        </div>
      )}
      {isError && (
        <div className="w-full">
          <h3 className="my-12 text-center">에러가 발생했습니다.</h3>
        </div>
      )}
      {data && data.magazines.length === 0 && (
        <h3 className="my-12 text-center">아직 작성된 글이 없습니다.</h3>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-6 gap-1 md:gap-2">
        {isSuccess &&
          data.magazines.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
      </div>
    </div>
  );
}
