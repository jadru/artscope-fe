"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { FaHeart } from "react-icons/fa";
import { Share2, Check } from "lucide-react";

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

  return (
    <article className="group flex flex-col gap-3 rounded-[32px] border border-white/10 bg-white/5 p-3 shadow-[0_25px_60px_rgba(4,4,8,0.55)] backdrop-blur-xl">
      <div className="flex items-center justify-between px-1.5">
        <Link
          href={`/profile/${article.author.authorUsername}`}
          aria-label={`${article.author.authorName} 프로필로 이동`}
          className="flex min-w-0 items-center gap-2"
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/20 bg-white/10">
            {article.author.authorProfileImage ? (
              <Image
                src={article.author.authorProfileImage}
                alt={article.author.authorName}
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="truncate">
            <span className="text-sm font-medium text-white">
              {article.author.authorName}
            </span>
            <p className="text-xs text-white/60">
              @{article.author.authorUsername}
            </p>
          </div>
        </Link>
        <button
          aria-label={following ? "팔로잉" : "팔로우"}
          onClick={handleFollowToggle}
          className={cn(
            "text-[11px] rounded-full px-3 py-1 font-medium transition-colors",
            following
              ? "bg-white text-black"
              : "border border-white/20 text-white/80 hover:bg-white/10"
          )}
        >
          {following ? "팔로잉" : "팔로우"}
        </button>
      </div>

      <Link
        href={`/article/${article.id}`}
        className="block rounded-[28px] border border-white/10 bg-black/40"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
          {!isError && coverImage ? (
            <Image
              src={coverImage}
              alt={article.title}
              width={300}
              height={375}
              onError={handleImageError}
              onLoad={handleImageLoad}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-white/10 to-black/60 text-center text-white/70">
              <div
                className="mb-2 h-11 w-11 rounded-full border border-white/30 bg-white/5"
                aria-hidden="true"
              />
              <div className="text-xs uppercase tracking-[0.3em] text-white/60">
                {article.author.authorName}
              </div>
            </div>
          )}

          {isLoading && !isError && (
            <div className="absolute inset-0 animate-pulse bg-white/5" />
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
            <FaHeart
              size={14}
              className={cn(
                "transition-colors",
                isLiked ? "text-red-400 fill-red-400" : "text-white/70"
              )}
            />
            {likes}
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between px-1">
        <button
          aria-label={isLiked ? "좋아요 취소" : "좋아요"}
          onClick={() => (isLiked ? handleUnLike() : handleLike())}
          className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/80 transition hover:bg-white/10"
        >
          <FaHeart
            size={16}
            className={cn(
              "transition-colors",
              isLiked ? "text-red-400 fill-red-400" : "text-white/70"
            )}
          />
          {isLiked ? "Liked" : "Like"}
        </button>

        <button
          aria-label="공유"
          onClick={handleShare}
          className="rounded-full border border-white/20 p-2 text-white/70 transition hover:bg-white/10"
          title="공유"
        >
          {shared ? (
            <Check size={18} className="text-emerald-400" />
          ) : (
            <Share2 size={18} />
          )}
        </button>
      </div>

      <div className="px-1 text-[13px] text-white/70">
        좋아요 <span className="font-semibold text-white">{likes}</span>개
      </div>
      <div className="px-1 text-sm text-white">
        <Link
          href={`/profile/${article.author.authorUsername}`}
          className="mr-1 font-semibold text-white hover:text-white/80"
        >
          {article.author.authorName}
        </Link>
        <span className="text-white/80 line-clamp-2">
          {standardLabel(article.title)}
        </span>
      </div>
      <div className="px-1 text-[11px] uppercase tracking-[0.2em] text-white/50">
        {article.categoryName}
      </div>
    </article>
  );
}
