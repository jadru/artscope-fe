'use client';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useInfiniteQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { notFound } from 'next/dist/client/components/not-found';
import React, { useEffect, useRef, useState } from 'react';

import 'react-datepicker/dist/react-datepicker.css';

import FeedObservationComponent from '@/components/ObservationComponent';
import Title from '@/components/Title';

import EventListItem from '@/app/(main)/(list)/events/EventListItem';
import SkeletonEvent from '@/app/(main)/(list)/events/SkeletonEvent';
import jxios from '@/utils/jxios';

import { pageInfoType } from '@/types/default';
import { EventResponseType, EventViewType } from '@/types/event';

export default function Events() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const bottom = useRef(null);
  const LIMIT = 20;

  const fetchEvents = async (page: number) =>
    await jxios
      .get('/api/exhibitions', {
        params: {
          page: page,
          size: LIMIT,
          startDate: format(startDate, 'yyyy-MM-dd'),
          eventType: 'ALL',
        },
      })
      .then(
        (
          res
        ): {
          pageInfo: pageInfoType;
          exhibitions: EventViewType[];
        } => {
          const eventDatas = res.data as EventResponseType;
          const events = [] as EventViewType[];
          eventDatas.exhibitions.length > 0 &&
            eventDatas.exhibitions.forEach((event) => {
              if (
                events.find(
                  (ii) =>
                    ii.date ===
                    format(
                      new Date(event.eventSchedule.startDateTime),
                      'yyyy-MM-dd'
                    )
                )
              ) {
                events.forEach((ii) => {
                  if (
                    ii.date ===
                    format(
                      new Date(event.eventSchedule.startDateTime),
                      'yyyy-MM-dd'
                    )
                  ) {
                    ii.event.push(event);
                  }
                });
              } else {
                events.push({
                  event: [event],
                  dayOfWeek: '',
                  dayOfWeekKor: '',
                  date: format(
                    new Date(event.eventSchedule.startDateTime),
                    'yyyy-MM-dd'
                  ),
                });
              }
            });

          return {
            pageInfo: res.data.pageInfo as pageInfoType,
            exhibitions: events.map((event) => {
              return {
                date: format(new Date(event.date), 'MMM do'),
                dayOfWeek: format(new Date(event.date), 'EEE'),
                dayOfWeekKor: format(new Date(event.date), 'EEE', {
                  locale: ko,
                }),
                event: event.event,
              };
            }),
          };
        }
      )
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
        <div className='mt-3 flex flex-col justify-start gap-2 px-3 md:flex-row'>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
            <DatePicker
              label='시작일'
              value={startDate}
              onChange={(date) => setStartDate(date ?? new Date())}
            />
          </LocalizationProvider>
        </div>
      </Title>
      {!isLoading ? (
        <>
          <div className='relative mx-3 space-y-3 md:mx-1'>
            {isSuccess &&
              data.pages.map((group) =>
                group.exhibitions.map((date) => (
                  <div
                    className='relative flex flex-col md:flex-row'
                    key={date.date}
                  >
                    <div className='flex w-28 flex-col items-start gap-0 self-start bg-transparent pt-2 md:sticky md:top-16'>
                      <h2 className='py-1 text-[1.4rem]'>{date.date}</h2>
                      <span className='text-default-500 text-[1.2rem]'>
                        {date.dayOfWeek} / {date.dayOfWeekKor}요일
                      </span>
                    </div>
                    <div className='ml-1 flex w-full flex-col gap-3 py-1.5 md:w-[calc(100%-7rem)]'>
                      {date.event &&
                        date.event.map((exhibition) => (
                          <EventListItem
                            event={exhibition}
                            key={exhibition.id}
                          />
                        ))}
                    </div>
                  </div>
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
      {data && data.pages[0].exhibitions.length === 0 && (
        <h3 className='text-center'>아직 작성된 이벤트가 없습니다.</h3>
      )}
    </div>
  );
}
