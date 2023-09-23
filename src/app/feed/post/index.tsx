'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ReactElement, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

import FeedList from '@/app/feed/post/FeedList';
import NewPostModal from '@/app/feed/post/NewPostModalButton';
import UserInfo from '@/app/UserInfo';
import { userStore } from '@/states';

import { feedApiResponseType } from '@/types';

export default function Feeds() {
  const bottom = useRef(null);
  const { user } = userStore();
  const LIMIT = 10;
  const { data, fetchNextPage } = useInfiniteQuery(
    ['feed'],
    async ({ pageParam = 0 }) =>
      await axios
        .post('/api/feed', undefined, {
          params: {
            page: pageParam,
            size: LIMIT,
          },
        })
        .then((res) => res.data as feedApiResponseType),
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
      {user.username && (
        <div className='flex flex-row justify-start gap-2 space-y-1 p-3'>
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
      <div ref={bottom} className='mb-8'>
        <FeedObservationComponent />
      </div>
    </>
  );
}
