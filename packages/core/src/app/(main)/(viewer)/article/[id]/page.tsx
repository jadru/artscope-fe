import React from 'react';

import ASNextImage from '@/components/ASNextImage';
import MarkdownViewer from '@/components/MarkdownViewer';

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
        <ASNextImage
          src={article.mediaUrls[0]}
          alt='thumbnail'
          className='object-cover w-screen'
          width={1000}
          height={400}
        />
        <div className='absolute left-0 top-0 w-full h-full bg-black/30 flex justify-center items-center'>
          <div className='max-w-screen-md mx-auto py-12 w-full px-2'>
            <h2 className='px-4 text-4xl text-white break-keep pt-4'>
              {article.title}
            </h2>
            <h3 className='px-4 text-xl text-white break-keep'>
              {article.author.authorName}
            </h3>
          </div>
        </div>
      </div>
      <div className='container max-w-screen-md my-8 bg-default-100 w-full space-y-2 rounded-xl px-2 py-3'>
        <MarkdownViewer>{article.content}</MarkdownViewer>
      </div>
    </div>
  );
}
