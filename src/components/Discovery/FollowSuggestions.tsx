"use client";

import Image from "next/image";
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
    <section className="mt-8 md:mt-12" aria-label="팔로우 제안">
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        관심 있을 만한 작가
      </h3>
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-1 pr-2">
        {suggestions.map((s) => (
          <SuggestionCard key={s.author.authorUsername} author={s.author} />
        ))}
      </div>
    </section>
  );
}

function SuggestionCard({ author }: { author: AuthorType }) {
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
    <div className="flex-shrink-0 w-48 rounded-xl border border-gray-200 p-3 bg-white">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
          {author.authorProfileImage ? (
            <Image
              src={author.authorProfileImage}
              alt={author.authorName}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="text-sm text-gray-900 truncate">
            {author.authorName}
          </div>
          <div className="text-xs text-gray-500 truncate">
            @{author.authorUsername}
          </div>
        </div>
      </div>
      <button
        onClick={toggle}
        className={`mt-3 w-full text-xs rounded-full px-3 py-1 transition-colors ${
          following
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        aria-label={following ? "팔로잉" : "팔로우"}
      >
        {following ? "팔로잉" : "팔로우"}
      </button>
    </div>
  );
}
