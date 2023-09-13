'use client';

import { Tab, Tabs } from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import FeedList, { TabType } from '@/app/FeedList';
import NewPostModal from '@/app/NewPostModalButton';
import UserInfo from '@/app/UserInfo';
import { userStore } from '@/states';

import { feedApiResponseType } from '@/types';

export default function Page() {
  const bottom = useRef(null);
  const LIMIT = 10;
  const { user } = userStore();
  const [tab, setTab] = useState<TabType>('feed');
  const {
    data: feedData,
    isSuccess: isSuccessFeed,
    fetchNextPage: fetchNextPageFeed,
  } = useInfiniteQuery(
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

  const ObservationComponent = (): ReactElement => {
    const [ref, inView] = useInView();
    useEffect(() => {
      if (!feedData) return;

      const pageLastIdx = feedData.pages.length - 1;
      const isLast = feedData?.pages[pageLastIdx].hasNext === false;

      if (!isLast && inView) fetchNextPageFeed();
    }, [inView]);

    return <div ref={ref} />;
  };

  return (
    <>
      <div className='container mx-auto flex flex-col items-center justify-center border-y'>
        <div className='container max-w-screen-md'>
          {user.username && (
            <div className='flex flex-row justify-start gap-2 space-y-1 p-3'>
              <UserInfo />
              <NewPostModal
                submitBtnText='작성'
                placeholder='무슨 이야기가 있나요?'
              />
            </div>
          )}
          <Tabs
            variant='solid'
            onSelectionChange={(e) => {
              setTab(e as TabType);
            }}
            className='mb-1.5'
          >
            <Tab key='feed' title='피드' />
            <Tab key='post' title='이야기' />
            <Tab key='artwork' title='작품' />
            <Tab key='exhibition' title='전시' />
          </Tabs>
          {isSuccessFeed &&
            tab === 'feed' &&
            feedData.pages.map((page) => {
              return (
                <FeedList data={page.feedItems} key={page.pageInfo.page} />
              );
            })}
          <div ref={bottom} className='mb-1 h-1'>
            <ObservationComponent />
          </div>
        </div>
      </div>
    </>
  );
}
