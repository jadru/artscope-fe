'use client';

import { Skeleton } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import MarkdownViewer from '@/components/MarkdownViewer';

import jxios from '@/utils/jxios';

import { SinglePostType } from '@/types/feed';

const getRecentPost = async () =>
  jxios
    .get('/api/feed/posts/like-rank')
    .then((res) => res.data as SinglePostType[]);

export default function RecentPostWidget() {
  const post = useQuery({
    queryKey: ['recent_post_widget'],
    queryFn: getRecentPost,
  });
  const { push } = useRouter();
  return post.data ? (
    post.data.length > 0 ? (
      <div className='w-full rounded-2xl bg-default-100 p-4'>
        <h4 className='mb-1.5 pl-1.5'>인기있는 포스트</h4>
        {post.data?.map((p) => (
          <button
            className='w-full truncate rounded-md px-2 py-1.5 text-left transition-colors hover:underline'
            key={p.id}
            onClick={() => push('/post/' + p.id)}
          >
            <MarkdownViewer className='line-clamp-1' ignoreMarkdown ignoreHTML>
              {p.content.replace(/<[^>]*>?/g, '')}
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
