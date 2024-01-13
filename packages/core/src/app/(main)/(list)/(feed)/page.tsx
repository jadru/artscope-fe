'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { notFound, useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

import NewPostButton from '@/components/New/Posts/NewPostModalButton';
import FeedObservationComponent from '@/components/ObservationComponent';

import FeedList from '@/app/(main)/(list)/(feed)/FeedList';
import {
  jsonLdNav,
  jsonLdOrg,
  jsonLdSearch,
  jsonLdThumb,
} from '@/app/(main)/(list)/(feed)/searchSchema';
import SkeletonFeed from '@/app/(main)/(list)/(feed)/SkeletonFeed';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { feedApiResponseType } from '@/types/feed';

const LIMIT = 10;

const fetchFeeds = async ({ pageParam = 0 }) =>
  await jxios
    .post('/api/feed', undefined, {
      params: {
        page: pageParam,
        size: LIMIT,
      },
    })
    .then((res) => res.data as feedApiResponseType);

export default function Feeds() {
  const bottom = useRef(null);
  const { user, isLogin } = useUser();
  const { push } = useRouter();
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isSuccess,
    isError,
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam }) => await fetchFeeds({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasNext ? allPages.length : null;
    },
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
      <div className='w-full'>
        <NewPostButton placeholder='무슨 이야기가 있나요?' />
        {isSuccess && (
          <>
            {data.pages.map(
              (page, index) =>
                page.feedItems &&
                page.feedItems.length > 0 && (
                  <FeedList
                    data={page.feedItems}
                    key={'feed-' + page.feedItems[0].id + index}
                  />
                )
            )}
          </>
        )}
        {isLoading && (
          <div className='w-full'>
            <SkeletonFeed />
            <SkeletonFeed />
            <SkeletonFeed />
            <SkeletonFeed />
            <SkeletonFeed />
            <SkeletonFeed />
            <SkeletonFeed />
            <SkeletonFeed />
          </div>
        )}
        {isFetchingNextPage && (
          <div className='w-full'>
            <SkeletonFeed />
            <SkeletonFeed />
            <SkeletonFeed />
            <SkeletonFeed />
            <SkeletonFeed />
            <SkeletonFeed />
            <SkeletonFeed />
            <SkeletonFeed />
          </div>
        )}
        {isError && (
          <div className='w-full'>
            <h3 className='my-12 text-center'>에러가 발생했습니다.</h3>
          </div>
        )}
        {isSuccess && (
          <div ref={bottom}>
            <FeedObservationComponent
              hasNext={data.pages[data.pages.length - 1].hasNext}
              hasData={Boolean(data)}
              fetchNextPage={fetchNextPage}
            />
          </div>
        )}
        {data &&
          (data.pages.length === 0 || data.pages[0].feedItems.length === 0) && (
            <h3 className='my-12 text-center'>아직 작성된 글이 없습니다.</h3>
          )}
      </div>
    </>
  );
}
