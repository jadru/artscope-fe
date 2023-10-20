import { Skeleton } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import jxios from '@/utils/jxios';

import { PostListResponse } from '@/types/feed';

const getRecentPost = async () =>
  jxios
    .get('/api/posts', {
      params: {
        page: 0,
        size: 8,
      },
    })
    .then((res) => res.data as PostListResponse);

export default function RecentPostWidget() {
  const post = useQuery({
    queryKey: ['recent_post_widget'],
    queryFn: getRecentPost,
  });
  const { push } = useRouter();
  return post.data && post.data.posts.length > 0 ? (
    <div className='w-full border-b border-r p-4'>
      <h4 className='mb-1.5 pl-1.5'>최근 작성된 포스트</h4>
      {post.data?.posts.map((p) => (
        <button
          className='w-full truncate rounded-md px-2 py-1.5 text-left transition-colors hover:bg-default-100'
          key={p.id}
          onClick={() => push('/post/' + p.id)}
        >
          <p className='truncate'>{p.content.replace(/<[^>]*>?/g, '')}</p>
        </button>
      ))}
    </div>
  ) : (
    <div className='space-y-5 border-b border-r p-4'>
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
