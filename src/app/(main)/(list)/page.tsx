"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import jxios from "@/utils/jxios";
import type { articleListType } from "@/types/article";

import HeroSection from "@/features/landing/components/HeroSection";
import FeaturedArtists from "@/features/landing/components/FeaturedArtists";
import CTASection from "@/features/landing/components/CTASection";

const PREVIEW_LIMIT = 18;

async function fetchPreviewFeeds(): Promise<articleListType> {
  try {
    const res = await jxios.get("/api/server/magazines", {
      params: { page: 0, size: PREVIEW_LIMIT },
    });
    return res.data as articleListType;
  } catch {
    return {
      magazines: [],
      pageInfo: {
        page: 0,
        size: PREVIEW_LIMIT,
        totalPages: 0,
        totalElements: 0,
      },
    } as articleListType;
  }
}

export default function LandingPage() {
  const { data } = useSuspenseQuery({
    queryKey: ["landing-preview"],
    queryFn: fetchPreviewFeeds,
  });

  const magazines = data.magazines ?? [];
  const artworkCount = data.pageInfo?.totalElements ?? magazines.length;

  const artistCount = useMemo(() => {
    const set = new Set<string>();
    magazines.forEach((article) => {
      if (article.author?.authorUsername) {
        set.add(article.author.authorUsername);
      }
    });
    return set.size;
  }, [magazines]);

  return (
    <main>
      <HeroSection artistCount={artistCount} artworkCount={artworkCount} />
      <FeaturedArtists articles={magazines} />
      <CTASection />
    </main>
  );
}
