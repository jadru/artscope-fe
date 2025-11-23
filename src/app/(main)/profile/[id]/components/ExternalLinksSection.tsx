"use client";

import PreviewCard from "./PreviewCard";

type ExternalLinksSectionProps = {
  websiteUrl?: string;
  snsUrl?: string;
  artistName: string;
};

export default function ExternalLinksSection({
  websiteUrl,
  snsUrl,
  artistName,
}: ExternalLinksSectionProps) {
  const hasLinks = websiteUrl || snsUrl;

  if (!hasLinks) return null;

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mb-4">
            Connect
          </h2>
          <div className="w-24 h-px bg-gray-900 dark:bg-gray-100" />
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {websiteUrl && (
            <PreviewCard
              title="Website"
              description={`${artistName}의 공식 웹사이트를 방문해보세요`}
              url={websiteUrl}
              icon="website"
            />
          )}
          {snsUrl && (
            <PreviewCard
              title="Instagram"
              description={`${artistName}의 인스타그램에서 더 많은 작품을 확인하세요`}
              url={snsUrl}
              icon="instagram"
            />
          )}
        </div>
      </div>
    </section>
  );
}
