"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";

import useToken from "@/hooks/useToken";

import ArticleSection from "@/app/(main)/(list)/ArticleSection";
import {
  jsonLdNav,
  jsonLdOrg,
  jsonLdSearch,
  jsonLdThumb,
} from "@/app/(main)/(list)/searchSchema";
import { useUser } from "@/states";
import chunkArray from "@/utils/chunkArray";
import Image from "next/image";
import jxios from "@/utils/jxios";

import { articleListType } from "@/types/article";
import { standardLabel } from "@/components/StandardLabel";

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
    <div className="px-4 md:px-6 lg:px-8">
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
      <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-6 gap-2">
        {isSuccess &&
          data.magazines.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
      </div>
      <Link
        href="/articles"
        className="text-center block text-5xl py-8 w-full font-bold text-[#1A1A1A] hover:underline underline-offset-4 decoration-[10px] decoration-[#FFD07B]"
      >
        READ MORE
      </Link>
    </div>
  );
}

const ArticleCard = ({
  article,
}: {
  article: articleListType["magazines"][number];
}) => {
  const [isError, setIsError] = useState(false);
  return (
    <Link
      href={`/article/${article.id}`}
      key={article.id}
      className="relative flex flex-col items-center justify-center aspect-square size-full rounded-lg overflow-hidden border-2 border-gray-100"
    >
      <Image
        src={article.mediaUrls[0]}
        alt={article.title}
        width={240}
        height={240}
        onError={(e) => {
          e.currentTarget.src = "/images/default-image.png";
          setIsError(true);
        }}
        className="object-cover absolute inset-0 size-full"
      />
      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 p-3">
          <h3 className="text-3xl font-bold text-left break-keep text-gray-500">
            {standardLabel(article.title)}
          </h3>
        </div>
      )}
      <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 absolute inset-0 flex flex-col items-center justify-center bg-black/50">
        <h3 className="text-sm font-bold text-center text-white">
          {standardLabel(article.title)}
        </h3>
        <p className="text-sm text-center text-gray-300">
          by {standardLabel(article.author.authorName)}
        </p>
      </div>
    </Link>
  );
};
