import { format } from 'date-fns';
import lodash from 'lodash';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiCalendar, BiPlus, BiWon } from 'react-icons/bi';
import { BsInfoLg, BsMap } from 'react-icons/bs';

import MarkdownViewer from '@/components/MarkdownViewer';
import MediaSlider from '@/components/MediaSlider';
import ProfileComponent from '@/components/Profile';
import StandardLabel, { standardLabel } from '@/components/StandardLabel';

import CalendarButton from '@/app/(main)/(viewer)/event/[[...slug]]/CalendarButton';
import EventEditDelete from '@/app/(main)/(viewer)/event/[[...slug]]/EventEditDelete';
import eventTypeToKO from '@/app/(main)/(viewer)/event/[[...slug]]/eventTypeToKO';
import LocationButton from '@/app/(main)/(viewer)/event/[[...slug]]/LocationButton';
import ScheduleAddButton from '@/app/(main)/(viewer)/event/[[...slug]]/ScheduleAddButton';
import SchduleDeleteButton from '@/app/(main)/(viewer)/event/[[...slug]]/ScheduleDeleteButton';
import ShareButton from '@/app/(main)/(viewer)/event/[[...slug]]/ShareButton';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';
import { editAndPostTimeCalculatorKO } from '@/utils/timeCalculator';

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
  if (!params.slug) redirect('/events');
  const id = params.slug[0];
  const data = await fetchEvent(id);
  // const thumbnail = (await parent).openGraph?.images || [];
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: `${lodash
      .unescape(data.title.replace(/<[^>]*>?/g, ''))
      .slice(0, 20)}`,
    description: data.description.replace(/<[^>]*>?/g, ''),
    openGraph: {
      title: `${standardLabel(data.title).slice(0, 20)} 이벤트 | Artscope`,
      description: standardLabel(data.description).slice(0, 100),
      url: 'https://www.artscope.kr/event/' + id,
      type: 'article',
      authors: [standardLabel(data.authorName)],
      images: [...previousImages],
    },
    publisher: 'Artscope',
  };
}
export default async function Event({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  if (!params.slug) redirect('/events');
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
    <div className='flex w-full flex-col items-stretch gap-2 px-3 py-2 pb-2 md:px-0'>
      <h1 className='break-keep text-[2.3rem] font-normal'>
        <StandardLabel label={data.title} />
      </h1>

      <h3>
        {format(new Date(thisSchedule.startDateTime), 'yyyy년 MM월 dd일 HH:mm')}{' '}
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
              {standardLabel(data.location.name)}
            </Link>
          ) : (
            standardLabel(data.location.name)
          )}
          {' ' + standardLabel(thisSchedule.detailLocation)}
        </h4>
        <h4 className='font-normal'>{data.location.address}</h4>
      </div>
      <div className='flex gap-1'>
        <div className='bg-default-200 hover:bg-default-400 w-auto cursor-pointer rounded-lg border-2 px-2 py-0.5 font-bold transition'>
          {eventTypeToKO(data.eventType)}
        </div>
        <div className='bg-default-200 hover:bg-default-400 flex w-auto cursor-pointer items-center gap-1 rounded-lg border-2 px-2 py-0.5 font-bold transition'>
          <BiWon />
          {data.price === 0 ? '무료' : data.price + '원'}
        </div>
      </div>
      {data.medias && data.medias.length > 0 && (
        <MediaSlider medias={data.medias} />
      )}
      <div className='bg-default-100 w-full rounded-xl px-3 py-3'>
        <MarkdownViewer>{data.description}</MarkdownViewer>
      </div>

      <p className='text-default-500 w-full px-2.5 text-right font-normal'>
        {editAndPostTimeCalculatorKO(data.createdTime, data.updatedTime)}
      </p>

      <ProfileComponent
        username={data.authorUserName}
        name={data.authorName}
        picture={data.authorProfileImage}
      />

      <div className='w-full space-y-2 rounded-xl border-2 px-3 py-3'>
        <h3 className='font-normal'>일정 관리</h3>
        <div>
          <Link href={data.link} target='_blank'>
            <button className='flex items-center gap-1 hover:font-bold hover:underline'>
              <BsInfoLg size={20} />
              자세한 정보 보기
            </button>
          </Link>
          <CalendarButton
            className='flex items-center gap-1 hover:font-bold hover:underline'
            data={data}
            scheduleid={scheduleId}>
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
            className='flex items-center gap-1 hover:font-bold hover:underline md:hidden'>
            <BsMap size={20} />
            네이버 지도 보기
          </LocationButton>
        </div>
        <hr />

        <EventEditDelete
          authorUsername={data.authorUserName}
          eventId={data.id}
        />
        <h3 className='font-normal'>전체 일정</h3>
        <h4 className='flex gap-2'>
          {startDate === endDate
            ? startDate
            : startDate + (endDate ? ' - ' + endDate : '')}{' '}
          <ScheduleAddButton
            eventid={data.id}
            eventAuthorUsername={data.authorUserName}
            className='flex items-center gap-1 text-lg hover:font-bold hover:underline'>
            <BiPlus size={20} />
            스케줄 추가
          </ScheduleAddButton>
        </h4>

        <hr />

        <div>
          <h3 className='font-normal'>상세 일정</h3>
          {futureEvents &&
            futureEvents.map((schedule) => (
              <div className='flex' key={schedule.id}>
                <div className='flex w-1/2 flex-col py-2.5'>
                  <h4>
                    {format(
                      new Date(schedule.startDateTime),
                      'yyyy년 MM월 dd일 (eee)'
                    )}
                    <br />
                    {format(new Date(schedule.startDateTime), 'HH:mm')} -{' '}
                    {format(
                      new Date(schedule.endDateTime),
                      format(new Date(schedule.startDateTime), 'yyyy-MM-dd') ===
                        format(new Date(schedule.endDateTime), 'yyyy-MM-dd')
                        ? 'HH:mm'
                        : 'yyyy년 MM월 dd일 HH:mm'
                    )}
                  </h4>
                  <h4 className='text-default-700 font-normal'>
                    {data.location.name} {schedule.detailLocation}
                  </h4>
                </div>
                <div className='flex w-1/2 items-center justify-end gap-2'>
                  <SchduleDeleteButton
                    className='flex items-center gap-1 hover:font-bold hover:underline'
                    scheduleid={schedule.id}
                    eventAuthorUsername={data.authorUserName}
                    eventid={data.id}>
                    <AiOutlineDelete size={20} />
                    삭제
                  </SchduleDeleteButton>
                  <CalendarButton
                    data={data}
                    scheduleid={schedule.id}
                    className='flex items-center gap-1 hover:font-bold hover:underline'>
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
                className='text-default-400 flex flex-col py-2.5'>
                <h4>
                  {format(
                    new Date(schedule.startDateTime),
                    'yyyy년 MM월 dd일 (eee)'
                  )}
                  <br />
                  {format(new Date(schedule.startDateTime), 'HH:mm')} -{' '}
                  {format(
                    new Date(schedule.endDateTime),
                    format(new Date(schedule.startDateTime), 'yyyy-MM-dd') ===
                      format(new Date(schedule.endDateTime), 'yyyy-MM-dd')
                      ? 'HH:mm'
                      : 'yyyy년 MM월 dd일 HH:mm'
                  )}
                </h4>
                <h4 className='text-default-700 font-normal'>
                  <StandardLabel label={data.location.name} />{' '}
                  <StandardLabel label={schedule.detailLocation} />
                </h4>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
