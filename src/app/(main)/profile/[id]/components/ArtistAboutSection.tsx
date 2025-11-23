"use client";

import { standardLabel } from "@/components/StandardLabel";
import ArtistKeywords from "./ArtistKeywords";
import ArtistLongBio from "./ArtistLongBio";

type ArtistAboutSectionProps = {
  shortBio?: string;
  keywords?: string[];
  themeBio?: string;
  longBio?: string;
};

export default function ArtistAboutSection({
  shortBio,
  keywords,
  themeBio,
  longBio,
}: ArtistAboutSectionProps) {
  const hasContent = shortBio || keywords?.length || themeBio || longBio;

  if (!hasContent) return null;

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mb-4">
            About
          </h2>
          <div className="w-24 h-px bg-gray-900 dark:bg-gray-100" />
        </div>

        <div className="space-y-12 md:space-y-16">
          {/* Short Bio */}
          {shortBio && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                소개
              </h3>
              <p className="text-gray-800 dark:text-gray-200 leading-[1.8] font-light text-xl tracking-wide max-w-3xl">
                {standardLabel(shortBio)}
              </p>
            </div>
          )}

          {/* Keywords */}
          {keywords && keywords.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                주요 키워드
              </h3>
              <ArtistKeywords keywords={keywords} />
            </div>
          )}

          {/* Theme/Worldview Bio */}
          {themeBio && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                작업 주제 및 세계관
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-[1.8] font-light text-lg tracking-wide max-w-3xl">
                {standardLabel(themeBio)}
              </p>
            </div>
          )}

          {/* Long Bio (Expandable) */}
          {longBio && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                상세 소개
              </h3>
              <ArtistLongBio bio={longBio} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
