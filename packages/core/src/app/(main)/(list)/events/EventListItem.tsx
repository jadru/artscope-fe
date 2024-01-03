import { useRouter } from 'next/navigation';
import React from 'react';

import ASNextImage from '@/components/ASNextImage';
import StandardLabel from '@/components/StandardLabel';

import { SingleEventTypeOnList } from '@/types/event';

export default function EventListItem({
  event,
}: {
  event: SingleEventTypeOnList;
}) {
  const { push } = useRouter();
  return (
    <div
      onClick={() => push(`/event/${event.id}`)}
      className='cursor-pointer hover:bg-default-100 group-hover:bg-default-100 group flex flex-row items-center justify-between rounded-2xl bg-white px-1.5 py-1 transition md:z-10'>
      <div
        className={`text-default-800 flex flex-col justify-between overflow-x-hidden break-keep tracking-tight ${
          event.thumbnail.mediaUrl ? 'w-[calc(100%-3rem)]' : 'w-full'
        }`}>
        <h4 className='font-title flex w-full justify-between text-[1.1rem]'>
          <StandardLabel label={event.title} />
        </h4>
        <div className='flex flex-col gap-0.5'>
          <div className='flex flex-col gap-1 md:flex-row'>
            <h4 className='font-normal'>
              {event.startDate === event.endDate
                ? event.startDate
                : event.startDate + ' - ' + event.endDate}
            </h4>
          </div>
          <h4 className='font-normal'>
            <StandardLabel label={event.locationName} />{' '}
            <StandardLabel label={event.detailLocation} />
          </h4>
          <p>{event.eventType}</p>
        </div>
      </div>
      <ASNextImage
        className='min-w-32 h-28 w-28 rounded-xl object-cover'
        src={event.thumbnail?.mediaUrl ?? 'prod/images/default.jpg'}
        alt='thumbnail'
        width={70}
        height={70}
      />
    </div>
  );
}
