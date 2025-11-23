"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  MonitorSmartphone,
  Image as ImageIcon,
  Link2,
  BadgeCheck,
} from "lucide-react";

import {
  jsonLdNav,
  jsonLdOrg,
  jsonLdSearch,
  jsonLdThumb,
} from "@/app/(main)/(list)/searchSchema";
import jxios from "@/utils/jxios";

import type { articleItemType, articleListType } from "@/types/article";
import ArticleCard from "./article-card";

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
  const heroItems = magazines.slice(0, 8);
  const quickCards = magazines.slice(0, 3);
  const communityItems = magazines.slice(0, PREVIEW_LIMIT);
  const samplePortfolio = magazines[0];

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
  const showStats = artistCount > 0 && artworkCount > 0;

  return (
    <main className="pb-20 space-y-20">
      <HeroSection items={heroItems} />

      {showStats && (
        <StatsBar artistCount={artistCount} artworkCount={artworkCount} />
      )}

      <PortfolioShowcase sample={samplePortfolio} />

      <CommunityPreview articles={communityItems} />

      <QuickStartShowcase items={quickCards} />

      <BottomCTA />
    </main>
  );
}

function HeroSection({ items }: { items: articleItemType[] }) {
  return (
    <section className="relative px-4 pt-16 pb-12 md:px-6 md:pt-24">
      <div className="absolute inset-0" />
      <div className="mx-auto flex min-h-[80vh] md:min-h-[30vh] max-w-6xl flex-col justify-center gap-12 lg:grid lg:grid-cols-[1.05fr_minmax(0,0.95fr)]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400"
          >
            Artscope Gallery
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-4 text-3xl leading-tight text-neutral-900 dark:text-white md:text-5xl"
          >
            작품을 가장 아름답게 기록하는 아카이브 커뮤니티
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-5 max-w-2xl text-base text-neutral-600 dark:text-neutral-300 md:text-lg"
          >
            깊은 여백과 감성을 담은 포트폴리오, 작품 중심으로 정돈된 커뮤니티.
            내 작품 세계를 정성스럽게 기록하고 전시해 보세요.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/user/signup"
              className="inline-flex h-12 items-center justify-center rounded-full bg-black px-7 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:translate-y-0.5 hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:bg-white dark:text-black dark:hover:bg-gray-100"
              aria-label="무료로 포트폴리오 만들기"
            >
              무료로 포트폴리오 만들기
            </Link>
            <Link
              href="/gallery"
              className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-300 px-7 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              aria-label="갤러리 둘러보기"
            >
              갤러리 둘러보기
            </Link>
          </motion.div>
        </div>
        <HeroGallery items={items} />
      </div>
    </section>
  );
}

