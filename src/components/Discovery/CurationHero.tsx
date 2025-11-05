"use client";

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
  if (!items || items.length === 0) return null;

  const first = items[0];
  const imageUrl = first.mediaUrls?.[0];

  return (
    <section aria-label="오늘의 큐레이션" className="relative mb-6 md:mb-10">
      <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl bg-gray-100">
        <div className="relative aspect-[16/10] md:aspect-[16/6]">
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
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/0" />

          <div className="absolute inset-x-0 bottom-0 p-5 md:p-10">
            <motion.h2
              className="text-white text-xl md:text-3xl font-light max-w-3xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {standardLabel(first.title)}
            </motion.h2>

            <div className="mt-4 flex gap-2 md:gap-3">
              <Link href="#feed" aria-label="지금 탐색">
                <Button size="lg" className="h-10 md:h-11 px-4 md:px-6">
                  지금 탐색
                </Button>
              </Link>
              <Link href="/editor" aria-label="작가 등록">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-10 md:h-11 px-4 md:px-6"
                >
                  작가 등록
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
