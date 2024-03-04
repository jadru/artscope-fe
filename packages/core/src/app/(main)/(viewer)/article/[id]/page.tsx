import React from 'react';

import MarkdownViewer from '@/components/MarkdownViewer';

import Logo from '@/assets/images/logo_long.svg';
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
      <Logo className='m-8 group-hover:fill-primary w-52 overflow-hidden fill-black transition duration-100 z-40' />
      <div className='container max-w-screen-md my-8'>
        <h1 className='text-3xl'>{article.title}</h1>
        <p>{article.category}</p>
        <div className='bg-default-100 w-full space-y-2 rounded-xl px-3 py-3'>
          <MarkdownViewer>{article.content}</MarkdownViewer>
        </div>
      </div>
    </div>
  );
}
