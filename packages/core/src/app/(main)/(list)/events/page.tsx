'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { notFound } from 'next/dist/client/components/not-found';
import React, { useEffect, useRef, useState } from 'react';

import 'react-datepicker/dist/react-datepicker.css';

import FeedObservationComponent from '@/components/ObservationComponent';
import Title from '@/components/Title';

import EventListItem from '@/app/(main)/(list)/events/EventListItem';
import SkeletonEvent from '@/app/(main)/(list)/events/SkeletonEvent';
import jxios from '@/utils/jxios';

import { EventResponseType } from '@/types/event';

export default function Events() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const bottom = useRef(null);
  const LIMIT = 20;

  const fetchEvents = async (page: number) =>
    await jxios
      .get('/api/events', {
        params: {
          page: page,
          size: LIMIT,
          startDate: format(startDate, 'yyyy-MM-dd'),
          eventType: 'ALL',
          sortDirection: 'ASC',
        },
      })
      .then((res) => res.data as EventResponseType)
      .catch((err) => {
        throw Error(err);
      });

  const {
    data,
    isSuccess,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['events'],
    queryFn: async ({ pageParam }) => await fetchEvents(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage) {
        return null;
      } else {
        return lastPage.pageInfo.totalPages - lastPage.pageInfo.page > 0
          ? lastPage.pageInfo.page + 1
          : null;
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch, startDate]);

  useEffect(() => {
    if (isError) {
      notFound();
    }
  }, [isError]);

  return (
    <div>
      <Title title='Events' description='다양한 이벤트를 살펴보세요.'>
        <div></div>
      </Title>
      {!isLoading ? (
        <>
          <div className='grid grid-cols-1 lg:grid-cols-2'>
            {isSuccess &&
              data.pages.map((group) =>
                group.events.map((event) => (
                  <EventListItem event={event} key={event.id} />
                ))
              )}
          </div>
        </>
      ) : (
        <>
          <SkeletonEvent />
          <SkeletonEvent />
          <SkeletonEvent />
          <SkeletonEvent />
          <SkeletonEvent />
          <SkeletonEvent />
          <SkeletonEvent />
          <SkeletonEvent />
        </>
      )}
      {isFetchingNextPage && (
        <>
          <SkeletonEvent />
          <SkeletonEvent />
          <SkeletonEvent />
          <SkeletonEvent />
          <SkeletonEvent />
          <SkeletonEvent />
          <SkeletonEvent />
          <SkeletonEvent />
        </>
      )}
      {isSuccess && (
        <div ref={bottom}>
          <FeedObservationComponent
            hasNext={
              data.pages[data.pages.length - 1].pageInfo.page + 1 <
              data.pages[data.pages.length - 1].pageInfo.totalPages
            }
            hasData={Boolean(data)}
            fetchNextPage={fetchNextPage}
          />
        </div>
      )}
      {data && data.pages[0].events.length === 0 && (
        <h3 className='text-center'>아직 작성된 이벤트가 없습니다.</h3>
      )}
    </div>
  );
}
