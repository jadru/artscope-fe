import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import React from 'react';

import ASNextImage from '@/components/ASNextImage';
import StandardLabel from '@/components/StandardLabel';

import { editAndPostShortCalculatorKO } from '@/utils/timeCalculator';

import { feedItemType } from '@/types/feed';

export default function FeedListItemEvent({ feed }: { feed: feedItemType }) {
  return (
    <Link
      href={`/event/${feed.id}`}
      className='flex w-full cursor-pointer space-x-2 rounded-xl bg-white px-3.5 py-2 transition-colors hover:bg-gray-100 md:mx-0'
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className='flex w-full flex-col justify-between text-left'>
        <div className='flex items-start justify-between'>
          <div className='flex h-full w-[calc(100%-104px)] flex-col items-start justify-between gap-1'>
            <div className='w-full'>
              <h4 className='flex w-full justify-between text-[1.1rem]'>
                <StandardLabel label={feed.title} />
                <span className='text-right font-normal text-default-500'>
                  {editAndPostShortCalculatorKO(
                    feed.createdTime,
                    feed.updatedTime
                  )}
                </span>
              </h4>
              <p className='text-default-700'>
                <StandardLabel label={feed.event.locationName} />
              </p>
            </div>
            <p className='text-[0.9rem]'>
              {format(
                new Date(feed.event.startDateTime),
                'yyyy년 MM월 dd일 (eee) HH:mm',
                {
                  locale: ko,
                }
              )}{' '}
              -{' '}
              {format(
                new Date(feed.event.endDateTime),
                format(new Date(feed.event.startDateTime), 'yyyy-MM-dd') ===
                  format(new Date(feed.event.endDateTime), 'yyyy-MM-dd')
                  ? 'HH:mm'
                  : 'yyyy년 MM월 dd일 (eee) HH:mm',
                {
                  locale: ko,
                }
              )}
            </p>
            <p>{feed.event.eventType}</p>
          </div>
          {feed.thumbnailUrl && (
            <ASNextImage
              src={feed.thumbnailUrl}
              alt={feed.title ?? 'thumbnail'}
              width={96}
              height={96}
              className='ml-2 h-24 w-24 rounded-lg border object-cover drop-shadow-xl'
            />
          )}
        </div>
      </div>
    </Link>
  );
}
