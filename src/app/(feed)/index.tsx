'use client';

import { Skeleton } from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { notFound, useParams } from 'next/navigation';
import { ReactElement, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import useLocalStorage from 'use-local-storage';

import FeedList from '@/app/(feed)/FeedList';
import NewPostModal from '@/app/(feed)/NewPostModalButton';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

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
  const [scrollY, setScrollY] = useLocalStorage('feed_scroll', 0);
  const { user } = useUser();
  const params = useParams();

  const fetchFeeds = async ({ pageParam = 0 }) =>
    await jxios
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
  const { data, fetchNextPage, isLoading, refetch, isError } = useInfiniteQuery(
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

  useEffect(() => {
    refetch();
  }, [refetch, user]);

  useEffect(() => {
    if (isError) {
      notFound();
    }
  }, [isError]);

  useEffect(() => {
    if (
      scrollY === 0 ||
      document.documentElement?.scrollHeight - 100 < scrollY ||
      scrollY === window.scrollY
    ) {
      return;
    } else {
      window.scrollTo(0, scrollY);
      setScrollY(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setScrollY, scrollY, params, isLoading]);

  return (
    <>
      {user && user.username && (
        <NewPostModal
          submitBtnText='작성'
          placeholder='무슨 이야기가 있나요?'
        />
      )}
      {data && (
        <>
          {data.pages.map((page, index) => (
            <FeedList
              data={page.feedItems}
              key={'feed-' + page.feedItems[0].id + index}
            />
          ))}
          <div ref={bottom} className='mb-8 h-1'>
            <FeedObservationComponent />
          </div>
        </>
      )}
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
      {data && data.pages[0].feedItems.length === 0 && (
        <h3 className='my-12 text-center'>아직 작성된 글이 없습니다.</h3>
      )}
    </>
  );
}
