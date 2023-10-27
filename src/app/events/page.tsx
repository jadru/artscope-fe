'use client';

import { Pagination, Spacer } from '@nextui-org/react';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
registerLocale('ko', ko);

import 'react-datepicker/dist/react-datepicker.css';

import ASNextImage from '@/components/ASNextImage';
import RootLayout from '@/components/RootLayout';
import Title from '@/components/Title';

import jxios from '@/utils/jxios';

type exhibitionType = {
  id: number;
  title: string;
  description: string;
  thumbnail: {
    mediaType: 'image' | 'video';
    mediaUrl: string;
  };
  link: string;
  startDate: Date;
  endDate: Date;
  createdTime: Date;
  updatedTime: Date | null;
  author: string;
};

export default function Events() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, _b] = useState(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
  );
  const [titleDate, _a] = useState<string[]>([]);
  const [data, setData] = useState<exhibitionType[]>([]);

  useEffect(() => {
    const fetchEvents = async () =>
      await jxios
        .get('/api/exhibitions', {
          params: {
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(endDate, 'yyyy-MM-dd'),
            page: 0,
            size: 100,
            sortDirection: 'DESC',
          },
        })
        .then((res) => res.data);
    fetchEvents().then((res) => setData(res));
  }, [endDate, startDate]);

  return (
    <RootLayout>
      <Title>전시 일정</Title>
      <DatePicker
        selected={startDate}
        onChange={(date: Date) => setStartDate(date as Date)}
        dateFormat='yyyy-MM-dd'
        locale='ko'
        className='mx-4 rounded-md border-2 border-gray-300 bg-default-100 px-3 py-2'
      />
      <Spacer y={5} />
      <div className='relative mx-4'>
        {titleDate.map((date) => (
          <div className='' key={date}>
            <h2 className='sticky top-24 text-3xl'>{date}</h2>
            <div className='flex flex-col space-y-1'>
              {data
                .filter(
                  (event) =>
                    new Date(event.startDate).toLocaleString('ko-KR', {
                      dateStyle: 'long',
                    }) === date
                )
                .map((exhibition) => (
                  <div
                    className='group ml-52 flex cursor-pointer flex-row justify-between bg-white group-hover:bg-default-100'
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
        <Pagination total={10} className='self-center' />
      </div>
    </RootLayout>
  );
}
