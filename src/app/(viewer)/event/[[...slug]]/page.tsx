import { format } from 'date-fns';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiCalendar, BiPlus, BiWon } from 'react-icons/bi';
import { BsInfoLg, BsMap } from 'react-icons/bs';

import ASNextImage from '@/components/ASNextImage';
import MarkdownViewer from '@/components/MarkdownViewer';

import CalendarButton from '@/app/(viewer)/event/[[...slug]]/CalendarButton';
import EventEditDelete from '@/app/(viewer)/event/[[...slug]]/EventEditDelete';
import eventTypeToKO from '@/app/(viewer)/event/[[...slug]]/eventTypeToKO';
import LocationButton from '@/app/(viewer)/event/[[...slug]]/LocationButton';
import ScheduleAddButton from '@/app/(viewer)/event/[[...slug]]/ScheduleAddButton';
import SchduleDeleteButton from '@/app/(viewer)/event/[[...slug]]/ScheduleDeleteButton';
import ShareButton from '@/app/(viewer)/event/[[...slug]]/ShareButton';
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
  const thisSchedule =
    data.eventSchedules.filter((ii) => ii.id === scheduleId)[0] ??
    data.eventSchedules[0];
  const isSameDaySchedule =
    format(new Date(thisSchedule.startDateTime), 'yyyy-MM-dd') ===
    format(new Date(thisSchedule.endDateTime), 'yyyy-MM-dd');
  const futureEvents = data.eventSchedules.filter((ii) => {
    if (new Date(ii.endDateTime) >= new Date()) return ii;
  });
  const previousEvents = data.eventSchedules.filter((ii) => {
    if (new Date(ii.endDateTime) < new Date()) return ii;
  });
  const [startDate, endDate] = data.eventSchedules.reduce(
    (acc, cur) => {
      if (new Date(cur.startDateTime) < new Date(acc[0]))
        acc[0] = format(new Date(cur.startDateTime), 'yyyy-MM-dd');
      if (new Date(cur.endDateTime) > new Date(acc[1]))
        acc[1] = format(new Date(cur.endDateTime), 'yyyy-MM-dd');
      return acc;
    },
    [
      format(new Date(data.eventSchedules[0].startDateTime), 'yyyy-MM-dd'),
      format(new Date(data.eventSchedules[0].endDateTime), 'yyyy-MM-dd'),
    ]
  );

  if (!data) throw new Error('Failed to fetch data');

  return (
    <div>
      <div className='flex flex-col-reverse justify-between md:flex-row'>
        <div className='flex flex-col items-start justify-start gap-2 px-3 py-2 pb-2 md:w-1/2'>
          <h1 className='break-keep text-[2.3rem] font-normal'>{data.title}</h1>

          <h3>
            {format(
              new Date(thisSchedule.startDateTime),
              'yyyy년 MM월 dd일 HH:mm'
            )}{' '}
            -{' '}
            {format(
              new Date(thisSchedule.endDateTime),
              isSameDaySchedule ? 'HH:mm' : 'yyyy년 MM월 dd일 HH:mm'
            )}
          </h3>
          <div>
            <h4>
              {data.location.snsUrl ? (
                <Link href={data.location.snsUrl} className='hover:underline'>
                  {data.location.name}
                </Link>
              ) : (
                data.location.name
              )}
              {' ' + thisSchedule.detailLocation}
            </h4>
            <h4 className='font-normal'>{data.location.address}</h4>
          </div>
          <div className='flex gap-1'>
            <div className='w-auto cursor-pointer rounded-lg border-2 bg-default-200 px-2 py-0.5 font-bold transition hover:bg-default-400'>
              {eventTypeToKO(data.eventType)}
            </div>
            <div className='flex w-auto cursor-pointer items-center gap-1 rounded-lg border-2 bg-default-200 px-2 py-0.5 font-bold transition hover:bg-default-400'>
              <BiWon />
              {data.price === 0 ? '무료' : data.price + '원'}
            </div>
          </div>
          <div className='py-2'>
            <MarkdownViewer>{data.description}</MarkdownViewer>
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
              scheduleid={scheduleId}
            >
              <BiCalendar size={20} />
              캘린더에 추가
            </CalendarButton>
            <ShareButton
              id={data.id}
              scheduleId={scheduleId}
              title={data.title}
            />
            <LocationButton
              location={data.location}
              className='flex items-center gap-1 hover:font-bold hover:underline md:hidden'
            >
              <BsMap size={20} />
              네이버 지도 보기
            </LocationButton>
          </div>

          <EventEditDelete authorUsername={data.author} eventId={data.id} />

          {data.medias && data.medias.length > 2 && (
            <SingleEventMedia feed={data} />
          )}
        </div>
        {data.thumbnail?.mediaUrl && (
          <ASNextImage
            src={data.thumbnail.mediaUrl}
            alt='thumbnail'
            className='h-fit w-full md:w-1/2'
            width={400}
            height={400}
          />
        )}
      </div>
      <div className='my-2 w-full px-2.5 py-2'>
        <h2 className='flex gap-2 py-4'>
          {startDate === endDate
            ? startDate
            : startDate + (endDate ? ' - ' + endDate : '')}{' '}
          <ScheduleAddButton
            eventid={data.id}
            eventAuthorUsername={data.author}
            className='flex items-center gap-1 text-lg hover:font-bold hover:underline'
          >
            <BiPlus size={20} />
            스케줄 추가
          </ScheduleAddButton>
        </h2>
        {futureEvents &&
          futureEvents.map((schedule) => (
            <div className='flex' key={schedule.id}>
              <div className='flex w-1/2 flex-col py-3 md:w-3/4'>
                <h3>
                  {format(
                    new Date(schedule.startDateTime),
                    'yyyy년 MM월 dd일 HH:mm'
                  )}{' '}
                  -{' '}
                  {format(
                    new Date(schedule.endDateTime),
                    format(new Date(schedule.startDateTime), 'yyyy-MM-dd') ===
                      format(new Date(schedule.endDateTime), 'yyyy-MM-dd')
                      ? 'HH:mm'
                      : 'yyyy년 MM월 dd일 HH:mm'
                  )}
                </h3>
                <h4 className='font-normal text-default-700'>
                  {data.location.name} {schedule.detailLocation}
                </h4>
              </div>
              <div className='flex w-1/2 items-center justify-end gap-2 md:w-1/4'>
                <SchduleDeleteButton
                  className='flex items-center gap-1 hover:font-bold hover:underline'
                  scheduleid={schedule.id}
                  eventAuthorUsername={data.author}
                  eventid={data.id}
                >
                  <AiOutlineDelete size={20} />
                  삭제
                </SchduleDeleteButton>
                <CalendarButton
                  data={data}
                  scheduleid={schedule.id}
                  className='flex items-center gap-1 hover:font-bold hover:underline'
                >
                  <BiCalendar size={20} />
                  캘린더에 추가
                </CalendarButton>
              </div>
            </div>
          ))}
        {previousEvents &&
          previousEvents.map((schedule) => (
            <div
              key={schedule.id}
              className='flex flex-col py-3 text-default-400'
            >
              <h3>
                {format(
                  new Date(schedule.startDateTime),
                  'yyyy년 MM월 dd일 HH:mm'
                )}{' '}
                -{' '}
                {format(
                  new Date(schedule.endDateTime),
                  format(new Date(schedule.startDateTime), 'yyyy-MM-dd') ===
                    format(new Date(schedule.endDateTime), 'yyyy-MM-dd')
                    ? 'HH:mm'
                    : 'yyyy년 MM월 dd일 HH:mm'
                )}
              </h3>
              <h4 className='font-normal text-default-700'>
                {data.location.name} {schedule.detailLocation}
              </h4>
            </div>
          ))}
      </div>
    </div>
  );
}
