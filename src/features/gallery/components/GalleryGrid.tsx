"use client";

import React, { useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useObserver } from "@/hooks/useObserver";
import jxios from "@/utils/jxios";
import type { articleListType } from "@/types/article";

import GalleryCard from "./GalleryCard";

const LIMIT = 30;

const fetchArticles = async ({ pageParam = 0 }) => {
  const res = await jxios.get("/api/server/magazines", {
    params: { page: pageParam, size: LIMIT },
  });
  return res.data as articleListType;
};

export default function GalleryGrid() {
  const {
    data,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["gallery", "grid"],
    queryFn: fetchArticles,
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.magazines.length < LIMIT) return undefined;
      return allPages.length;
    },
  });

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const onIntersect = ([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useObserver({ target: bottomRef, onIntersect });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-5">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-square animate-pulse rounded-lg bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-gray-500">콘텐츠를 불러올 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 5-column grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 lg:gap-5">
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.magazines.map((article) => (
              <GalleryCard key={article.id} article={article} />
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={bottomRef} className="h-px" />

      {/* Loading indicator */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
