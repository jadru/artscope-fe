'use client';

import { Skeleton } from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ReactElement, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

import useUser from '@/hooks/useUser';

import FeedList from '@/app/(feed)/FeedList';
import NewPostModal from '@/app/(feed)/NewPostModalButton';
import UserInfo from '@/app/UserInfo';

import { feedApiResponseType } from '@/types';

const SkeletonFeed = () => (
  <>
    <div className='flex flex-col gap-2 border-x px-4 py-4'>
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

export default function Feeds() {
  const bottom = useRef(null);
  const user = useUser();

  const fetchFeeds = async ({ pageParam = 0 }) =>
    await axios
      .post('/api/feed', undefined, {
        params: {
          page: pageParam,
          size: LIMIT,
        },
      })
      .then((res) => {
        return res.data as feedApiResponseType;
      });
  const LIMIT = 10;
  const { data, fetchNextPage, isLoading } = useInfiniteQuery(
    ['feed'],
    async ({ pageParam = 0 }) => await fetchFeeds({ pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.hasNext ? allPages.length : null;
      },
    }
  );

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

  return (
    <>
      {user && user.username && (
        <div className='flex animate-fade flex-row justify-start gap-2 space-y-1 border-x border-b border-default-200 p-3'>
          <UserInfo />
          <NewPostModal
            submitBtnText='작성'
            placeholder='무슨 이야기가 있나요?'
          />
        </div>
      )}
      {data &&
        data.pages.map((page, index) => {
          return <FeedList data={page.feedItems} key={'feed-' + index} />;
        })}
      {isLoading && (
        <>
          <SkeletonFeed />
          <SkeletonFeed />
          <SkeletonFeed />
          <SkeletonFeed />
          <SkeletonFeed />
          <SkeletonFeed />
          <SkeletonFeed />
          <SkeletonFeed />
        </>
      )}
      <div ref={bottom} className='mb-8'>
        <FeedObservationComponent />
      </div>
    </>
  );
}
