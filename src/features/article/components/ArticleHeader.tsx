"use client";

import ASNextImage from "@/components/shared/ASNextImage";

interface ArticleHeaderProps {
  title: string;
  imageUrl: string;
  year?: string;
}

export default function ArticleHeader({
  title,
  imageUrl,
  year,
}: ArticleHeaderProps) {
  const displayYear = year || new Date().getFullYear().toString();

  return (
    <div className="space-y-8">
      {/* Hero Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-200">
        {imageUrl ? (
          <ASNextImage
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            작품 이미지
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
        {title} - {displayYear}
      </h1>
    </div>
  );
}
