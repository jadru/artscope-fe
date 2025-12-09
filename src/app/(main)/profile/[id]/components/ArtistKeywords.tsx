"use client";

import { standardLabel } from "@/components/shared/StandardLabel";

type ArtistKeywordsProps = {
  keywords: string[];
};

export default function ArtistKeywords({ keywords }: ArtistKeywordsProps) {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {keywords.map((keyword, index) => (
        <span
          key={index}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full text-sm font-light hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
        >
          {standardLabel(keyword)}
        </span>
      ))}
    </div>
  );
}
