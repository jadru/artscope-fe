"use client";

import {
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import React, { useEffect, useRef } from "react";

import { useObserver } from "@/hooks/useObserver";

import {
  jsonLdNav,
  jsonLdOrg,
  jsonLdSearch,
  jsonLdThumb,
} from "@/app/(main)/(list)/searchSchema";
import jxios from "@/utils/jxios";

import { articleListType } from "@/types/article";
import ArticleCard from "@/app/(main)/(list)/article-card";
import { Loader2 } from "lucide-react";

const LIMIT = 30;

const fetchFeeds = async ({ pageParam = 0 }) => {
  try {
    const res = await jxios.get("/api/server/magazines", {
      params: {
        page: pageParam,
        size: LIMIT,
      },
    });
    return res.data as articleListType;
  } catch {
    // 빌드 시에는 빈 데이터를 반환
    return {
      magazines: [],
      pageInfo: {
        page: pageParam,
        size: LIMIT,
        totalPages: 0,
        totalElements: 0,
      },
    } as articleListType;
  }
};

export default function GalleryPage() {
  const {
    data,
    isSuccess,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ["gallery"],
    queryFn: fetchFeeds,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.magazines.length < LIMIT) {
        return undefined;
      }
      return allPages.length;
    },
  });

  useEffect(() => {
    if (isError) {
      notFound();
    }
  }, [isError]);

  const bottomRef = useRef(null);

  const onIntersect: IntersectionObserverCallback = ([entry]) => {
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useObserver({
    target: bottomRef,
    onIntersect,
  });

  return (
    <div className="p-2 md:p-4 pb-16">
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
      {isError && (
        <div className="w-full">
          <h3 className="my-12 text-center">에러가 발생했습니다.</h3>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-6 gap-2">
        {isSuccess &&
          data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.magazines.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </React.Fragment>
          ))}
      </div>
      <div ref={bottomRef} />
      {isFetchingNextPage && (
        <div className="w-full py-32 flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
    </div>
  );
}


