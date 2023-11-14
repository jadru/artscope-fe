import { format } from 'date-fns';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { BiCalendar, BiShare } from 'react-icons/bi';
import { BsInfoLg } from 'react-icons/bs';

import ASNextImage from '@/components/ASNextImage';
import MarkdownVewer from '@/components/MarkdownViewer';

import CalendarButton from '@/app/(viewer)/event/[[...slug]]/CalendarButton';
import eventTypeToKO from '@/app/(viewer)/event/[[...slug]]/eventTypeToKO';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { EventDetailType } from '@/types/event';

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
    title: `${data.title.replace(/<[^>]*>?/g, '').slice(0, 20)} 정보`,
    description: data.description.replace(/<[^>]*>?/g, ''),
    openGraph: {
      title: `${data.title.slice(0, 20)} 이벤트 | Artscope`,
      description: data.description.replace(/<[^>]*>?/g, '').slice(0, 100),
      url: 'https://www.artscope.kr/event/' + id,
      type: 'article',
      authors: [data.author],
      images: [...previousImages],
    },
    publisher: data.author,
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

  const data = await fetchEvent(id);
  const futureEvents = data.eventSchedules.filter((ii) => {
    if (new Date(ii.eventDate + 'T' + ii.endTime) >= new Date()) return ii;
  });
  const previousEvents = data.eventSchedules.filter((ii) => {
    if (new Date(ii.eventDate + 'T' + ii.endTime) < new Date()) return ii;
  });

  if (!data) throw new Error('Failed to fetch data');

  // TODO 이벤트 scheduleId로 페이지 접근시 문제 해결
  return (
    <div>
      <div className='flex flex-col-reverse justify-between md:flex-row'>
        <div className='flex flex-col items-start justify-start gap-1 px-3 py-2 pb-2 md:w-1/2'>
          <h1>{data.title}</h1>

          <h3>
            {format(
              new Date(data.eventSchedules[0].eventDate),
              'yyyy년 MM월 dd일'
            )}{' '}
            {data.eventSchedules[0].startTime} -{data.eventSchedules[0].endTime}
          </h3>
          <h3>{data.location.name}</h3>
          <div className='w-auto cursor-pointer rounded-lg border-2 bg-default-200 px-2 py-0.5 font-bold transition hover:bg-default-400'>
            {eventTypeToKO(data.eventType)}
          </div>
          <MarkdownVewer content={data.description} />

          <div className='my-3'>
            <Link href={data.link} target='_blank'>
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

          <div>
            {futureEvents &&
              futureEvents.map((schedule) => (
                <div key={schedule.id} className='flex flex-col py-3'>
                  <h3>
                    {format(new Date(schedule.eventDate), 'yyyy년 MM월 dd일')}{' '}
                    {schedule.startTime} - {schedule.endTime}
                  </h3>
                  <h4 className='font-normal text-default-700'>
                    {data.location.name} {schedule.detailLocation}
                  </h4>
                </div>
              ))}
          </div>

          <div>
            {previousEvents &&
              previousEvents.map((schedule) => (
                <div
                  key={schedule.id}
                  className='flex flex-col py-3 text-default-400'
                >
                  <h3>
                    {format(new Date(schedule.eventDate), 'yyyy년 MM월 dd일')}{' '}
                    {schedule.startTime} - {schedule.endTime}
                  </h3>
                  <h4 className='font-normal text-default-700'>
                    {data.location.name} {schedule.detailLocation}
                  </h4>
                </div>
              ))}
          </div>
        </div>
        {data.thumbnail?.mediaUrl && (
          <ASNextImage
            src={data.thumbnail.mediaUrl}
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
