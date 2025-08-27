import { Metadata, ResolvingMetadata } from "next";
import React, { ReactNode } from "react";

import ASNextImage from "@/components/ASNextImage";
import MarkdownViewer from "@/components/MarkdownViewer";
import ProfileComponent from "@/components/Profile";
import { standardLabel } from "@/components/StandardLabel";

import ArticleViewerActions from "@/app/(main)/(viewer)/article/[id]/ArticleViewerActions";
import ArticleViewerComment from "@/app/(main)/(viewer)/article/[id]/ArticleViewerComment";
import { serverArticlesApi } from "@/utils/serverApi";
import { removeMarkdown } from "@/utils/stringConverter";

import { articleItemType } from "@/types/article";

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

  // optionally access and extend (rather than replace) parent metadata
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

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) throw new Error("id is required");
  const article = await fetchArticle(id);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* 작품 헤더 */}
        <div className="mb-16">
          <h1 className="text-4xl font-light text-gray-900 leading-tight mb-4">
            {standardLabel(article.title)}
          </h1>
          <p className="text-lg font-light text-gray-600">
            by {standardLabel(article.author.authorName)}
          </p>
        </div>

        {/* 작품 콘텐츠 */}
        <div className="mb-16">
          <MarkdownViewer>{article.content}</MarkdownViewer>
        </div>

        {/* 액션 버튼들 */}
        <div className="border-t border-gray-200 pt-8 mb-16">
          <ArticleViewerActions
            id={String(article.id)}
            authorUsername={article.author.authorUsername}
            isLiked={false}
            likes={article.likes}
          />
        </div>

        {/* 작가 정보 */}
        <div className="border-t border-gray-200 pt-8 mb-16">
          <ProfileComponent
            name={
              article.author.authorName +
              (article.teamName ? " by " + article.teamName : "")
            }
            username={article.author.authorUsername}
            picture={article.author.authorProfileImage}
            teamId={article.teamId}
          />
        </div>

        {/* 댓글 */}
        <div className="border-t border-gray-200 pt-8">
          <ArticleViewerComment
            id={article.id}
            comments={article.magazineComments}
          />
        </div>
      </div>
    </div>
  );
}
