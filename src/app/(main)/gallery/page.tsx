"use client";

export const dynamic = "force-dynamic";

import { useQuery } from "@tanstack/react-query";
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
    if (Array.isArray(curations)) heroItems = curations as articleItemType[];
    else if (Array.isArray(curations?.magazines))
      heroItems = curations.magazines as articleItemType[];
    else if (Array.isArray(curations?.items))
      heroItems = curations.items as articleItemType[];
  }
  if (heroItems.length === 0) heroItems = trending.magazines;

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
    <div className="space-y-16 pb-20">
      {/* Structured Data */}
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

      {/* Hero Section */}
      <CurationHero items={heroItems} />

      {/* Main Feed */}
      <FeedTabs />

      {/* Follow Suggestions */}
      <FollowSuggestions />
    </div>
  );
}
