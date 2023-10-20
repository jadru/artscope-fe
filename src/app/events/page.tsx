'use client';

import { Pagination, Spacer } from '@nextui-org/react';
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

const MockData: exhibitionType[] = [
  {
    id: 1,
    title: '전시 1',
    description: '전시 1 설명',
    thumbnail: {
      mediaType: 'image',
      mediaUrl: 'https://picsum.photos/200',
    },
    link: 'https://google.com',
    startDate: new Date(),
    endDate: new Date(),
    createdTime: new Date(),
    updatedTime: new Date(),
    author: 'test',
  },
  {
    id: 2,
    title: '전시 2',
    description: '전시 2 설명',
    thumbnail: {
      mediaType: 'image',
      mediaUrl: 'https://picsum.photos/200',
    },
    link: 'https://google.com',
    startDate: new Date(),
    endDate: new Date(),
    createdTime: new Date(),
    updatedTime: new Date(),
    author: 'test',
  },
  {
    id: 3,
    title: `전시 3`,
    description: `전시 3} 설명`,
    thumbnail: {
      mediaType: 'image',
      mediaUrl: 'https://picsum.photos/200',
    },
    link: 'https://google.com',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    createdTime: new Date(),
    updatedTime: new Date(),
    author: 'test',
  },
  {
    id: 3,
    title: `전시 3`,
    description: `전시 3} 설명`,
    thumbnail: {
      mediaType: 'image',
      mediaUrl: 'https://picsum.photos/200',
    },
    link: 'https://google.com',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    createdTime: new Date(),
    updatedTime: new Date(),
    author: 'test',
  },
  {
    id: 3,
    title: `전시 3`,
    description: `전시 3} 설명`,
    thumbnail: {
      mediaType: 'image',
      mediaUrl: 'https://picsum.photos/200',
    },
    link: 'https://google.com',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    createdTime: new Date(),
    updatedTime: new Date(),
    author: 'test',
  },
  {
    id: 3,
    title: `전시 3`,
    description: `전시 3} 설명`,
    thumbnail: {
      mediaType: 'image',
      mediaUrl: 'https://picsum.photos/200',
    },
    link: 'https://google.com',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    createdTime: new Date(),
    updatedTime: new Date(),
    author: 'test',
  },
  {
    id: 4,
    title: `전시 4`,
    description: `전시 4 설명`,
    thumbnail: {
      mediaType: 'image',
      mediaUrl: 'https://picsum.photos/200',
    },
    link: 'https://google.com',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 17),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 17),
    createdTime: new Date(),
    updatedTime: new Date(),
    author: 'test',
  },
  {
    id: 4,
    title: `전시 4`,
    description: `전시 4 설명`,
    thumbnail: {
      mediaType: 'image',
      mediaUrl: 'https://picsum.photos/200',
    },
    link: 'https://google.com',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 17),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 17),
    createdTime: new Date(),
    updatedTime: new Date(),
    author: 'test',
  },
  {
    id: 4,
    title: `전시 4`,
    description: `전시 4 설명`,
    thumbnail: {
      mediaType: 'image',
      mediaUrl: 'https://picsum.photos/200',
    },
    link: 'https://google.com',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 17),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 17),
    createdTime: new Date(),
    updatedTime: new Date(),
    author: 'test',
  },
  {
    id: 4,
    title: `전시 4`,
    description: `전시 4 설명`,
    thumbnail: {
      mediaType: 'image',
      mediaUrl: 'https://picsum.photos/200',
    },
    link: 'https://google.com',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 17),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 17),
    createdTime: new Date(),
    updatedTime: new Date(),
    author: 'test',
  },
  {
    id: 4,
    title: `전시 4`,
    description: `전시 4 설명`,
    thumbnail: {
      mediaType: 'image',
      mediaUrl: 'https://picsum.photos/200',
    },
    link: 'https://google.com',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 17),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 17),
    createdTime: new Date(),
    updatedTime: new Date(),
    author: 'test',
  },
  {
    id: 4,
    title: `전시 4`,
    description: `전시 4 설명`,
    thumbnail: {
      mediaType: 'image',
      mediaUrl: 'https://picsum.photos/200',
    },
    link: 'https://google.com',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 17),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 17),
    createdTime: new Date(),
    updatedTime: new Date(),
    author: 'test',
  },
];

export default function Events() {
  const [startDate, setStartDate] = useState(new Date());
  const [titleDate, setTitleDate] = useState<string[]>([]);
  const [_, setData] = useState<exhibitionType[]>([]);

  const fetchEvents = async () =>
    await jxios.get('/api/exhibitions').then((res) => res.data);

  useEffect(() => {
    fetchEvents().then((res) => setData(res));
  }, []);

  useEffect(() => {
    const temp = MockData.map((exhibition) => {
      if (new Date(exhibition.startDate) < startDate) return;
      return new Date(exhibition.startDate).toLocaleString('ko-KR', {
        dateStyle: 'long',
      });
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setTitleDate([...new Set(temp)]);
  }, [startDate]);

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
              {MockData.filter(
                (event) =>
                  new Date(event.startDate).toLocaleString('ko-KR', {
                    dateStyle: 'long',
                  }) === date
              ).map((exhibition) => (
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
