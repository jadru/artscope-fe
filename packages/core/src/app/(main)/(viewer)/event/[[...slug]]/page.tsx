import lodash from 'lodash';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { BiCalendar, BiWon } from 'react-icons/bi';
import { BsInfoLg, BsMap } from 'react-icons/bs';

import MarkdownViewer from '@/components/MarkdownViewer';
import MediaSlider from '@/components/MediaSlider';
import ProfileComponent from '@/components/Profile';
import StandardLabel, { standardLabel } from '@/components/StandardLabel';

import CalendarButton from '@/app/(main)/(viewer)/event/[[...slug]]/CalendarButton';
import EventEditDelete from '@/app/(main)/(viewer)/event/[[...slug]]/EventEditDelete';
import eventTypeToKO from '@/app/(main)/(viewer)/event/[[...slug]]/eventTypeToKO';
import LocationButton from '@/app/(main)/(viewer)/event/[[...slug]]/LocationButton';
import ShareButton from '@/app/(main)/(viewer)/event/[[...slug]]/ShareButton';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';
import { editAndPostTimeCalculatorKO } from '@/utils/timeCalculator';

import { EventDetailType } from '@/types/event';

const fetchEvent = async (id: string) =>
  jxios
    .get(NEXT_PUBLIC_API_URL + '/api/events/' + id)
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
}: {
  params: { slug: string[] };
}) {
  if (!params.slug) redirect('/events');
  const id = params.slug[0];
  const data = await fetchEvent(id);

  if (!data) throw new Error('Failed to fetch data');

  return (
    <div className='flex w-full flex-col items-stretch gap-2 px-3 py-2 pb-2 md:px-0'>
      <h1 className='break-keep text-[2.3rem] font-normal'>
        <StandardLabel label={data.title} />
      </h1>

      <h3>
        {data.startDate === data.endDate
          ? data.startDate
          : data.startDate + ' - ' + data.endDate}
      </h3>
      {data.medias && data.medias.length > 0 && (
        <MediaSlider medias={data.medias} />
      )}
      {data.thumbnail && data.medias && data.medias.length === 0 && (
        <MediaSlider medias={[data.thumbnail]} />
      )}
      <div>
        <h4>
          {data.location.snsUrl ? (
            <Link
              href={data.location.snsUrl}
              target='_blank'
              className='hover:underline'>
              {standardLabel(data.location.name)}
            </Link>
          ) : (
            standardLabel(data.location.name)
          )}
          {' ' + standardLabel(data.detailLocation)}
        </h4>
        <h4 className='font-normal'>{data.location.address}</h4>
      </div>
      <div className='flex gap-1'>
        <div className='bg-default-200 hover:bg-default-400 w-auto cursor-pointer rounded-lg border-2 px-2 py-0.5 font-bold transition'>
          {eventTypeToKO(data.eventType)}
        </div>
        <div className='bg-default-200 hover:bg-default-400 flex w-auto cursor-pointer items-center gap-1 rounded-lg border-2 px-2 py-0.5 font-bold transition'>
          <BiWon />
          <StandardLabel label={data.price} />
        </div>
      </div>
      {standardLabel(data.description) != '' && data.description != '\n' && (
        <div className='bg-default-100 w-full rounded-xl px-3 py-3'>
          <MarkdownViewer>{data.description}</MarkdownViewer>
        </div>
      )}

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
            data={data}>
            <BiCalendar size={20} />
            캘린더에 추가
          </CalendarButton>
          <ShareButton id={data.id} title={data.title} />
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
      </div>
    </div>
  );
}
