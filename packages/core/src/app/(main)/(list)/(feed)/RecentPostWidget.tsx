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
      <div className='bg-default-100 w-full rounded-2xl p-1'>
        <h4 className='font-title my-1.5 px-2.5'>인기있는 포스트</h4>
        <hr className='mb-1' />
        {post.data?.map((p) => (
          <button
            className='hover:border-default-300 w-full truncate rounded-xl border border-transparent px-2.5 py-1.5 text-left transition-colors hover:bg-white'
            key={p.id}
            onClick={() => push('/post/' + p.id)}
          >
            <MarkdownViewer
              className='line-clamp-1 !text-[0.9rem]'
              ignoreMarkdown
              ignoreHTML
            >
              {p.content}
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
