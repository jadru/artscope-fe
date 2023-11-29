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
      <div className='bg-default-100 w-full rounded-2xl p-1'>
        <h4 className='font-title my-1.5 px-2.5'>최근 시작된 아고라</h4>
        <hr className='mb-1' />
        {post.data.agoras.map((agora) => (
          <button
            className='hover:border-default-300 w-full truncate rounded-xl border border-transparent px-2.5 py-1.5 text-left transition-colors hover:bg-white'
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
