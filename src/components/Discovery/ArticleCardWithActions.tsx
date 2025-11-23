"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Share2, Check } from "lucide-react";

import jxios from "@/utils/jxios";
import type { articleItemType } from "@/types/article";
import { standardLabel } from "@/components/StandardLabel";
import { useProfile } from "@/auth/use-profile";
import { cn } from "@/utils";
import { shortTimeCalculatorKO } from "@/utils/timeCalculator";

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
  const [following, setFollowing] = useState(false);
  const [shared, setShared] = useState(false);

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

  const handleLike = () => {
    if (!ensureLogin()) return;
    setIsLiked(true);
    setLikes((prev) => prev + 1);
    jxios
      .post(`/api/server/magazines/${article.id}/like`)
      .then((response) => {
        if (
          response.status === 200 &&
          typeof response.data?.likes === "number"
        ) {
          setLikes(response.data.likes);
        }
      })
      .catch(() => {
        setIsLiked(false);
        setLikes((prev) => (prev - 1 < 0 ? 0 : prev - 1));
      });
  };

  const handleUnLike = () => {
    if (!ensureLogin()) return;
    setIsLiked(false);
    setLikes((prev) => (prev - 1 < 0 ? 0 : prev - 1));
    jxios
      .post(`/api/server/magazines/${article.id}/unlike`)
      .then((response) => {
        if (
          response.status === 200 &&
          typeof response.data?.likes === "number"
        ) {
          setLikes(response.data.likes);
        }
      })
      .catch(() => {
        setIsLiked(true);
        setLikes((prev) => prev + 1);
      });
  };

  const handleFollowToggle = () => {
    if (!ensureLogin()) return;
    const next = !following;
    setFollowing(next);
    jxios
      .post(`/api/server/follow`, { username: article.author.authorUsername })
      .catch(() => {
        setFollowing(!next);
      });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/article/${article.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ url, title: standardLabel(article.title) });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setShared(true);
      setTimeout(() => setShared(false), 1500);
    } catch {
      // ignore
    }
  };

  const coverImage = article.mediaUrls?.[0];
  const contentType =
    article.categoryName === "ARTWORK" || article.categoryName === "작품"
      ? "ARTWORK"
      : "POST";
  const relativeTime = shortTimeCalculatorKO(new Date(article.createdTime));

  return (
    <article className="group flex cursor-pointer flex-col gap-2.5 rounded-2xl border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] p-2.5 text-[color:var(--foreground)] shadow-sm transition-all hover:shadow-xl hover:-translate-y-0.5 dark:shadow-black/20 dark:hover:shadow-black/40">
      {/* 상단 프로필 영역 */}
      <div className="flex items-center justify-between gap-2 px-1">
        <Link
          href={`/profile/${article.author.authorUsername}`}
          aria-label={`${article.author.authorName} 프로필로 이동`}
          className="group/profile flex min-w-0 flex-1 items-center gap-2.5 rounded-lg py-1 transition-colors hover:bg-[color:var(--panel-muted)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-[color:var(--panel-border)] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/10 dark:to-white/5">
            {article.author.authorProfileImage ? (
              <Image
                src={article.author.authorProfileImage}
                alt={article.author.authorName}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-white/40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {article.author.authorName}
            </div>
            <div className="truncate text-xs text-gray-500 dark:text-white/50">
              @{article.author.authorUsername}
            </div>
          </div>
        </Link>
        <button
          aria-label={following ? "팔로잉" : "팔로우"}
          onClick={(e) => {
            e.stopPropagation();
            handleFollowToggle();
          }}
          className={cn(
            "flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all",
            following
              ? "bg-gray-900/5 text-gray-700 hover:bg-gray-900/10 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15"
              : "border border-[color:var(--panel-border)] text-gray-600 hover:border-gray-900 hover:text-gray-900 dark:border-white/20 dark:text-white/70 dark:hover:border-white/40 dark:hover:text-white"
          )}
          aria-pressed={following}
        >
          {following ? "팔로잉" : "팔로우"}
        </button>
      </div>

      {/* 메인 작품 이미지 */}
      <Link
        href={`/article/${article.id}`}
        className="group/image relative block"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[color:var(--panel-border)] bg-[color:var(--panel-muted)]">
          {!isError && coverImage ? (
            <Image
              src={coverImage}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={handleImageError}
              onLoad={handleImageLoad}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/image:scale-[1.01]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-center dark:from-white/5 dark:to-black/40">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-[color:var(--panel-border)] bg-white/80 dark:bg-white/10">
                <svg
                  className="h-8 w-8 text-gray-400 dark:text-white/40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.27002 6.96L12 12.01L20.73 6.96"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 22.08V12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-white/50">
                {article.author.authorName}
              </div>
            </div>
          )}

          {isLoading && !isError && (
            <div className="absolute inset-0 animate-pulse bg-white/20 dark:bg-white/5" />
          )}

          {/* 좋아요/공유 액션 아이콘 */}
          <div className="absolute right-2.5 top-2.5 flex gap-1.5">
            <button
              aria-label={isLiked ? "좋아요 취소" : "좋아요"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isLiked) {
                  handleUnLike();
                } else {
                  handleLike();
                }
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white hover:scale-110 dark:bg-black/70 dark:hover:bg-black/90"
              aria-pressed={isLiked}
            >
              {isLiked ? (
                <FaHeart size={14} className="text-red-500" />
              ) : (
                <FaRegHeart
                  size={14}
                  className="text-gray-700 dark:text-white/80"
                />
              )}
            </button>
            <button
              aria-label="공유"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleShare();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white hover:scale-110 dark:bg-black/70 dark:hover:bg-black/90"
              title="공유"
            >
              {shared ? (
                <Check size={14} className="text-emerald-500" />
              ) : (
                <Share2
                  size={14}
                  className="text-gray-700 dark:text-white/80"
                />
              )}
            </button>
          </div>

          {/* 좋아요 카운트 배지 */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <FaHeart size={11} className="text-white/80" />
            {likes}
          </div>

          {/* 이미지 hover 효과 */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover/image:opacity-100" />
        </div>
      </Link>

      {/* 하단 메타 영역 */}
      <div className="flex flex-col gap-1.5 px-1">
        <div className="text-[13px] text-gray-600 dark:text-white/60">
          좋아요{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {likes}
          </span>
          개
        </div>
        <Link
          href={`/article/${article.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-sm font-semibold leading-snug text-gray-900 transition-colors hover:text-gray-700 dark:text-white dark:hover:text-white/80 line-clamp-2"
        >
          {standardLabel(article.title)}
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/50">
          <span className="font-medium uppercase tracking-wider">
            {contentType}
          </span>
          <span className="text-gray-400 dark:text-white/30">·</span>
          <span>{relativeTime}</span>
        </div>
      </div>
    </article>
  );
}
