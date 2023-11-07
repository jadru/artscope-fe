'use client';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Pagination, Spacer } from '@nextui-org/react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';

import 'react-datepicker/dist/react-datepicker.css';

import Title from '@/components/Title';

import EventListItem from '@/app/(list)/events/EventListItem';
import jxios from '@/utils/jxios';

import { pageInfoType } from '@/types/default';
import { EventResponseType, EventViewType } from '@/types/event';

export default function Events() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 100)
  );
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
      endDate &&
      (await jxios
        .get('/api/exhibitions', {
          params: {
            page: page.page,
            size: 10,
            sortDirection: 'DESC',
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(endDate, 'yyyy-MM-dd'),
            eventType: 'ALL',
          },
        })
        .then((res) => {
          const eventDatas = res.data as EventResponseType;
          const events = [] as EventViewType;
          eventDatas.exhibitions.length > 0 &&
            eventDatas.exhibitions.forEach((event) => {
              const date = format(new Date(event.startDate), 'yyyy-MM-dd');
              if (events.find((ii) => ii.date === date, 'yyyy-MM-dd')) {
                events.forEach((ii) => {
                  if (
                    ii.date === format(new Date(event.startDate), 'yyyy-MM-dd')
                  ) {
                    ii.event.push(event);
                  }
                });
              } else {
                events.push({
                  event: [event],
                  date: format(new Date(event.startDate), 'yyyy-MM-dd'),
                });
              }
            });
          setData(events);
          setPage(eventDatas.pageInfo);
        }));
    fetch();
  }, [startDate, page.page, endDate]);

  useEffect(() => {
    if (!startDate || !endDate) return;
    if (startDate > endDate)
      setEndDate(new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 30));
  }, [endDate, startDate]);

  return (
    <div>
      <Title title='Events' description='다양한 이벤트를 살펴보세요.' />
      <div className='mt-3 flex flex-col justify-center gap-2 md:flex-row'>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
          <DatePicker
            label='시작일'
            value={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </LocalizationProvider>
      </div>
      <Spacer y={5} />
      <div className='relative mx-4'>
        {data.map((date) => (
          <div className='' key={date.date}>
            <h2 className='sticky top-16 bg-white py-1 text-3xl md:bg-transparent'>
              {date.date}
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
    </div>
  );
}
