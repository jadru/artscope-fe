"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import MarkdownViewer from "@/components/MarkdownViewer";
import { standardLabel } from "@/components/StandardLabel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { NEXT_PUBLIC_API_URL } from "@/constant/env";
import jxios from "@/utils/jxios";
import { useProfile } from "@/auth/use-profile";
import { useObserver } from "@/hooks/useObserver";

import { articleListType } from "@/types/article";
import { Button } from "@/components/ui/button";

const LIMIT = 24;

const fetchPersonalArticles = async ({
  pageParam = 0,
  username,
}: {
  pageParam?: number;
  username: string;
}) => {
  const response = await jxios.get(
    `/api/server/magazines/members/${username}`,
    {
      params: {
        page: pageParam,
        size: LIMIT,
      },
    }
  );
  return response.data as articleListType;
};

export default function Page() {
  const { data: profile } = useProfile();
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isSuccess,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["personal-articles", profile?.username],
    queryFn: ({ pageParam }) =>
      fetchPersonalArticles({ pageParam, username: profile?.username || "" }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.magazines.length < LIMIT) {
        return undefined;
      }
      return allPages.length;
    },
    enabled: !!profile?.username,
  });

  const onIntersect: IntersectionObserverCallback = ([entry]) => {
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useObserver({
    target: bottomRef,
    onIntersect,
  });

  if (!profile?.username) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 min-h-full pb-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            className="flex flex-col w-full h-full overflow-hidden border-gray-200"
          >
            {/* 이미지 스켈레톤 */}
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              <Skeleton className="w-full h-full" />
            </div>

            {/* 콘텐츠 스켈레톤 */}
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16 shrink-0" />
              </div>
            </CardHeader>

            <CardContent className="flex-1 pb-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-8 w-full" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            에러가 발생했습니다
          </h3>
          <p className="text-gray-600">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 min-h-full pb-6 p-2 md:p-4">
        {isSuccess &&
          data.pages.map((page, pageIndex) =>
            page.magazines.map((article) => (
              <Card
                className="flex group flex-col w-full h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-gray-200"
                key={article.id}
              >
                {/* 이미지 섹션 */}
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  {article.mediaUrls && article.mediaUrls.length > 0 ? (
                    <div className="relative w-full h-full">
                      {/* 메인 이미지 */}
                      <Image
                        src={article.mediaUrls[0]}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* 이미지 개수 배지 */}
                      {article.mediaUrls.length > 1 && (
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant="secondary"
                            className="bg-black/70 text-white border-0"
                          >
                            +{article.mediaUrls.length - 1}
                          </Badge>
                        </div>
                      )}
                      {/* 이미지 갤러리 미리보기 */}
                      {article.mediaUrls.length > 1 && (
                        <div className="absolute bottom-2 left-2 flex gap-1">
                          {article.mediaUrls.slice(1, 4).map((url, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded border-2 border-white overflow-hidden"
                            >
                              <Image
                                src={url}
                                alt={`${article.title} 이미지 ${index + 2}`}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ))}
                          {article.mediaUrls.length > 4 && (
                            <div className="w-8 h-8 rounded border-2 border-white bg-black/50 flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                +{article.mediaUrls.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-gray-400 text-center">
                        <svg
                          className="w-12 h-12 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm">이미지 없음</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 콘텐츠 섹션 */}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {standardLabel(article.title)}
                    </CardTitle>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {article.categoryName}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 pb-3">
                  <div className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    <MarkdownViewer ignoreImages ignoreSize>
                      {article.content}
                    </MarkdownViewer>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {standardLabel(article.author.authorName)}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(article.createdTime).toLocaleDateString(
                          "ko-KR"
                        )}
                      </span>
                    </div>

                    {/* 편집 버튼 */}
                    <div className="flex gap-2">
                      <Link href={"/article/" + article.id}>
                        <Button>보기</Button>
                      </Link>
                      <Link
                        href={`/editor/${article.id}/modify`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="outline">편집하기</Button>
                      </Link>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 min-h-full pb-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={index}
              className="flex flex-col w-full h-full overflow-hidden border-gray-200"
            >
              {/* 이미지 스켈레톤 */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <Skeleton className="w-full h-full" />
              </div>

              {/* 콘텐츠 스켈레톤 */}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-16 shrink-0" />
                </div>
              </CardHeader>

              <CardContent className="flex-1 pb-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-8 w-full" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* 무한 스크롤 감지 요소 */}
      <div ref={bottomRef} className="h-4" />

      {/* 다음 페이지 로딩 */}
      {isFetchingNextPage && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 min-h-full pb-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={index}
              className="flex flex-col w-full h-full overflow-hidden border-gray-200"
            >
              {/* 이미지 스켈레톤 */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <Skeleton className="w-full h-full" />
              </div>

              {/* 콘텐츠 스켈레톤 */}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-16 shrink-0" />
                </div>
              </CardHeader>

              <CardContent className="flex-1 pb-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-8 w-full" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* 데이터가 없을 때 */}
      {isSuccess && data.pages[0]?.magazines.length === 0 && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              작성된 글이 없습니다
            </h3>
            <p className="text-gray-600 mb-4">첫 번째 글을 작성해보세요!</p>
            <Link
              href="/editor/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              새 글 작성하기
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
