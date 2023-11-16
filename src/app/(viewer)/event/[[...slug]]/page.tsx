import { format } from 'date-fns';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { BiCalendar, BiShare, BiWon } from 'react-icons/bi';
import { BsInfoLg } from 'react-icons/bs';

import ASNextImage from '@/components/ASNextImage';
import MarkdownVewer from '@/components/MarkdownViewer';

import CalendarButton from '@/app/(viewer)/event/[[...slug]]/CalendarButton';
import EventEditDelete from '@/app/(viewer)/event/[[...slug]]/EventEditDelete';
import eventTypeToKO from '@/app/(viewer)/event/[[...slug]]/eventTypeToKO';
import SingleEventMedia from '@/app/(viewer)/event/[[...slug]]/SingleEventMedia';
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
export default async function Event({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const id = params.slug[0];
  const data = await fetchEvent(id);
  if (!data) throw new Error('Failed to fetch data');
  const scheduleId =
    Number(searchParams?.scheduleId) || data.eventSchedules[0].id;
  const thisSchedule = data.eventSchedules.filter(
    (ii) => ii.id === scheduleId
  )[0];
  const futureEvents = data.eventSchedules.filter((ii) => {
    if (ii.id === scheduleId) return;
    if (new Date(ii.eventDate + 'T' + ii.endTime) >= new Date()) return ii;
  });
  const previousEvents = data.eventSchedules.filter((ii) => {
    if (ii.id === scheduleId) return;
    if (new Date(ii.eventDate + 'T' + ii.endTime) < new Date()) return ii;
  });

  if (!data) throw new Error('Failed to fetch data');

  return (
    <div>
      <div className='flex flex-col-reverse justify-between md:flex-row'>
        <div className='flex flex-col items-start justify-start gap-1 px-3 py-2 pb-2 md:w-1/2'>
          <h1>{data.title}</h1>

          <h3>
            {format(new Date(thisSchedule.eventDate), 'yyyy년 MM월 dd일')}{' '}
            {thisSchedule.startTime} - {thisSchedule.endTime}
          </h3>
          <h3>
            {data.location.name} {thisSchedule.detailLocation}
          </h3>
          <div className='flex gap-1'>
            <div className='w-auto cursor-pointer rounded-lg border-2 bg-default-200 px-2 py-0.5 font-bold transition hover:bg-default-400'>
              {eventTypeToKO(data.eventType)}
            </div>
            <div className='flex w-auto cursor-pointer items-center gap-1 rounded-lg border-2 bg-default-200 px-2 py-0.5 font-bold transition hover:bg-default-400'>
              <BiWon />
              {data.price === 0 ? '무료' : data.price + '원'}
            </div>
          </div>
          <div className='p-3'>
            <MarkdownVewer content={data.description} />
          </div>

          <div className='mb-3'>
            <Link href={data.link} target='_blank'>
              <button className='flex items-center gap-1 hover:font-bold hover:underline'>
                <BsInfoLg size={20} />
                자세한 정보 보기
              </button>
            </Link>
            <CalendarButton
              className='flex items-center gap-1 hover:font-bold hover:underline'
              data={data}
              scheduleId={scheduleId}
            >
              <BiCalendar size={20} />
              캘린더에 추가하기
            </CalendarButton>
            <button className='flex items-center gap-1 hover:font-bold hover:underline'>
              <BiShare size={20} />
              공유하기
            </button>
          </div>

          <EventEditDelete authorUsername={data.author} eventId={data.id} />

          {data.medias && data.medias.length > 1 && (
            <SingleEventMedia feed={data} />
          )}

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
