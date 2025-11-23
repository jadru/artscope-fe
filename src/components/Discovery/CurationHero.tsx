"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { standardLabel } from "@/components/StandardLabel";
import type { articleItemType } from "@/types/article";

type CurationHeroProps = {
  items: articleItemType[];
};

export default function CurationHero({ items }: CurationHeroProps) {
  const normalizedItems = items ?? [];

  const accentTags = useMemo(() => {
    const tags = new Set<string>();
    normalizedItems.forEach((item) => {
      if (item.categoryName) tags.add(item.categoryName);
      if (item.author?.authorName) tags.add(item.author.authorName);
    });
    return Array.from(tags).slice(0, 4);
  }, [normalizedItems]);

  if (!normalizedItems.length) return null;

  const first = normalizedItems[0];
  const imageUrl = first.mediaUrls?.[0];

  const curatedShots = normalizedItems.slice(1, 4);

  return (
    <section aria-label="오늘의 큐레이션" className="relative mb-10 md:mb-14">
      <div className="relative w-full overflow-hidden rounded-[32px] border border-[color:var(--panel-border)] bg-gradient-to-br from-white via-[#f4edff] to-[#fef9ff] text-gray-900 shadow-xl shadow-[color:var(--panel-border)]/30 dark:from-[#1b0f2d] dark:via-[#06030d] dark:to-[#060305] dark:text-white">
        <div className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-70">
          <div className="absolute -top-10 -right-10 h-56 w-56 rounded-full bg-[#a264ff]/20 blur-3xl dark:bg-[#a264ff]/40" />
          <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-[#f8d7ff]/30 blur-3xl dark:bg-[#2c7efc]/40" />
        </div>
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_minmax(0,1fr)]">
          <div className="flex flex-col gap-8 p-6 md:p-10">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted-foreground)]">
                Discovery Feed
              </p>
              <motion.h2
                className="text-3xl font-light md:text-4xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                오늘 주목해야 할 작품과 작가
              </motion.h2>
              <p className="text-sm text-gray-600 dark:text-white/75 md:text-base">
                요즘 사랑받는 장면, 인터뷰, 큐레이션을 한눈에 살펴보고 내 취향에
                맞는 이야기를 찾아보세요.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">
              {accentTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[color:var(--panel-border)] bg-[color:var(--panel-muted)] px-3 py-1 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-gray-700 dark:text-white/80">
              <div className="flex items-center gap-2 rounded-full border border-[color:var(--panel-border)] bg-[color:var(--panel-muted)] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                에디터 추천
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[color:var(--panel-border)] bg-[color:var(--panel-muted)] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                실시간 인기
              </div>
            </div>

            <div className="mt-auto flex flex-wrap gap-3">
              <Link href="#feed" aria-label="지금 탐색">
                <Button className="h-11 rounded-full bg-gray-900 px-6 font-semibold text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-white/90">
                  지금 탐색
                </Button>
              </Link>
              <Link href="/editor" aria-label="작가 등록">
                <Button
                  variant="ghost"
                  className="h-11 rounded-full border border-[color:var(--panel-border)] bg-transparent px-6 text-gray-800 hover:bg-[color:var(--panel-muted)] dark:text-white dark:hover:bg-white/10"
                >
                  작가 등록
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative px-6 pb-8 lg:pr-10 lg:pt-10">
            <div className="relative h-72 overflow-hidden rounded-[28px] border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] shadow-2xl shadow-black/10 dark:shadow-black/40 md:h-[420px]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={standardLabel(first.title)}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/50" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                  Featured Story
                </p>
                <motion.h3
                  className="mt-2 text-2xl font-semibold text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {standardLabel(first.title)}
                </motion.h3>
                <p className="mt-1 text-sm text-white/80">
                  {first.author?.authorName}
                </p>
              </div>
            </div>
            {curatedShots.length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {curatedShots.map((item) => (
                  <Link
                    key={item.id}
                    href={`/article/${item.id}`}
                    className="group relative overflow-hidden rounded-2xl border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] p-2 shadow-sm dark:shadow-white/5"
                  >
                    <div className="relative h-24 overflow-hidden rounded-xl bg-[color:var(--panel-muted)]">
                      {item.mediaUrls?.[0] ? (
                        <Image
                          src={item.mediaUrls[0]}
                          alt={standardLabel(item.title)}
                          fill
                          sizes="150px"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/50" />
                      )}
                    </div>
                    <div className="mt-2 text-gray-800 dark:text-white">
                      <p className="text-[11px] uppercase text-[color:var(--muted-foreground)]">
                        {item.categoryName}
                      </p>
                      <p className="text-sm font-medium line-clamp-2">
                        {standardLabel(item.title)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
