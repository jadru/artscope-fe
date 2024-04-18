import { Metadata, ResolvingMetadata } from 'next';
import React from 'react';

import ASNextImage from '@/components/ASNextImage';
import MarkdownViewer from '@/components/MarkdownViewer';
import ProfileComponent from '@/components/Profile';
import { standardLabel } from '@/components/StandardLabel';

import ArticleViewerActions from '@/app/(main)/(viewer)/article/[id]/ArticleViewerActions';
import ArticleViewerComment from '@/app/(main)/(viewer)/article/[id]/ArticleViewerComment';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';
import { removeMarkdown } from '@/utils/stringConverter';

import { articleItemType } from '@/types/article';

const fetchArticle = async (id: string) => {
  return await jxios
    .get(`${NEXT_PUBLIC_API_URL}/api/magazines/${id}`)
    .then((res) => res.data as articleItemType);
};

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  if (!id) throw new Error('id is required');

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
      siteName: 'Artscope',
    },
  };
}

export default async function MagazineDetail({ params }: Props) {
  const id = params.id;
  if (!id) throw new Error('id is required');
  const article = await fetchArticle(id);

  return (
    <div>
      <div className='h-96 max-h-screen overflow-hidden relative'>
        {article.mediaUrls[0] &&
        article.mediaUrls[0] !== 'https://cdn.artscope.kr/undefined' ? (
          <ASNextImage
            src={article.mediaUrls[0]}
            alt='thumbnail'
            className='object-cover w-screen'
            width={1000}
            height={400}
          />
        ) : (
          <div className='w-full h-full bg-[#ACB884] transition duration-300' />
        )}
        <div className='absolute left-0 top-0 w-full h-full bg-black/30 flex justify-center items-center'>
          <div className='max-w-screen-md mx-auto py-12 w-full px-2'>
            <h1 className='px-4 text-4xl text-white break-keep pt-4'>
              {standardLabel(article.title)}
            </h1>
            <h3 className='px-4 text-xl text-white break-keep'>
              {standardLabel(article.author.authorName)}
            </h3>
          </div>
        </div>
      </div>
      <div className='container max-w-screen-md px-0 flex flex-col gap-2 items-stretch'>
        <div className='bg-default-100 w-full space-y-2 rounded-xl min-h-64 px-2.5 pt-4'>
          <MarkdownViewer>{article.content}</MarkdownViewer>
        </div>
        <div className='w-full px-2.5'>
          <ProfileComponent
            borderTop
            name={
              article.author.authorName +
              (article.teamName ? ' by ' + article.teamName : '')
            }
            username={article.author.authorUsername}
            picture={article.author.authorProfileImage}
            teamId={article.teamId}
          />
        </div>
        <div className='w-full px-2.5'>
          <ArticleViewerActions
            id={String(article.id)}
            authorUsername={article.author.authorUsername}
            isLiked={false}
            likes={article.likes}
          />
        </div>
        <div className='w-full px-2.5'>
          <ArticleViewerComment
            id={article.id}
            comments={article.magazineComments}
          />
        </div>
      </div>
    </div>
  );
}
