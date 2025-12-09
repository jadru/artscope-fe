import { Metadata, ResolvingMetadata } from "next";

import { serverArticlesApi } from "@/utils/serverApi";
import { removeMarkdown } from "@/utils/stringConverter";
import { standardLabel } from "@/components/shared/StandardLabel";

import type { articleItemType } from "@/types/article";

import ArticleHeader from "@/features/article/components/ArticleHeader";
import ArticleContent from "@/features/article/components/ArticleContent";
import SupportingWorks from "@/features/article/components/SupportingWorks";
import ArtistAuthorCard from "@/features/article/components/ArtistAuthorCard";

const fetchArticle = async (id: string) => {
  return (await serverArticlesApi.getMagazineById(id)) as articleItemType;
};

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  if (!id) throw new Error("id is required");

  const article = await fetchArticle(id);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${standardLabel(article.title)} - ${standardLabel(
      article.author.authorName
    )}`,
    description: standardLabel(removeMarkdown(article.content).slice(0, 40)),
    openGraph: {
      images: [article.mediaUrls[0], ...previousImages],
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

  const article = await fetchArticle(id);

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
