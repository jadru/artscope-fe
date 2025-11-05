"use client";

import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  jsonLdNav,
  jsonLdOrg,
  jsonLdSearch,
  jsonLdThumb,
} from "@/app/(main)/(list)/searchSchema";
import jxios from "@/utils/jxios";

import { articleListType } from "@/types/article";
import ArticleCard from "./article-card";

const PREVIEW_LIMIT = 12;

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

  return (
    <main className="pb-20">
      {/* SEO JSON-LD */}
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
      </section>

      {/* Hero */}
      <section className="px-4 md:px-6 pt-16 md:pt-28">
        <div className="mx-auto max-w-6xl">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl md:text-5xl leading-tight tracking-tight text-neutral-900"
          >
            예술가의 포트폴리오,
            <br className="hidden md:block" /> 작품이 모이는 커뮤니티
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mt-5 text-base md:text-lg text-neutral-600 max-w-2xl"
          >
            작품을 가장 아름답게 기록하고, 한국 예술가를 위한 품격 있는
            커뮤니티에서 영감을 주고받으세요.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <Link
              href="/user/signup"
              className="inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium text-white bg-black hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50"
              aria-label="무료로 시작하기"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/gallery"
              className="inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium text-neutral-900 border border-neutral-300 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
              aria-label="갤러리 둘러보기"
            >
              갤러리 둘러보기
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Two pillars */}
      <section className="px-4 md:px-6 mt-16 md:mt-24">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="rounded-2xl border border-neutral-200 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-medium text-neutral-900">
              포트폴리오
            </h2>
            <p className="mt-3 text-neutral-600">
              작품을 작품답게. 고해상도 이미지, 타이포그래피, 여백 중심의
              프레젠테이션으로 당신의 포트폴리오를 가장 아름답게 보여줍니다.
            </p>
            <ul className="mt-5 space-y-2 text-neutral-700 text-sm">
              <li>• 커버/그리드 뷰, 반응형 레이아웃</li>
              <li>• 링크/영상 임베드, 깔끔한 에디터</li>
              <li>• 공유에 최적화된 썸네일/메타 태그</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-neutral-200 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-medium text-neutral-900">
              커뮤니티
            </h2>
            <p className="mt-3 text-neutral-600">
              국내 예술가 중심의 담백한 대화와 영감 교류. 작품 업로드, 피드백,
              팔로우로 서로의 창작 여정을 응원합니다.
            </p>
            <ul className="mt-5 space-y-2 text-neutral-700 text-sm">
              <li>• 작품 업로드와 안전한 원본 관리</li>
              <li>• 댓글/좋아요/북마크로 반응 수집</li>
              <li>• 큐레이션된 홈 피드 미리보기</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Community preview grid */}
      <section className="px-4 md:px-6 mt-16 md:mt-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="text-lg md:text-xl font-medium text-neutral-900">
                커뮤니티 미리보기
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                최근 업로드된 작품 일부를 보여드립니다.
              </p>
            </div>
            <Link
              href="/gallery"
              className="text-sm text-neutral-900 hover:underline"
              aria-label="작품 더 보기"
            >
              더 보기
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-6 gap-2">
            {data.magazines.slice(0, PREVIEW_LIMIT).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 md:px-6 mt-20 md:mt-28">
        <div className="mx-auto max-w-6xl rounded-2xl border border-neutral-200 p-8 md:p-12 text-center">
          <h4 className="text-xl md:text-2xl text-neutral-900">
            지금, 당신의 작품 세계를 시작하세요
          </h4>
          <p className="mt-2 text-neutral-600">
            가입은 무료이며 언제든지 작품을 업로드하고 포트폴리오를 구성할 수
            있습니다.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/user/signup"
              className="inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium text-white bg-black hover:bg-black/90"
              aria-label="Artscope 무료 가입"
            >
              무료 가입
            </Link>
            <Link
              href="/user/login"
              className="inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium text-neutral-900 border border-neutral-300 hover:bg-neutral-50"
              aria-label="이미 계정이 있으신가요? 로그인"
            >
              로그인
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
