"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { standardLabel } from "@/components/StandardLabel";
import type { articleItemType } from "@/types/article";

type CurationHeroProps = {
  items: articleItemType[];
};

export default function CurationHero({ items }: CurationHeroProps) {
  if (!items || items.length === 0) return null;

  const first = items[0];
  const imageUrl = first.mediaUrls?.[0];
  const router = useRouter();
  const [search, setSearch] = useState("");

  const accentTags = useMemo(() => {
    const tags = new Set<string>();
    items.forEach((item) => {
      if (item.categoryName) tags.add(item.categoryName);
      if (item.author?.authorName) tags.add(item.author.authorName);
    });
    return Array.from(tags).slice(0, 4);
  }, [items]);

  const curatedShots = items.slice(1, 4);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = search.trim();
    if (!value) return;
    router.push(`/list?keyword=${encodeURIComponent(value)}`);
  };

  return (
    <section aria-label="오늘의 큐레이션" className="relative mb-10 md:mb-14">
      <div className="relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#1b0f2d] via-[#06030d] to-[#060305]">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute -top-10 -right-10 h-56 w-56 rounded-full bg-[#a264ff]/40 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-[#2c7efc]/40 blur-3xl" />
        </div>
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_minmax(0,1fr)]">
          <div className="flex flex-col gap-8 p-6 md:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Discovery Feed
                </p>
                <motion.h2
                  className="mt-3 text-3xl md:text-4xl font-light text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  한국 예술을 위한 다크 모던 갤러리
                </motion.h2>
                <p className="mt-4 text-sm md:text-base text-white/70 max-w-xl">
                  깊은 블랙과 보라빛 그라데이션으로 감싼 디스커버리 피드에서
                  작품과 작가를 발견하세요. 고급스러운 여백과 시네마틱 조명이
                  작품의 질감을 살립니다.
                </p>
              </div>

              <form
                onSubmit={handleSearch}
                className="w-full lg:w-[320px] rounded-full border border-white/20 bg-white/10 px-4 py-3 text-white shadow-lg shadow-purple-900/30 backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <Search size={18} className="text-white/60" />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search artists…"
                    className="flex-1 bg-transparent text-sm placeholder:text-white/50 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white hover:bg-white/30"
                  >
                    Go
                  </button>
                </div>
              </form>
            </div>

            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-widest text-white/70">
              {accentTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/10 px-3 py-1 font-medium text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-white/70">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                콘텐츠 우선 레이아웃
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                Semi-masonry Grid
              </div>
            </div>

            <div className="mt-auto flex flex-wrap gap-3">
              <Link href="#feed" aria-label="지금 탐색">
                <Button className="h-11 rounded-full bg-white text-black hover:bg-white/90 px-6 font-semibold">
                  지금 탐색
                </Button>
              </Link>
              <Link href="/editor" aria-label="작가 등록">
                <Button
                  variant="ghost"
                  className="h-11 rounded-full border border-white/30 bg-transparent px-6 text-white hover:bg-white/10"
                >
                  작가 등록
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative px-6 pb-8 lg:pr-10 lg:pt-10">
            <div className="relative h-72 overflow-hidden rounded-[28px] border border-white/15 bg-white/5 shadow-2xl shadow-black/40 md:h-[420px]">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
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
                <p className="mt-1 text-sm text-white/70">
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
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2"
                  >
                    <div className="relative h-24 overflow-hidden rounded-xl bg-black/40">
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
                    <div className="mt-2">
                      <p className="text-[11px] uppercase text-white/60">
                        {item.categoryName}
                      </p>
                      <p className="text-sm font-medium text-white line-clamp-2">
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
