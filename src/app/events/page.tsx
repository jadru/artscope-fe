'use client';

import { Pagination } from '@nextui-org/react';
import { useEffect, useState } from 'react';

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

export default function Exhibitions() {
  const [data, setData] = useState<exhibitionType[]>([]);

  const fetchExhibition = async () =>
    await jxios.get('/api/exhibitions').then((res) => res.data);
  useEffect(() => {
    fetchExhibition().then((res) => setData(res));
  }, []);
  return (
    <RootLayout>
      <Title>전시 일정</Title>
      <div>
        {data.map((exhibition) => (
          <div
            className='group flex cursor-pointer flex-row justify-between group-hover:bg-amber-100'
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
      <Pagination total={10} className='self-center' />
    </RootLayout>
  );
}
