"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ASNextImage from "@/components/shared/ASNextImage";
import jxios from "@/utils/jxios";
import { useProfile } from "@/auth/use-profile";
import { cn } from "@/utils";
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
    <section className="space-y-6" aria-label="Suggested artists">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
            Artists to Follow
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Trending creators this week
          </p>
        </div>
      </div>

      {/* Horizontal Scroll */}
      <div className="-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {suggestions.map((s) => (
            <SuggestionCard
              key={s.author.authorUsername}
              author={s.author}
              count={s.count}
            />
          ))}
        </div>
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
    <div className="group flex w-48 flex-shrink-0 flex-col items-center rounded-2xl bg-neutral-50 p-5 transition-colors hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800/80">
      {/* Avatar */}
      <Link
        href={`/profile/${author.authorUsername}`}
        className="relative mb-3 h-16 w-16 overflow-hidden rounded-full bg-neutral-200 ring-2 ring-white dark:bg-neutral-800 dark:ring-neutral-900"
      >
        {author.authorProfileImage ? (
          <ASNextImage
            src={author.authorProfileImage}
            alt={author.authorName}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-medium text-neutral-400">
            {author.authorName?.charAt(0).toUpperCase()}
          </div>
        )}
      </Link>

      {/* Info */}
      <Link
        href={`/profile/${author.authorUsername}`}
        className="mb-1 text-center"
      >
        <p className="text-sm font-medium text-neutral-900 dark:text-white">
          {author.authorName}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {count} trending {count === 1 ? "work" : "works"}
        </p>
      </Link>

      {/* Follow Button */}
      <button
        onClick={toggle}
        className={cn(
          "mt-3 w-full rounded-full py-2 text-xs font-medium transition-all",
          following
            ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
            : "bg-neutral-900/5 text-neutral-700 hover:bg-neutral-900/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
        )}
        aria-label={following ? "Following" : "Follow"}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
}
