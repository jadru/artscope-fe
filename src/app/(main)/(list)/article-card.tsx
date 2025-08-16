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
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleImageError = useCallback(() => {
    setIsError(true);
    setIsLoading(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setHasLoaded(true);
  }, []);

  return (
    <Link
      href={`/article/${article.id}`}
      key={article.id}
      className="group relative block w-full h-full"
    >
      {/* 모바일 디자인 - 오버레이 형태 */}
      <div className="md:hidden relative aspect-[4/5] w-full h-full rounded-xl overflow-hidden bg-gray-100">
        {!isError ? (
          <Image
            src={article.mediaUrls[0]}
            alt={article.title}
            width={300}
            height={375}
            onError={handleImageError}
            onLoad={handleImageLoad}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-white"
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
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-2 leading-tight">
                  {standardLabel(article.title)}
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  {article.categoryName}
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading && !isError && <Skeleton className="absolute inset-0" />}

        {/* 모바일 오버레이 */}
        {!isError && hasLoaded && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-white line-clamp-2 leading-tight">
                  {standardLabel(article.title)}
                </h3>

                <div className="flex items-center justify-between">
                  <span className="inline-flex text-white items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm border border-white/30">
                    {article.categoryName}
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {article.author.authorName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-white/90">
                      {standardLabel(article.author.authorName)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 데스크톱 디자인 - 오버레이 형태 */}
      <div className="hidden md:block relative aspect-[4/5] w-full h-full rounded-xl overflow-hidden bg-gray-100">
        {!isError ? (
          <Image
            src={article.mediaUrls[0]}
            alt={article.title}
            width={300}
            height={375}
            onError={handleImageError}
            onLoad={handleImageLoad}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
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
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-800 line-clamp-3 leading-tight">
                  {standardLabel(article.title)}
                </h3>
                <div className="flex items-center justify-center gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700">
                    {article.categoryName}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {article.author.authorName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {standardLabel(article.author.authorName)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && !isError && <Skeleton className="absolute inset-0" />}

        {/* 데스크톱 오버레이 */}
        {!isError && hasLoaded && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="space-y-3">
                <h3 className="text-xl font-bold line-clamp-2 leading-tight">
                  {standardLabel(article.title)}
                </h3>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm border border-white/30">
                    {article.categoryName}
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {article.author.authorName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm">
                      {standardLabel(article.author.authorName)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
