'use client';

import { Skeleton } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { endOfWeek, format } from 'date-fns';
import { useRouter } from 'next/navigation';

import MarkdownViewer from '@/components/MarkdownViewer';

import jxios from '@/utils/jxios';

import { EventResponseType } from '@/types/event';

const getEvents = async () =>
  jxios
    .get('/api/events', {
      params: {
        page: 0,
        size: 10,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(endOfWeek(new Date()), 'yyyy-MM-dd'),
        eventType: 'ALL',
      },
    })
    .then((res) => res.data as EventResponseType);

export default function RecentEventWidget() {
  const post = useQuery({
    queryKey: ['recent_event_widget'],
    queryFn: getEvents,
  });
  const { push } = useRouter();
  return post.data ? (
    post.data.events.length > 0 ? (
      <div className='bg-default-100 w-full rounded-2xl p-1'>
        <h4 className='font-title my-1.5 px-2.5'>이번주 이벤트</h4>
        <hr className='mb-1' />
        {post.data.events.map((event) => (
          <button
            className='hover:border-default-300 w-full truncate rounded-xl border border-transparent px-2.5 py-1.5 text-left transition-colors hover:bg-white'
            key={event.id}
            onClick={() => push('/event/' + event.id)}>
            <MarkdownViewer className='line-clamp-1' ignoreMarkdown ignoreHTML>
              {event.title}
            </MarkdownViewer>
          </button>
        ))}
      </div>
    ) : (
      <></>
    )
  ) : (
    <div className='space-y-5 p-4'>
      <Skeleton className='h-4 w-32 rounded-full' />
      <Skeleton className='h-4 w-full rounded-full' />
      <Skeleton className='h-4 w-full rounded-full' />
      <Skeleton className='h-4 w-full rounded-full' />
      <Skeleton className='h-4 w-full rounded-full' />
      <Skeleton className='h-4 w-full rounded-full' />
      <Skeleton className='h-4 w-full rounded-full' />
      <Skeleton className='h-4 w-full rounded-full' />
      <Skeleton className='h-4 w-full rounded-full' />
    </div>
  );
}
