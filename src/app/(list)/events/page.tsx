'use client';

import { Pagination, Spacer } from '@nextui-org/react';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
registerLocale('ko', ko);

import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker.scss';

import ASNextImage from '@/components/ASNextImage';

import jxios from '@/utils/jxios';

import { pageInfoType } from '@/types/default';
import { EventResponseType, EventViewType } from '@/types/event';

export default function Events() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, _b] = useState(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
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
      await jxios
        .get('/api/exhibitions', {
          params: {
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(endDate, 'yyyy-MM-dd'),
            page: page.page,
            size: 10,
            sortDirection: 'DESC',
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
        });
    fetch();
  }, [endDate, startDate, page.page]);

  return (
    <div className='py-3'>
      <DatePicker
        selected={startDate}
        onChange={(date: Date) => setStartDate(date as Date)}
        dateFormat='yyyy-MM-dd'
        locale='ko'
        className='mx-4 rounded-md border-2 border-gray-300 bg-default-100 px-3 py-2'
      />
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
                  <div
                    className='group ml-8 flex cursor-pointer flex-row justify-between bg-white group-hover:bg-default-100 md:ml-52'
                    key={exhibition.id}
                  >
                    <div>
                      <h3>{exhibition.title}</h3>
                      <h4>{exhibition.description}</h4>
                      <h5>
                        {new Date(exhibition.startDate).toLocaleString()} ~
                        {new Date(exhibition.endDate).toLocaleString()}
                      </h5>
                    </div>
                    <ASNextImage
                      src={exhibition.thumbnail.mediaUrl}
                      alt='thumbnail'
                      width={100}
                      height={100}
                    />
                  </div>
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
