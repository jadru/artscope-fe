'use client';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Pagination, Spacer } from '@nextui-org/react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';

import 'react-datepicker/dist/react-datepicker.css';

import Loading from '@/components/Loading';
import Title from '@/components/Title';

import EventListItem from '@/app/(list)/events/EventListItem';
import jxios from '@/utils/jxios';

import { pageInfoType } from '@/types/default';
import { EventResponseType, EventViewType } from '@/types/event';

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
            size: 15,
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
                events.find((ii) => ii.date === event.eventSchedule.eventDate)
              ) {
                events.forEach((ii) => {
                  if (ii.date === event.eventSchedule.eventDate) {
                    ii.event.push(event);
                  }
                });
              } else {
                events.push({
                  event: [event],
                  date: event.eventSchedule.eventDate,
                });
              }
            });
          setData(events);
          setPage(eventDatas.pageInfo);
          setIsLoading(false);
        }));
    fetch();
  }, [startDate, page.page]);

  return (
    <div>
      <Title title='Events' description='다양한 이벤트를 살펴보세요.' />
      {!isLoading ? (
        <>
          <div className='mt-3 flex flex-col justify-start gap-2 px-3 md:flex-row'>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={ko}
            >
              <DatePicker
                label='시작일'
                value={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </LocalizationProvider>
          </div>
          <Spacer y={5} />
          <div className='relative mx-4'>
            {data &&
              data.map((date) => (
                <div className='' key={date.date}>
                  <h2 className='sticky top-16 bg-white py-1 text-3xl md:bg-transparent'>
                    {format(new Date(date.date), 'yyyy년 MM월 dd일')}
                  </h2>
                  <div className='flex flex-col space-y-1'>
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
