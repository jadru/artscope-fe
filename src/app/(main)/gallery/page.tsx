"use client";

export const dynamic = "force-dynamic";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import {
  jsonLdNav,
  jsonLdOrg,
  jsonLdSearch,
  jsonLdThumb,
} from "@/app/(main)/(list)/searchSchema";
import jxios from "@/utils/jxios";

import type { articleItemType, articleListType } from "@/types/article";
import CurationHero from "@/components/Discovery/CurationHero";
import nextDynamic from "next/dynamic";
const FeedTabs = nextDynamic(() => import("@/components/Discovery/FeedTabs"), {
  ssr: false,
});
const FollowSuggestions = nextDynamic(
  () => import("@/components/Discovery/FollowSuggestions"),
  { ssr: false }
);

const fetchCurations = async () => {
  try {
    const res = await jxios.get("/api/server/curations");
    return res.data;
  } catch {
    return null;
  }
};

const fetchTrendingFirstPage = async () => {
  try {
    const res = await jxios.get("/api/server/magazines", {
      params: { page: 0, size: 30 },
    });
    return res.data as articleListType;
  } catch {
    return {
      magazines: [],
      pageInfo: { page: 0, size: 30, totalPages: 0, totalElements: 0 },
    } as articleListType;
  }
};

export default function GalleryPage() {
  const { data: curations } = useQuery({
    queryKey: ["gallery", "curations"],
    queryFn: fetchCurations,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: typeof window !== "undefined",
  });
  const { data: trendingData } = useQuery({
    queryKey: ["gallery", "trending", 0],
    queryFn: fetchTrendingFirstPage,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: typeof window !== "undefined",
  });
  const trending =
    trendingData ??
    ({
      magazines: [],
      pageInfo: { page: 0, size: 30, totalPages: 0, totalElements: 0 },
    } as articleListType);

  let heroItems: articleItemType[] = [];
  if (curations) {
    // 가능한 구조들에 방어적으로 대응
    if (Array.isArray(curations)) heroItems = curations as articleItemType[];
    else if (Array.isArray(curations?.magazines))
      heroItems = curations.magazines as articleItemType[];
    else if (Array.isArray(curations?.items))
      heroItems = curations.items as articleItemType[];
  }
  if (heroItems.length === 0) heroItems = trending.magazines;

  const trendingSpotlight = trending.magazines.slice(0, 4);
  const featuredCollections = heroItems.slice(0, 3);

  const jsonLdTrendingList = {
    "@type": "ItemList",
    itemListElement: trending.magazines.slice(0, 10).map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.artscope.kr/article/${m.id}`,
      name: m.title,
    })),
  } as const;

  return (
    <div className="pb-16 space-y-10">
      <section aria-hidden="true" className="hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdNav) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdThumb) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSearch) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdTrendingList),
          }}
        />
      </section>

      <CurationHero items={heroItems} />

      {trendingSpotlight.length > 0 && (
        <section aria-label="트렌딩 아트웍" className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                Trending Now
              </p>
              <h3 className="text-2xl font-semibold text-white">
                오늘 주목해야 할 장면들
              </h3>
              <p className="text-sm text-white/60">
                다양한 장르가 섞인 시네마틱 컬렉션을 모았어요.
              </p>
            </div>
            <Link
              href="#feed"
              className="text-sm text-white/70 hover:text-white"
              aria-label="피드 섹션으로 이동"
            >
              전체 피드 보기 →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trendingSpotlight.map((article, index) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5"
              >
                <div className="relative h-56 overflow-hidden">
                  {article.mediaUrls?.[0] ? (
                    <Image
                      src={article.mediaUrls[0]}
                      alt={article.title}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/70" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-semibold text-white/80">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase text-white/60">
                    {article.categoryName}
                  </p>
                  <h4 className="mt-1 text-lg font-semibold text-white line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="mt-2 text-sm text-white/60">
                    {article.author?.authorName} · 좋아요 {article.likes ?? 0}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {featuredCollections.length > 0 && (
        <section aria-label="피처드 컬렉션" className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                Featured Collections
              </p>
              <h3 className="text-xl font-semibold text-white">
                국내 예술 · 사진 · 디지털 아트
              </h3>
              <p className="text-sm text-white/60">
                비정형 그리드로 큐레이션한 몰입형 컬렉션.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featuredCollections.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <div className="relative h-48 overflow-hidden rounded-2xl bg-black/40">
                  {article.mediaUrls?.[0] ? (
                    <Image
                      src={article.mediaUrls[0]}
                      alt={article.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/40" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4">
                    <p className="text-xs uppercase text-white/60">
                      {article.categoryName}
                    </p>
                    <p className="text-lg font-semibold text-white line-clamp-2">
                      {article.title}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-white/70">
                  <span>{article.author?.authorName}</span>
                  <span className="text-white/60">♥ {article.likes ?? 0}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <FeedTabs />

      <FollowSuggestions />
    </div>
  );
}