function HeroGallery({ items }: { items: articleItemType[] }) {
  const visibleItems = items.slice(0, 6);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (visibleItems.length === 0) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % visibleItems.length);
    }, 3600);
    return () => clearInterval(id);
  }, [visibleItems.length]);

  if (visibleItems.length === 0) return null;

  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/60 via-transparent to-transparent blur-3xl" />
      <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3">
        {visibleItems.map((article, index) => (
          <motion.div
            key={article.id}
            animate={{
              opacity: active === index ? 1 : 0.7,
              scale: active === index ? 1 : 0.96,
            }}
            transition={{ duration: 0.6 }}
            className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 shadow-lg shadow-black/10 backdrop-blur"
          >
            <div className="relative aspect-[4/5]">
              {article.mediaUrls?.[0] ? (
                <Image
                  src={article.mediaUrls[0]}
                  alt={article.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 280px, 180px"
                  priority={index === 0}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-neutral-200 dark:bg-neutral-800 text-sm text-neutral-500 dark:text-neutral-400">
                  작품 이미지
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-xs uppercase text-white/70">
                  {article.categoryName}
                </p>
                <p className="line-clamp-2 text-sm font-medium text-white">
                  {article.title}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatsBar({
  artistCount,
  artworkCount,
}: {
  artistCount: number;
  artworkCount: number;
}) {
  const formatter = new Intl.NumberFormat("ko-KR");
  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-2xl border border-neutral-200/70 bg-white/80 px-6 py-5 text-sm font-medium text-neutral-800 shadow-sm shadow-black/5 md:flex-row md:items-center md:justify-between dark:border-white/10 dark:bg-white/5 dark:text-neutral-200">
        <div className="flex items-center gap-2 text-base text-neutral-900 dark:text-white">
          <Sparkles
            className="h-4 w-4 text-purple-500 dark:text-purple-400"
            aria-hidden
          />
          <span>
            현재 {formatter.format(artistCount)}명의 예술가가{" "}
            {formatter.format(artworkCount)}개의 작품을 기록하고 있어요.
          </span>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          한국 예술가를 위한 초대 기반 커뮤니티
        </p>
      </div>
    </section>
  );
}

function PortfolioShowcase({ sample }: { sample?: articleItemType }) {
  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 rounded-[32px] border border-neutral-200/80 bg-white/90 p-8 shadow-lg shadow-black/5 lg:grid-cols-[1.1fr_minmax(0,0.9fr)] dark:border-white/10 dark:bg-white/5">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
            Portfolio Studio
          </p>
          <h2 className="text-2xl text-neutral-900 dark:text-white md:text-3xl">
            고해상도 이미지와 반응형 레이아웃으로 작품을 온전히 보여주세요
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            드래그 앤드 드롭 에디터, 링크/영상 임베드, 자동 생성되는 공유용
            썸네일까지. 단 몇 분 만에 감각적인 포트폴리오를 완성할 수 있어요.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <FeatureBadge
              icon={<MonitorSmartphone className="h-4 w-4" aria-hidden />}
              title="반응형 레이아웃"
              description="모든 디바이스에서 균형 잡힌 타이포와 여백"
            />
            <FeatureBadge
              icon={<ImageIcon className="h-4 w-4" aria-hidden />}
              title="고해상도 이미지"
              description="오리지널 퀄리티를 보존하는 업로드 파이프라인"
            />
            <FeatureBadge
              icon={<Link2 className="h-4 w-4" aria-hidden />}
              title="링크 & 영상 임베드"
              description="작업 로그, 레퍼런스를 한 화면에"
            />
            <FeatureBadge
              icon={<BadgeCheck className="h-4 w-4" aria-hidden />}
              title="썸네일 자동 생성"
              description="SNS 공유에 최적화된 이미지와 메타 태그"
            />
          </div>
        </div>
        <PortfolioPreviewCard sample={sample} />
      </div>
    </section>
  );
}

function FeatureBadge({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900/5 text-neutral-900 dark:bg-white/10 dark:text-white">
          {icon}
        </span>
        {title}
      </div>
      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
    </div>
  );
}

function PortfolioPreviewCard({ sample }: { sample?: articleItemType }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-neutral-200 bg-gradient-to-b from-white to-neutral-50 p-5 shadow-inner dark:border-white/10 dark:from-white/5 dark:to-black/20">
      <div className="rounded-2xl border border-neutral-200/70 bg-white p-4 shadow-lg shadow-black/10 dark:border-white/10 dark:bg-white/5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                Portfolio Preview
              </p>
              <p className="text-base font-semibold text-neutral-900 dark:text-white">
                {sample?.author?.authorName ?? "작가 이름"}
              </p>
            </div>
            <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs text-white dark:bg-white dark:text-black">
              LIVE
            </span>
          </div>
          <div className="rounded-2xl border border-neutral-200/80 bg-neutral-100/50 p-3 dark:border-white/10 dark:bg-white/5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/80 p-3 dark:bg-white/10">
                <div className="text-[11px] uppercase text-gray-500 dark:text-gray-400">
                  Highlight
                </div>
                <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white line-clamp-2">
                  {sample?.title ?? "새로운 작업기록"}
                </p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 dark:bg-white/10">
                <div className="text-[11px] uppercase text-gray-500 dark:text-gray-400">
                  링크
                </div>
                <p className="mt-1 text-xs text-neutral-700 dark:text-neutral-300">
                  behance.com/username
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5">
            <div className="relative h-52 overflow-hidden rounded-2xl">
              {sample?.mediaUrls?.[0] ? (
                <Image
                  src={sample.mediaUrls[0]}
                  alt={sample.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 420px, 320px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
                  업로드 미리보기
                </div>
              )}
              <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs text-neutral-700 dark:bg-black/70 dark:text-white">
                +9 이미지
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommunityPreview({ articles }: { articles: articleItemType[] }) {
  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
              Community
            </p>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white md:text-2xl">
              작품 중심 갤러리 미리보기
            </h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
              카드 위에 커서를 올려 작가, 업로드 유형, 업로드 시점을 살펴보세요.
            </p>
          </div>
          <Link
            href="/gallery"
            className="text-sm text-neutral-900 dark:text-white underline-offset-4 hover:underline"
            aria-label="작품 더 보기"
          >
            작품 더 보기
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 2xl:grid-cols-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickStartShowcase({ items }: { items: articleItemType[] }) {
  if (items.length === 0) return null;
  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-neutral-200 bg-white/90 p-8 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
              Onboarding
            </p>
            <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              계정 생성에 30초도 걸리지 않아요
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              기본 정보를 입력하고 바로 작품을 업로드하거나 커뮤니티를 탐색해
              보세요.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/user/signup"
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white shadow-sm hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-gray-100"
            >
              무료 가입
            </Link>
            <Link
              href="/user/login"
              className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-300 px-6 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              로그인
            </Link>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-b from-white to-neutral-50"
            >
              <div className="relative h-56">
                {article.mediaUrls?.[0] ? (
                  <Image
                    src={article.mediaUrls[0]}
                    alt={article.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 260px, 100vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
                    작품 미리보기
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs uppercase text-white/60">
                    {article.categoryName}
                  </p>
                  <p className="line-clamp-2 text-base font-semibold text-white">
                    {article.title}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomCTA() {
  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto max-w-5xl rounded-3xl border border-neutral-200/80 bg-white/90 px-8 py-12 text-center shadow-xl shadow-black/5 dark:border-white/10 dark:bg-white/5">
        <h4 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          지금, 당신의 작품 세계를 시작하세요
        </h4>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300">
          가입은 무료이며 언제든지 작품을 업로드하고 포트폴리오를 구성할 수
          있습니다.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/user/signup"
            className="inline-flex h-12 items-center justify-center rounded-full bg-black px-8 text-sm font-medium text-white shadow-sm hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-gray-100"
            aria-label="Artscope 무료 가입"
          >
            무료 가입
          </Link>
          <Link
            href="/user/login"
            className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-300 px-8 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            aria-label="이미 계정이 있으신가요? 로그인"
          >
            로그인
          </Link>
        </div>
      </div>
    </section>
  );
}
