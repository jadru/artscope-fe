"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import jxios from "@/utils/jxios";
import { useState } from "react";
import { useProfile } from "@/auth/use-profile";
import type { articleListType, AuthorType } from "@/types/article";

const LIMIT = 30;

async function fetchTrendingFirstPage() {
  const res = await jxios.get("/api/server/magazines", {
    params: { page: 0, size: LIMIT },
  });
  return res.data as articleListType;
}

type Suggestion = {
  author: AuthorType;
  count: number;
};

export default function FollowSuggestions() {
  const { data } = useQuery({
    queryKey: ["gallery", "trending", 0],
    queryFn: fetchTrendingFirstPage,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const magazines = data?.magazines ?? [];
  if (magazines.length === 0) return null;

  const counts = new Map<string, Suggestion>();
  magazines.forEach((m) => {
    const key = m.author.authorUsername;
    const prev = counts.get(key);
    if (prev) counts.set(key, { author: prev.author, count: prev.count + 1 });
    else counts.set(key, { author: m.author, count: 1 });
  });

  const suggestions = Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  if (suggestions.length === 0) return null;

  return (
    <section
      className="mt-12 rounded-[32px] border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] p-5 shadow-lg shadow-black/5 dark:shadow-white/5 md:p-7"
      aria-label="팔로우 제안"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500 dark:text-white/60">
            더 깊은 연결
          </p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            관심 있을 만한 작가
          </h3>
          <p className="text-sm text-gray-600 dark:text-white/60">
            꾸준히 트렌딩 피드에 등장한 작가들을 소개합니다.
          </p>
        </div>
        <Link
          href="/gallery"
          className="self-start rounded-full border border-[color:var(--panel-border)] px-4 py-2 text-sm text-gray-700 hover:bg-[color:var(--panel-muted)] dark:text-white/70 dark:hover:bg-white/10"
        >
          전체 작가 보기
        </Link>
      </div>
      <div className="mt-5 flex gap-4 overflow-x-auto pb-2 pr-2 no-scrollbar">
        {suggestions.map((s) => (
          <SuggestionCard
            key={s.author.authorUsername}
            author={s.author}
            count={s.count}
          />
        ))}
      </div>
    </section>
  );
}

function SuggestionCard({
  author,
  count,
}: {
  author: AuthorType;
  count: number;
}) {
  const router = useRouter();
  const { data: user } = useProfile();
  const [following, setFollowing] = useState(false);

  const ensureLogin = () => {
    if (!user) {
      router.push("/user/login");
      return false;
    }
    return true;
  };

  const toggle = () => {
    if (!ensureLogin()) return;
    const next = !following;
    setFollowing(next);
    jxios
      .post(`/api/server/follow`, { username: author.authorUsername })
      .catch(() => setFollowing(!next));
  };

  return (
    <div className="flex w-56 flex-shrink-0 flex-col rounded-3xl border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] p-4 shadow-sm dark:shadow-white/5">
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[color:var(--panel-border)] bg-[color:var(--panel-muted)]">
          {author.authorProfileImage ? (
            <Image
              src={author.authorProfileImage}
              alt={author.authorName}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {author.authorName}
          </div>
          <div className="truncate text-xs text-gray-500 dark:text-white/60">
            @{author.authorUsername}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-white/70">
        트렌딩 노출 {count}회
      </p>
      <button
        onClick={toggle}
        className={`mt-4 w-full rounded-full px-4 py-2 text-sm font-medium transition ${
          following
            ? "bg-gray-900 text-white hover:bg-black dark:bg-white dark:text-black"
            : "border border-[color:var(--panel-border)] text-gray-700 hover:bg-[color:var(--panel-muted)] dark:text-white dark:hover:bg-white/10"
        }`}
        aria-label={following ? "팔로잉" : "팔로우"}
      >
        {following ? "팔로잉" : "팔로우"}
      </button>
    </div>
  );
}
