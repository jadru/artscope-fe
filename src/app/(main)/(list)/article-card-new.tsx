import { standardLabel } from "@/components/StandardLabel";
import { articleListType } from "@/types/article";
import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleCard({
  article,
}: {
  article: articleListType["magazines"][number];
}) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = useCallback(() => {
    setIsError(true);
    setIsLoading(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <Link
      href={`/article/${article.id}`}
      className="group relative block w-full h-full"
    >
      {/* 심플한 작품 이미지 표시 - 프로필 페이지에 최적화 */}
      <div className="relative aspect-[4/5] w-full h-full overflow-hidden bg-gray-100 rounded-xl">
        {!isError ? (
          <Image
            src={article.mediaUrls[0]}
            alt={article.title}
            width={300}
            height={375}
            onError={handleImageError}
            onLoad={handleImageLoad}
            className="object-cover w-full h-full transition-all duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-gray-700 line-clamp-2 leading-tight">
                  {standardLabel(article.title)}
                </h3>
                <p className="text-xs text-gray-500">{article.categoryName}</p>
              </div>
            </div>
          </div>
        )}

        {isLoading && !isError && (
          <Skeleton className="absolute inset-0 rounded-xl" />
        )}
      </div>
    </Link>
  );
}
