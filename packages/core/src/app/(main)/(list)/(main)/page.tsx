'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { useEffect } from 'react';

import ArticleSection from '@/app/(main)/(list)/(main)/ArticleSection';
import {
  jsonLdNav,
  jsonLdOrg,
  jsonLdSearch,
  jsonLdThumb,
} from '@/app/(main)/(list)/(main)/searchSchema';
import { useUser } from '@/states';
import chunkArray from '@/utils/chunkArray';
import jxios from '@/utils/jxios';

import { articleListType } from '@/types/article';

const LIMIT = 21;

const fetchFeeds = async () =>
  await jxios
    .get('/api/magazines', {
      params: {
        page: 0,
        size: LIMIT,
      },
    })
    .then((res) => res.data as articleListType);

export default function Feeds() {
  const { user, isLogin } = useUser();
  const { data, isLoading, refetch, isSuccess, isError } = useQuery({
    queryKey: ['main'],
    queryFn: fetchFeeds,
  });

  useEffect(() => {
    refetch();
  }, [refetch, user]);

  useEffect(() => {
    if (isError) {
      notFound();
    }
  }, [isError]);

  return (
    <>
      <section>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdNav) }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdThumb) }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSearch) }}
        />
      </section>
      {isLoading && (
        <div className='w-full'>
          <p>Loading...</p>
        </div>
      )}
      {isError && (
        <div className='w-full'>
          <h3 className='my-12 text-center'>에러가 발생했습니다.</h3>
        </div>
      )}
      {data && data.magazines.length === 0 && (
        <h3 className='my-12 text-center'>아직 작성된 글이 없습니다.</h3>
      )}
      {isSuccess &&
        chunkArray(data?.magazines, 7).map((articles, index) => (
          <ArticleSection
            articleList={articles}
            key={articles[0].id}
            position={index % 2 === 0 ? 'right' : 'left'}
          />
        ))}
      <Link href='/articles'>
        <div className='flex items-center justify-center w-full h-32 text-black hover:underline underline-offset-[-4px] decoration-[13px] decoration-amber-300'>
          <p className='text-5xl'>{isLoading ? 'Loading...' : '더보기'}</p>
        </div>
      </Link>
    </>
  );
}
