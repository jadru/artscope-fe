'use client';

import { Skeleton } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import MarkdownViewer from '@/components/MarkdownViewer';

import jxios from '@/utils/jxios';

import { AgoraListType } from '@/types/agora';

const getEvents = async () =>
  jxios
    .get('/api/agoras', {
      params: {
        page: 0,
        size: 10,
      },
    })
    .then((res) => res.data as AgoraListType);

export default function RecentAgoraWidget() {
  const post = useQuery({
    queryKey: ['recent_agora_widget'],
    queryFn: getEvents,
  });
  const { push } = useRouter();
  return post.data ? (
    post.data.agoras.length > 0 ? (
      <div className='w-full rounded-2xl bg-default-100 p-4'>
        <h4 className='mb-1.5 pl-1.5'>최근 시작된 아고라</h4>
        {post.data.agoras.map((agora) => (
          <button
            className='w-full truncate rounded-md px-2 py-1.5 text-left transition-colors hover:underline'
            key={agora.id}
            onClick={() => push('/agora/' + agora.id)}
          >
            <MarkdownViewer className='line-clamp-1' ignoreMarkdown ignoreHTML>
              {agora.title}
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
