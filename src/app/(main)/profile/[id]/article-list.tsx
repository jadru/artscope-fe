"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import jxios from "@/utils/jxios";

import { articleListType } from "@/types/article";
import ArticleCard from "@/app/(main)/(list)/article-card";
import { useProfile } from "@/auth/use-profile";

const LIMIT = 16;

const fetchFeeds = async (page: number, username: string) =>
  await jxios
    .get("/api/server/magazines/members/" + username, {
      params: {
        page: page,
        size: LIMIT,
      },
    })
    .then((res) => res.data as articleListType);

export default function MembersArticleList({ username }: { username: string }) {
  const searchParams = useSearchParams();
  const { data: user } = useProfile();
  const pageParams = searchParams.get("page") || 0;
  const [page, setPage] = useState(Number(pageParams));
  const { data, isLoading, refetch, isSuccess, isError } = useQuery({
    queryKey: ["articleList"],
    queryFn: () => fetchFeeds(page, username),
  });

  useEffect(() => {
    refetch();
  }, [refetch, user, page]);

  useEffect(() => {
    if (isError) {
      notFound();
    }
  }, [isError]);

  return (
    <div>
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
      {isSuccess && (
        <>
          {/* 작품 그리드 */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.magazines.map((article) => (
              <div key={article.id}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {data && data.pageInfo.totalPages > 1 && (
            <div className="flex items-center justify-center mt-16 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-1">
                {data.pageInfo.page > 0 && (
                  <button
                    onClick={() => setPage(data.pageInfo.page - 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}

                {/* 페이지 번호들 */}
                {Array.from(
                  { length: Math.min(5, data.pageInfo.totalPages) },
                  (_, i) => {
                    const pageNum = Math.max(0, data.pageInfo.page - 2) + i;
                    if (pageNum >= data.pageInfo.totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded font-medium text-sm transition-colors duration-200 ${
                          pageNum === data.pageInfo.page
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  }
                )}

                {data.pageInfo.page < data.pageInfo.totalPages - 1 && (
                  <button
                    onClick={() => setPage(data.pageInfo.page + 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
