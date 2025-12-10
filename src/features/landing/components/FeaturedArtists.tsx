"use client";

import Link from "next/link";

import ASNextImage from "@/components/shared/ASNextImage";
import type { articleItemType } from "@/types/article";

interface FeaturedArtwork {
  id: number;
  title: string;
  imageUrl: string;
  artistName: string;
  artistUsername: string;
  description: string;
}

interface FeaturedArtistsProps {
  articles: articleItemType[];
}

export default function FeaturedArtists({ articles }: FeaturedArtistsProps) {
  // Transform articles to featured artworks (take first 4)
  const featuredArtworks: FeaturedArtwork[] = articles.slice(0, 4).map((article) => ({
    id: article.id,
    title: article.author?.authorName || "아티스트",
    imageUrl: article.mediaUrls?.[0] || "",
    artistName: article.author?.authorName || "아티스트",
    artistUsername: article.author?.authorUsername || "",
    description: article.title || "작품 설명이 없습니다.",
  }));

  if (featuredArtworks.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 px-4 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-2xl font-semibold text-gray-900 md:text-3xl">
          이달의 주목받는 아티스트
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
          {featuredArtworks.map((artwork) => (
            <FeaturedArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedArtworkCard({ artwork }: { artwork: FeaturedArtwork }) {
  return (
    <Link
      href={`/article/${artwork.id}`}
      className="group block"
    >
      <div className="overflow-hidden rounded-lg bg-white">
        <div className="relative aspect-[4/3]">
          {artwork.imageUrl ? (
            <ASNextImage
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
              작품 이미지
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-base font-medium text-gray-900">
          {artwork.artistName}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
          {artwork.description}
        </p>
      </div>
    </Link>
  );
}
