'use client';

import { Skeleton } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import MarkdownViewer from '@/components/MarkdownViewer';

import jxios from '@/utils/jxios';

import { DetailedArtworkType } from '@/types/artwork';

const getRecentArtwork = async () =>
  jxios
    .get('/api/feed/artworks/like-rank')
    .then((res) => res.data as DetailedArtworkType[]);

export default function RecentArtworkWidget() {
  const post = useQuery({
    queryKey: ['recent_artwork_widget'],
    queryFn: getRecentArtwork,
  });
  const { push } = useRouter();
  return post.data ? (
    post.data.length > 0 ? (
      <div className='w-full rounded-2xl bg-default-100 p-4'>
        <h4 className='mb-1.5 pl-1.5'>인기있는 작품</h4>
        {post.data?.map((aw) => (
          <button
            className='w-full truncate rounded-md px-2 py-1.5 text-left transition-colors hover:underline'
            key={aw.id}
            onClick={() => push('/artwork/' + aw.id)}
          >
            <MarkdownViewer className='line-clamp-1' ignoreMarkdown ignoreHTML>
              {aw.title}
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
