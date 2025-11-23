"use client";

import { useState } from "react";
import { standardLabel } from "@/components/StandardLabel";

type ArtistLongBioProps = {
  bio: string;
  shortVersion?: string;
  maxLength?: number;
};

export default function ArtistLongBio({
  bio,
  shortVersion,
  maxLength = 300,
}: ArtistLongBioProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!bio) return null;

  const cleanBio = standardLabel(bio);
  const cleanShortVersion = shortVersion ? standardLabel(shortVersion) : undefined;

  const needsExpansion = cleanBio.length > maxLength;
  const displayText = isExpanded
    ? cleanBio
    : cleanShortVersion ||
      cleanBio.slice(0, maxLength) + (needsExpansion ? "..." : "");

  return (
    <div className="space-y-4">
      <div className="text-gray-700 dark:text-gray-300 leading-[1.8] font-light text-lg tracking-wide max-w-3xl whitespace-pre-line">
        {displayText}
      </div>

      {needsExpansion && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition-colors font-light text-sm group"
        >
          <span>{isExpanded ? "접기" : "더 보기"}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

