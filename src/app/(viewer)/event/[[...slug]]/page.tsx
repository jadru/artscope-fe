import { format } from 'date-fns';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { BiCalendar, BiShare } from 'react-icons/bi';
import { BsInfoLg } from 'react-icons/bs';

import ASNextImage from '@/components/ASNextImage';
import MarkdownVewer from '@/components/MarkdownViewer';

import CalendarButton from '@/app/(viewer)/event/[[...slug]]/CalendarButton';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { EventDetailType, EventType } from '@/types/event';

const fetchEvent = async (id: string) =>
  jxios
    .get(NEXT_PUBLIC_API_URL + '/api/exhibitions/' + id)
    .then((res) => res.data as EventDetailType);

export async function generateMetadata(
  {
    params,
  }: {
    params: { slug: string[] };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.slug[0];
  const data = await fetchEvent(id);
  // const thumbnail = (await parent).openGraph?.images || [];
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: `${data.exhibitionList.title
      .replace(/<[^>]*>?/g, '')
      .slice(0, 20)} 이벤트 정보`,
    description: data.exhibitionList.description.replace(/<[^>]*>?/g, ''),
    openGraph: {
      title: `${data.exhibitionList.title.slice(0, 20)} 이벤트 | Artscope`,
      description: data.exhibitionList.description
        .replace(/<[^>]*>?/g, '')
        .slice(0, 100),
      url: 'https://www.artscope.kr/event/' + id,
      type: 'article',
      authors: [data.exhibitionList.author],
      images: [...previousImages],
    },
    publisher: data.exhibitionList.author,
  };
}
export default async function Event(
  {
    params,
  }: {
    params: { slug: string[] };
  },
  // eslint-disable-next-line
  parent: ResolvingMetadata
) {
  const id = params.slug[0];
  // eslint-disable-next-line
  const data = await fetchEvent(id);
  if (!data) throw new Error('Failed to fetch data');

  const EventTypeKO: {
    label: string;
    value: EventType;
  }[] = [
    {
      label: '전시',
      value: 'EXHIBITION',
    },
    {
      label: '강의',
      value: 'LECTURE',
    },
    {
      label: '워크샵',
      value: 'WORKSHOP',
    },
    {
      label: '스페셜 이벤트',
      value: 'SPECIAL',
    },
    {
      label: '콘서트',
      value: 'CONCERT',
    },
    {
      label: '기타',
      value: 'STANDARD',
    },
  ];

  return (
    <div>
      <div className='flex flex-col-reverse justify-between md:flex-row'>
        <div className='flex flex-col items-start justify-start gap-1 px-3 py-2 pb-2 md:w-1/2'>
          <h1>{data.exhibitionList.title}</h1>

          <h3>
            {format(
              new Date(data.exhibitionList.eventSchedule[0].eventDate),
              'yyyy년 MM월 dd일'
            )}{' '}
            {data.exhibitionList.eventSchedule[0].startTime} -
            {data.exhibitionList.eventSchedule[0].endTime}
          </h3>
          <h3>{data.location.name}</h3>
          <div className='w-auto cursor-pointer rounded-lg border-2 bg-default-200 px-2 py-0.5 font-bold transition hover:bg-default-400'>
            {EventTypeKO.find((e) => e.value === data.exhibitionList.eventType)
              ?.label || '기타'}{' '}
            {data.exhibitionList.eventType}
          </div>
          <MarkdownVewer content={data.exhibitionList.description} />
          <hr />
          <Link href={data.exhibitionList.link} target='_blank'>
            <button className='flex items-center gap-1 hover:font-bold hover:underline'>
              <BsInfoLg size={20} />
              자세한 정보 보기
            </button>
          </Link>
          <CalendarButton
            className='flex items-center gap-1 hover:font-bold hover:underline'
            data={data}
          >
            <BiCalendar size={20} />
            캘린더에 추가하기
          </CalendarButton>
          <button className='flex items-center gap-1 hover:font-bold hover:underline'>
            <BiShare size={20} />
            공유하기
          </button>
        </div>
        {data.exhibitionList.thumbnail?.mediaUrl && (
          <ASNextImage
            src={data.exhibitionList.thumbnail.mediaUrl}
            alt='thumbnail'
            className='w-full md:w-1/2'
            width={400}
            height={400}
          />
        )}
      </div>
    </div>
  );
}
