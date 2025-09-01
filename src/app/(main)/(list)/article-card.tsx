import { articleListType } from "@/types/article";
import { standardLabel } from "@/components/StandardLabel";
import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

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
    <Link href={`/article/${article.id}`} className="block group">
      <div className="relative aspect-[4/5] bg-gray-50 transition-transform duration-200 ease-out md:group-hover:scale-[0.98] md:group-hover:shadow-sm overflow-hidden">
        {!isError ? (
          <Image
            src={article.mediaUrls[0]}
            alt={article.title}
            width={300}
            height={375}
            onError={handleImageError}
            onLoad={handleImageLoad}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
            <div
              className="text-center"
              aria-label="이미지가 없어 작가 시그니처를 표시합니다"
            >
              <div className="h-10 w-10 rounded-full ring-1 ring-gray-300/60 bg-white/40 mx-auto mb-2 flex items-center justify-center">
                <div className="h-px w-4 bg-gray-300/80 -rotate-12"></div>
              </div>
              <div className="text-[11px] text-gray-500 italic">
                {article.author.authorName}
              </div>
            </div>
          </div>
        )}

        {isLoading && !isError && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
        )}

        {/* 작품 정보 오버레이 - 모바일에서는 숨기고 데스크톱에서만 hover로 표시 */}
        <div className="hidden md:block absolute inset-0 bg-black/10 opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="space-y-1">
              <h3 className="text-white text-sm font-light leading-tight line-clamp-2">
                {standardLabel(article.title)}
              </h3>
              <p className="text-white/80 text-xs font-light">
                {article.author.authorName} ·{" "}
                <span className="uppercase">{article.categoryName}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* 모바일 최소 메타 정보 표시 */}
      <div className="md:hidden mt-2">
        <div className="space-y-1">
          <h3 className="text-gray-900 text-sm font-medium leading-snug line-clamp-2">
            {standardLabel(article.title)}
          </h3>
          <p className="text-gray-500 text-xs">
            {article.author.authorName} ·{" "}
            <span className="uppercase">{article.categoryName}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
