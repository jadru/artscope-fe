"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

import ASNextImage from "@/components/shared/ASNextImage";
import type { articleItemType } from "@/types/article";
import { standardLabel } from "@/components/shared/StandardLabel";
import { useLike } from "@/hooks/useLike";

interface GalleryCardProps {
  article: articleItemType;
}

export default function GalleryCard({ article }: GalleryCardProps) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 좋아요 훅 사용
  const { isLiked, likes, toggleLike } = useLike({
    articleId: article.id,
    initialLikes: article.likes ?? 0,
    initialIsLiked: article.isLiked ?? false,
  });

  const handleImageError = useCallback(() => {
    setIsError(true);
    setIsLoading(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <Link href={`/article/${article.id}`} className="group block">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        {!isError && article.mediaUrls?.[0] ? (
          <ASNextImage
            src={article.mediaUrls[0]}
            alt={article.title}
            fill
            onError={handleImageError}
            onLoad={handleImageLoad}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            {article.author?.authorName || "이미지"}
          </div>
        )}

        {isLoading && !isError && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
      </div>

      {/* Info */}
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-gray-900">
            {standardLabel(article.title)}
          </h3>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            {article.author?.authorName}
          </p>
        </div>

        {/* Like Button */}
        <button
          type="button"
          onClick={toggleLike}
          className="flex shrink-0 items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
          aria-label={isLiked ? "좋아요 취소" : "좋아요"}
        >
          <Heart
            className={`h-3.5 w-3.5 ${
              isLiked ? "fill-red-500 text-red-500" : ""
            }`}
          />
          <span className={isLiked ? "text-red-500" : ""}>
            {likes}
          </span>
        </button>
      </div>
    </Link>
  );
}
