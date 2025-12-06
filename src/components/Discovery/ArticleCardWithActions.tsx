"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Heart } from "lucide-react";

import jxios from "@/utils/jxios";
import type { articleItemType } from "@/types/article";
import { standardLabel } from "@/components/StandardLabel";
import { useProfile } from "@/auth/use-profile";
import { cn } from "@/utils";

export default function ArticleCardWithActions({
  article,
}: {
  article: articleItemType;
}) {
  const router = useRouter();
  const { data: user } = useProfile();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(article.likes ?? 0);

  const handleImageError = useCallback(() => {
    setIsError(true);
    setIsLoading(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const ensureLogin = () => {
    if (!user) {
      router.push("/user/login");
      return false;
    }
    return true;
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!ensureLogin()) return;

    if (isLiked) {
      setIsLiked(false);
      setLikes((prev) => Math.max(0, prev - 1));
      jxios
        .post(`/api/server/magazines/${article.id}/unlike`)
        .then((response) => {
          if (response.status === 200 && typeof response.data?.likes === "number") {
            setLikes(response.data.likes);
          }
        })
        .catch(() => {
          setIsLiked(true);
          setLikes((prev) => prev + 1);
        });
    } else {
      setIsLiked(true);
      setLikes((prev) => prev + 1);
      jxios
        .post(`/api/server/magazines/${article.id}/like`)
        .then((response) => {
          if (response.status === 200 && typeof response.data?.likes === "number") {
            setLikes(response.data.likes);
          }
        })
        .catch(() => {
          setIsLiked(false);
          setLikes((prev) => Math.max(0, prev - 1));
        });
    }
  };

  const coverImage = article.mediaUrls?.[0];
  const title = standardLabel(article.title);

  return (
    <article className="group">
      {/* Image Container */}
      <Link
        href={`/article/${article.id}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900"
      >
        {!isError && coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={handleImageError}
            onLoad={handleImageLoad}
            className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
              {article.author.authorName}
            </span>
          </div>
        )}

        {isLoading && !isError && (
          <div className="absolute inset-0 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
        )}

        {/* Hover Overlay with Like Button */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <button
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          onClick={handleLike}
          className={cn(
            "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300",
            "bg-white/0 backdrop-blur-sm",
            "opacity-0 group-hover:opacity-100",
            "hover:scale-110",
            isLiked
              ? "bg-white/95 dark:bg-black/80"
              : "bg-white/90 dark:bg-black/70"
          )}
          aria-pressed={isLiked}
        >
          <Heart
            size={16}
            className={cn(
              "transition-colors",
              isLiked
                ? "fill-red-500 text-red-500"
                : "text-neutral-700 dark:text-white"
            )}
          />
        </button>
      </Link>

      {/* Content */}
      <div className="mt-3 space-y-1">
        {/* Author Row */}
        <Link
          href={`/profile/${article.author.authorUsername}`}
          className="group/author flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            {article.author.authorProfileImage ? (
              <Image
                src={article.author.authorProfileImage}
                alt={article.author.authorName}
                fill
                sizes="24px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-neutral-500">
                {article.author.authorName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-sm text-neutral-600 transition-colors group-hover/author:text-neutral-900 dark:text-neutral-400 dark:group-hover/author:text-white">
            {article.author.authorName}
          </span>
        </Link>

        {/* Title */}
        <Link href={`/article/${article.id}`}>
          <h3 className="text-[15px] font-medium leading-snug text-neutral-900 dark:text-white line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Likes - Subtle */}
        {likes > 0 && (
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            {likes.toLocaleString()} likes
          </p>
        )}
      </div>
    </article>
  );
}
