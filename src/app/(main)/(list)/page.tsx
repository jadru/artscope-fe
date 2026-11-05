"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import jxios from "@/utils/jxios";
import type { articleListType } from "@/types/article";

import LoadErrorState from "@/components/shared/LoadErrorState";
import HeroSection from "@/features/landing/components/HeroSection";
import FeaturedArtists from "@/features/landing/components/FeaturedArtists";
import CTASection from "@/features/landing/components/CTASection";

const PREVIEW_LIMIT = 18;

async function fetchPreviewFeeds(): Promise<articleListType> {
  const res = await jxios.get("/api/server/magazines", {
    params: { page: 0, size: PREVIEW_LIMIT },
  });
  return res.data as articleListType;
}

export default function LandingPage() {
  const { data, isError, isRefetching, refetch } = useQuery({
    queryKey: ["landing-preview"],
    queryFn: fetchPreviewFeeds,
    retry: 1,
    meta: { inlineError: true },
  });

  const magazines = useMemo(() => data?.magazines ?? [], [data]);
  const artworkCount = data?.pageInfo?.totalElements ?? magazines.length;

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
      {isError ? (
        <section className="bg-gray-50 px-4">
          <LoadErrorState
            title="작품을 불러오지 못했어요"
            onRetry={() => refetch()}
            isRetrying={isRefetching}
            className="py-12"
          />
        </section>
      ) : (
        // 데이터가 없거나 로딩 중이면 섹션 자체를 숨긴다 (FeaturedArtists는 빈 배열이면 null)
        <FeaturedArtists articles={magazines} />
      )}
      <CTASection />
    </main>
  );
}
