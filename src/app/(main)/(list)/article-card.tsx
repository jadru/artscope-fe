import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

import { articleListType } from "@/types/article";
import { standardLabel } from "@/components/shared/StandardLabel";

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

  const uploadType = article.categorySlug?.toLowerCase().includes("post")
    ? "POST"
    : "ARTWORK";
  const timeAgo = article.createdTime
    ? formatDistanceToNow(new Date(article.createdTime), {
        addSuffix: true,
        locale: ko,
      })
    : undefined;

  return (
    <Link
      href={`/article/${article.id}`}
      className="group relative block overflow-hidden rounded-[28px] border border-neutral-200 bg-white/70 shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
    >
      <div className="relative aspect-square sm:aspect-[4/5]">
        {!isError && article.mediaUrls?.[0] ? (
          <Image
            src={article.mediaUrls[0]}
            alt={article.title}
            fill
            onError={handleImageError}
            onLoad={handleImageLoad}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(min-width: 1280px) 180px, 45vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-neutral-200 text-sm text-neutral-500">
            {article.author.authorName}
          </div>
        )}

        {isLoading && !isError && (
          <div className="absolute inset-0 animate-pulse bg-neutral-100" />
        )}

        <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
          <div className="flex items-center justify-between px-3 pt-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
            <span>{uploadType}</span>
            {timeAgo && <span className="tracking-normal text-white/70">{timeAgo}</span>}
          </div>
          <div className="px-3 pb-3 text-white">
            <p className="text-xs text-white/70">{article.author.authorName}</p>
            <p className="text-sm font-semibold leading-snug line-clamp-2">
              {standardLabel(article.title)}
            </p>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
              {article.categoryName}
            </p>
          </div>
        </div>
      </div>
      <div className="block px-3 py-3 text-left text-xs text-neutral-600 md:hidden">
        <p className="font-medium text-neutral-900 line-clamp-2">
          {standardLabel(article.title)}
        </p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-neutral-500">
          {article.author.authorName}
        </p>
      </div>
    </Link>
  );
}
