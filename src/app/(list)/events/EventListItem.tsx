import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import React from 'react';

import ASNextImage from '@/components/ASNextImage';

import eventTypeToKO from '@/app/(viewer)/event/[[...slug]]/eventTypeToKO';

import { SingleEventTypeOnList } from '@/types/event';

export default function EventListItem({
  event,
}: {
  event: SingleEventTypeOnList;
}) {
  return (
    <Link
      className='group flex h-44 flex-row items-center justify-between rounded-2xl bg-white px-2 py-2 transition hover:bg-default-100 group-hover:bg-default-100 md:z-10 md:ml-52'
      href={`/event/${event.id}?scheduleId=${event.eventSchedule.id}`}
    >
      <div className='flex flex-col items-start justify-start pl-3'>
        <div className='rounded-lg border-2 bg-default-200 px-2 py-0.5 font-bold'>
          {eventTypeToKO(event.eventType)}
        </div>
        <h3>{event.title}</h3>
        <h4>
          {event.eventSchedule.locationName}{' '}
          {event.eventSchedule.detailLocation}
        </h4>
        <div className='flex flex-col gap-1 md:flex-row'>
          <h5>
            {format(
              new Date(event.eventSchedule.eventDate),
              'yyyy년 MM월 dd일 EEE요일',
              { locale: ko }
            )}
          </h5>
          <h5>
            {event.eventSchedule.startTime} - {event.eventSchedule.endTime}
          </h5>
        </div>
      </div>
      <ASNextImage
        className='min-w-32 h-40 w-32 rounded-xl object-cover'
        src={event.thumbnail?.mediaUrl ?? 'prod/images/default.jpg'}
        alt='thumbnail'
        width={70}
        height={70}
      />
    </Link>
  );
}
