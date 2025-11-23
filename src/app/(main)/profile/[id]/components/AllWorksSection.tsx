"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import jxios from "@/utils/jxios";
import { articleListType } from "@/types/article";
import ProjectCard from "./ProjectCard";
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

export default function AllWorksSection({ username }: { username: string }) {
  const searchParams = useSearchParams();
  const { data: user } = useProfile();
  const pageParams = searchParams.get("page") || 0;
  const [page, setPage] = useState(Number(pageParams));
  const { data, isLoading, refetch, isSuccess, isError } = useQuery({
    queryKey: ["articleList", username, page],
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
    <section id="all-works" className="py-16 md:py-20 lg:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mb-4">
            All Works
          </h2>
          <div className="w-24 h-px bg-gray-900 dark:bg-gray-100" />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20">
            <h3 className="text-gray-600 dark:text-gray-400 font-light">
              에러가 발생했습니다.
            </h3>
          </div>
        )}

        {/* Empty State */}
        {data && data.magazines.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-gray-600 dark:text-gray-400 font-light">
              아직 작성된 작품이 없습니다.
            </h3>
          </div>
        )}

        {/* Works Grid */}
        {isSuccess && data && data.magazines.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
              {data.magazines.map((article) => (
                <ProjectCard key={article.id} project={article} />
              ))}
            </div>

            {/* Pagination */}
            {data.pageInfo.totalPages > 1 && (
              <div className="flex items-center justify-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  {data.pageInfo.page > 0 && (
                    <button
                      onClick={() => setPage(data.pageInfo.page - 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                      aria-label="Previous page"
                    >
                      <svg
                        className="w-5 h-5"
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

                  {/* Page Numbers */}
                  {Array.from(
                    { length: Math.min(5, data.pageInfo.totalPages) },
                    (_, i) => {
                      const pageNum = Math.max(0, data.pageInfo.page - 2) + i;
                      if (pageNum >= data.pageInfo.totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-full font-light text-sm transition-all duration-200 ${
                            pageNum === data.pageInfo.page
                              ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                          aria-label={`Page ${pageNum + 1}`}
                          aria-current={
                            pageNum === data.pageInfo.page ? "page" : undefined
                          }
                        >
                          {pageNum + 1}
                        </button>
                      );
                    }
                  )}

                  {data.pageInfo.page < data.pageInfo.totalPages - 1 && (
                    <button
                      onClick={() => setPage(data.pageInfo.page + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                      aria-label="Next page"
                    >
                      <svg
                        className="w-5 h-5"
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
    </section>
  );
}

