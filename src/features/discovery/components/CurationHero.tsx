"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { standardLabel } from "@/components/shared/StandardLabel";
import type { articleItemType } from "@/types/article";

type CurationHeroProps = {
  items: articleItemType[];
};

export default function CurationHero({ items }: CurationHeroProps) {
  const normalizedItems = items ?? [];

  if (!normalizedItems.length) return null;

  const featured = normalizedItems[0];
  const secondary = normalizedItems.slice(1, 4);

  return (
    <section aria-label="Featured" className="space-y-6">
      {/* Main Featured Work */}
      <Link
        href={`/article/${featured.id}`}
        className="group relative block aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 sm:aspect-[2/1] lg:aspect-[2.5/1]"
      >
        {featured.mediaUrls?.[0] ? (
          <Image
            src={featured.mediaUrls[0]}
            alt={standardLabel(featured.title)}
            fill
            priority
            sizes="100vw"
            className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl space-y-3"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-white/70">
              Featured
            </p>
            <h1 className="text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
              {standardLabel(featured.title)}
            </h1>
            <div className="flex items-center gap-3">
              {featured.author?.authorProfileImage && (
                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src={featured.author.authorProfileImage}
                    alt={featured.author.authorName}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
              )}
              <span className="text-sm text-white/80">
                {featured.author?.authorName}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Hover Arrow */}
        <div className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 sm:bottom-8 sm:right-8 lg:bottom-12 lg:right-12">
          <ArrowRight className="h-5 w-5 text-white" />
        </div>
      </Link>

      {/* Secondary Works Grid */}
      {secondary.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
          {secondary.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
            >
              <Link
                href={`/article/${item.id}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900"
              >
                {item.mediaUrls?.[0] ? (
                  <Image
                    src={item.mediaUrls[0]}
                    alt={standardLabel(item.title)}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900" />
                )}

                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Title on Hover */}
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-sm font-medium text-white line-clamp-2">
                    {standardLabel(item.title)}
                  </p>
                  <p className="mt-1 text-xs text-white/70">
                    {item.author?.authorName}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
