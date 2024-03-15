import React from 'react';

import ASNextImage from '@/components/ASNextImage';
import MarkdownViewer from '@/components/MarkdownViewer';
import ProfileComponent from '@/components/Profile';
import { standardLabel } from '@/components/StandardLabel';

import ArticleViewerActions from '@/app/(main)/(viewer)/article/[id]/ArticleViewerActions';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { articleItemType } from '@/types/article';

const fetchArticle = async (id: string) => {
  return await jxios
    .get(`${NEXT_PUBLIC_API_URL}/api/magazines/${id}`)
    .then((res) => res.data as articleItemType);
};

export default async function MagazineDetail({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const article = await fetchArticle(params.id);
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
          <div className='w-full h-full bg-blue-500 transition duration-300' />
        )}
        <div className='absolute left-0 top-0 w-full h-full bg-black/30 flex justify-center items-center'>
          <div className='max-w-screen-md mx-auto py-12 w-full px-2'>
            <h2 className='px-4 text-4xl text-white break-keep pt-4'>
              {standardLabel(article.title)}
            </h2>
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
          <ArticleViewerActions
            id={String(article.id)}
            authorUsername={article.author.authorUsername}
          />
        </div>
        <div className='w-full px-2.5'>
          <ProfileComponent
            name={article.author.authorName}
            username={article.author.authorUsername}
            picture={article.author.authorProfileImage}
          />
        </div>
      </div>
    </div>
  );
}
