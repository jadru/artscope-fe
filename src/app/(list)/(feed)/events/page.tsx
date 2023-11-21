'use client';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Pagination } from '@nextui-org/react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';

import 'react-datepicker/dist/react-datepicker.css';

import Loading from '@/components/Loading';
import Title from '@/components/Title';

import EventListItem from '@/app/(list)/(feed)/events/EventListItem';
import jxios from '@/utils/jxios';

import { pageInfoType } from '@/types/default';
import { EventResponseType, EventViewType } from '@/types/event';

// TODO: Placeholder Skeleton & 무한스크롤 도입

export default function Events() {
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [data, setData] = useState<EventViewType>([]);
  const [page, setPage] = useState<pageInfoType>({
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 0,
  });

  useEffect(() => {
    const fetch = async () =>
      startDate &&
      (await jxios
        .get('/api/exhibitions', {
          params: {
            page: page.page,
            size: 20,
            startDate: format(startDate, 'yyyy-MM-dd'),
            eventType: 'ALL',
          },
        })
        .then((res) => {
          const eventDatas = res.data as EventResponseType;
          const events = [] as EventViewType;
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
          setData(
            events.map((event) => {
              return {
                date: format(new Date(event.date), 'MMM do'),
                dayOfWeek: format(new Date(event.date), 'EEE'),
                dayOfWeekKor: format(new Date(event.date), 'EEE', {
                  locale: ko,
                }),
                event: event.event,
              };
            })
          );
          setPage(eventDatas.pageInfo);
          setIsLoading(false);
        }));
    fetch();
  }, [startDate, page.page]);

  return (
    <div>
      <Title title='Events' description='다양한 이벤트를 살펴보세요.'>
        <div className='mt-3 flex flex-col justify-start gap-2 px-3 md:flex-row'>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
            <DatePicker
              label='시작일'
              value={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </LocalizationProvider>
        </div>
      </Title>
      {!isLoading ? (
        <>
          <div className='relative mx-3 space-y-3 md:mx-1'>
            {data &&
              data.map((date) => (
                <div
                  className='relative flex flex-col md:flex-row'
                  key={date.date}
                >
                  <div className='flex w-28 flex-col items-start gap-0 self-start bg-transparent pt-2 md:sticky md:top-16'>
                    <h2 className='py-1 text-[1.4rem]'>{date.date}</h2>
                    <span className='text-[1.2rem] text-default-500'>
                      {date.dayOfWeek} / {date.dayOfWeekKor}요일
                    </span>
                  </div>
                  <div className='ml-1 flex w-full flex-col gap-3 py-1.5 md:w-[calc(100%-7rem)]'>
                    {date.event &&
                      date.event.map((exhibition) => (
                        <EventListItem event={exhibition} key={exhibition.id} />
                      ))}
                  </div>
                </div>
              ))}
            {page.totalPages > 1 && (
              <div className='flex items-center justify-center py-3'>
                <Pagination
                  total={page.totalPages}
                  className='self-center'
                  onChange={(value) =>
                    setPage((prev) => {
                      return { ...prev, page: value - 1 };
                    })
                  }
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
