import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";
import { canonicalPageMetadata } from "@/lib/seo";
import { DetailUnavailableError, loadDetail, NOT_FOUND_META, UNAVAILABLE_ROBOTS } from "@/lib/detail-load";

import { notFound } from "next/navigation";

import { serverArticlesApi } from "@/utils/serverApi";
import { removeMarkdown } from "@/utils/stringConverter";
import { normalizeMediaUrl } from "@/utils/mediaUrl";
import { standardLabel } from "@/components/shared/StandardLabel";

import type { articleItemType } from "@/types/article";

import ArticleHeader from "@/features/article/components/ArticleHeader";
import ArticleContent from "@/features/article/components/ArticleContent";
import SupportingWorks from "@/features/article/components/SupportingWorks";
import ArtistAuthorCard from "@/features/article/components/ArtistAuthorCard";

const fetchArticle = async (id: string) =>
  (await serverArticlesApi.getMagazineById(id)) as articleItemType;

// AS-18: 404/empty → notFound(); network/5xx/timeout → noindex metadata + error boundary.
// cache() shares one API call between generateMetadata and the page within a request.
const loadArticle = cache((id: string) => loadDetail(() => fetchArticle(id)));

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  if (!id) throw new Error("id is required");
  const page = canonicalPageMetadata(["article", id]);

  const loaded = await loadArticle(id);
  // AS-19: return cleared canonical/og:url (do not call notFound() here — that
  // would discard this return and inherit root "./" canonical onto the 404).
  if (loaded.status === "not-found") return { ...NOT_FOUND_META };
  if (loaded.status === "unavailable") {
    // AS-17 fallback stays; AS-18 keeps the placeholder out of search results.
    return {
      title: "작품",
      alternates: page.alternates,
      robots: UNAVAILABLE_ROBOTS,
      openGraph: { url: page.url, title: "작품", siteName: "Artscope" },
    };
  }
  const article = loaded.data;
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${standardLabel(article.title)} - ${standardLabel(
      article.author.authorName
    )}`,
    description: standardLabel(removeMarkdown(article.content).slice(0, 40)),
    alternates: page.alternates,
    openGraph: {
      url: page.url,
      images: [normalizeMediaUrl(article.mediaUrls[0]), ...previousImages],
      title: `${standardLabel(article.title)} - ${standardLabel(
        article.author.authorName
      )}`,
      description: standardLabel(removeMarkdown(article.content).slice(0, 40)),
      siteName: "Artscope",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) throw new Error("id is required");

  const loaded = await loadArticle(id);
  if (loaded.status === "not-found") notFound();
  if (loaded.status === "unavailable") throw new DetailUnavailableError("article", loaded.error);
  const article = loaded.data;

  // Extract year from createdTime
  const year = article.createdTime
    ? new Date(article.createdTime).getFullYear().toString()
    : new Date().getFullYear().toString();

  // Get supporting works from additional media URLs
  const supportingWorks = article.mediaUrls.slice(1, 3).map((url, index) => ({
    id: article.id + index + 1,
    title: `${article.author.authorName}의 작품`,
    year: year,
    imageUrl: url,
    description: `관련 작품 ${index + 1}`,
  }));

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      {/* Hero Image & Title */}
      <ArticleHeader
        title={standardLabel(article.title)}
        imageUrl={article.mediaUrls[0]}
        year={year}
      />

      {/* Artist Author Card */}
      <div className="mt-8">
        <ArtistAuthorCard author={article.author} />
      </div>

      {/* Content */}
      <div className="mt-8">
        <ArticleContent content={article.content} />
      </div>

      {/* Supporting Works */}
      {supportingWorks.length > 0 && (
        <SupportingWorks works={supportingWorks} />
      )}
    </main>
  );
}
