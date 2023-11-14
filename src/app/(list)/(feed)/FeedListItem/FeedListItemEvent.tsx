import { format } from 'date-fns';
import Link from 'next/link';
import React from 'react';

import ASNextImage from '@/components/ASNextImage';

import eventTypeToKO from '@/app/(viewer)/event/[[...slug]]/eventTypeToKO';

import { feedItemType } from '@/types/feed';

export default function FeedListItemEvent({ feed }: { feed: feedItemType }) {
  return (
    <Link
      href={`/event/${feed.id}`}
      className='flex w-full cursor-pointer space-x-2 bg-white px-3.5 py-2 transition-colors hover:bg-gray-100 md:mx-0'
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className='flex w-full flex-col justify-between text-left'>
        <div className='flex items-start justify-between'>
          <div className='flex h-full w-2/3 flex-col items-start justify-between gap-1'>
            <div className='w-full'>
              <h4 className='w-full text-[1.1rem]'>{feed.title}</h4>
              <p className='font-bold text-default-700'>
                {feed.event.locationName}
              </p>
            </div>
            {/* <div className='line-clamp-2 w-full overflow-x-hidden break-keep tracking-tight text-default-800'> */}
            {/*   <MarkdownVewer content={feed.content} /> */}
            {/* </div> */}
            <div className='flex w-full items-end justify-between'>
              <p className='text-[0.9rem]'>
                {format(new Date(feed.event.eventDate), 'yyyy년 MM월 dd일')}
                <br />
                {feed.event.startTime} - {feed.event.endTime}
              </p>
              <div className='w-auto rounded-lg border-2 bg-default-200 px-2 py-0.5 pl-1 text-sm font-bold'>
                {eventTypeToKO(feed.event.eventType)}
              </div>
            </div>
          </div>
          {feed.thumbnailUrl && (
            <ASNextImage
              src={feed.thumbnailUrl}
              alt={feed.title ?? 'thumbnail'}
              width={100}
              height={100}
              className='ml-2 h-28 w-1/3 rounded-lg object-cover'
            />
          )}
        </div>
      </div>
    </Link>
  );
}
