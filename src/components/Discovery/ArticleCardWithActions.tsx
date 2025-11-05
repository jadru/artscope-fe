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

  return (
    <div className="group">
      <div className="mb-2 flex items-center justify-between px-1.5 md:px-2">
        <Link
          href={`/profile/${article.author.authorUsername}`}
          aria-label={`${article.author.authorName} 프로필로 이동`}
          className="flex items-center gap-2 min-w-0"
        >
          <div className="relative h-7 w-7 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200/70">
            {article.author.authorProfileImage ? (
              <Image
                src={article.author.authorProfileImage}
                alt={article.author.authorName}
                fill
                sizes="28px"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="truncate">
            <span className="text-[13px] text-gray-900 font-medium truncate">
              {article.author.authorName}
            </span>
          </div>
        </Link>
        <button
          aria-label={following ? "팔로잉" : "팔로우"}
          onClick={handleFollowToggle}
          className={cn(
            "text-[11px] rounded-full px-2 py-1 transition-colors",
            following
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          {following ? "팔로잉" : "팔로우"}
        </button>
      </div>
      <Link href={`/article/${article.id}`} className="block">
        <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden rounded-xl">
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
                  <div className="h-px w-4 bg-gray-300/80 -rotate-12" />
                </div>
                <div className="text-[11px] text-gray-500 italic">
                  {article.author.authorName}
                </div>
              </div>
            </div>
          )}

          {isLoading && !isError && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
        </div>
      </Link>

      {/* 액션바 */}
      <div className="pt-2 flex items-center justify-between px-1 md:px-2">
        <div className="flex items-center gap-3">
          <button
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
            onClick={() => (isLiked ? handleUnLike() : handleLike())}
            className="flex items-center gap-1 group"
          >
            <FaHeart
              size={18}
              className={cn(
                "transition-colors duration-200",
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400 group-hover:text-red-400"
              )}
            />
            <span className="text-xs text-gray-600">{likes}</span>
          </button>
        </div>

        <button
          aria-label="공유"
          onClick={handleShare}
          className="text-gray-500 hover:text-gray-700"
          title="공유"
        >
          {shared ? (
            <Check size={18} className="text-emerald-500" />
          ) : (
            <Share2 size={18} />
          )}
        </button>
      </div>

      {/* 좋아요 수 */}
      <div className="px-1 md:px-2 mt-1 text-[13px] text-gray-900">
        좋아요 <span className="font-medium">{likes}</span>개
      </div>

      {/* 캡션: 작가명 + 제목 일부 */}
      <div className="px-1 md:px-2 mt-1 text-[13px] leading-snug">
        <Link
          href={`/profile/${article.author.authorUsername}`}
          className="font-medium text-gray-900 mr-1"
        >
          {article.author.authorName}
        </Link>
        <span className="text-gray-700 line-clamp-2 align-middle">
          {standardLabel(article.title)}
        </span>
      </div>

      {/* 카테고리 메타 */}
      <div className="px-1 md:px-2 mt-1 text-[11px] uppercase text-gray-400">
        {article.categoryName}
      </div>
    </div>
  );
}
