'use client';

import { Skeleton } from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { notFound, usePathname } from 'next/navigation';
import React, { ReactElement, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

import NewPostButton from '@/components/New/Posts/NewPostModalButton';

import FeedList from '@/app/(main)/(list)/(feed)/FeedList';
import {
  jsonLdNav,
  jsonLdOrg,
  jsonLdSearch,
  jsonLdThumb,
} from '@/app/(main)/(list)/(feed)/searchSchema';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { feedApiResponseType } from '@/types/feed';

const LIMIT = 10;

const SkeletonFeed = () => (
  <>
    <div className='flex w-full flex-col gap-2 px-4 py-4'>
      <div className='flex w-full max-w-[300px] items-center gap-3'>
        <div>
          <Skeleton className='flex h-12 w-12 rounded-full' />
        </div>
        <div className='flex w-full flex-col gap-2'>
          <Skeleton className='h-3 w-3/5 rounded-lg' />
          <Skeleton className='h-3 w-4/5 rounded-lg' />
        </div>
      </div>
      <Skeleton className='h-4 w-full rounded-full' />
      <Skeleton className='h-4 w-full rounded-full' />
      <div className='flex flex-row gap-3'>
        <Skeleton className='h-5 w-[60px] rounded-full' />
        <Skeleton className='h-5 w-[60px] rounded-full' />
        <Skeleton className='h-5 w-[60px] rounded-full' />
        <Skeleton className='h-5 w-[60px] rounded-full' />
      </div>
      <Skeleton className='mx-1 mt-4 h-0.5 rounded-full' />
    </div>
  </>
);

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
  const { user } = useUser();
  const pathname = usePathname();

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
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
  }, [pathname, refetch]);

  const FeedObservationComponent = (): ReactElement => {
    const [ref, inView] = useInView();
    useEffect(() => {
      if (!data) return;

      const pageLastIdx = data.pages.length - 1;
      const isLast = data?.pages[pageLastIdx].hasNext === false;

      if (!isLast && inView) fetchNextPage();
    }, [inView]);

    return <div ref={ref} className='mb-1 h-1' />;
  };

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
        {data && !isError && (
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
            <div ref={bottom} className='mb-8 h-1'>
              <FeedObservationComponent />
            </div>
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
        {data &&
          (data.pages.length === 0 || data.pages[0].feedItems.length === 0) && (
            <h3 className='my-12 text-center'>아직 작성된 글이 없습니다.</h3>
          )}
      </div>
    </>
  );
}
