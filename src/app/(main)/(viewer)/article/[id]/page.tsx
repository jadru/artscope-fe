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
    <div>
      <div className="max-w-screen-lg mx-auto py-10 w-full px-2">
        <h1 className="px-4 text-4xl font-bold text-gray-900 break-keep pt-4">
          {standardLabel(article.title)}
        </h1>
        <h3 className="px-4 text-xl text-gray-500 break-keep mt-2">
          by {standardLabel(article.author.authorName)}
        </h3>
      </div>
      <div className="max-w-screen-lg px-0 flex flex-col gap-2 items-stretch mx-auto">
        <div className="bg-default-100 w-full space-y-2 rounded-xl min-h-64 p-4">
          <MarkdownViewer>{article.content}</MarkdownViewer>
        </div>
        <div className="w-full px-4">
          <ArticleViewerActions
            id={String(article.id)}
            authorUsername={article.author.authorUsername}
            isLiked={false}
            likes={article.likes}
          />
        </div>
        <div className="w-full p-4">
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
        <div className="w-full px-2.5">
          <ArticleViewerComment
            id={article.id}
            comments={article.magazineComments}
          />
        </div>
      </div>
    </div>
  );
}
