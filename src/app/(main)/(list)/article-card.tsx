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
      <div className="relative aspect-[4/5] bg-gray-50 transition-transform duration-200 ease-out group-hover:scale-[0.98] group-hover:shadow-sm overflow-hidden">
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
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
              <div className="text-xs text-gray-400">이미지 없음</div>
            </div>
          </div>
        )}

        {isLoading && !isError && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
        )}

        {/* 작품 정보 오버레이 - 정말 미니멀하게 */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="space-y-1">
              <h3 className="text-white text-sm font-light leading-tight line-clamp-2">
                {standardLabel(article.title)}
              </h3>
              <p className="text-white/80 text-xs font-light">
                {article.categoryName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
