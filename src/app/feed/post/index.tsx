'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ReactElement, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

import NewPostModal from '@/app/feed/post/NewPostModalButton';
import FeedList from '@/app/FeedList';
import UserInfo from '@/app/UserInfo';
import { userStore } from '@/states';

import { feedApiResponseType } from '@/types';

export default function Index() {
  const bottom = useRef(null);
  const { user } = userStore();
  const LIMIT = 10;
  const { data, isSuccess, fetchNextPage } = useInfiniteQuery(
    ['feed'],
    ({ pageParam = 0 }) =>
      axios
        .post('/api/feed', undefined, {
          params: {
            page: pageParam,
            size: LIMIT,
          },
        })
        .then((res) => res.data as feedApiResponseType),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.hasNext ? lastPage.pageInfo.page + 1 : null;
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

    return <div ref={ref} />;
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
      {isSuccess &&
        data.pages.map((page) => {
          return <FeedList data={page.feedItems} key={page.pageInfo.page} />;
        })}
      <div ref={bottom} className='mb-1 h-1'>
        <FeedObservationComponent />
      </div>
    </>
  );
}
