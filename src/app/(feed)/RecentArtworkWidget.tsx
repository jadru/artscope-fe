import { Skeleton } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

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
  return post.data && post.data.length > 0 ? (
    <div className='w-full border-b border-r p-4'>
      <h4 className='mb-1.5 pl-1.5'>인기있는 작품</h4>
      {post.data?.map((aw) => (
        <button
          className='w-full truncate rounded-md px-2 py-1.5 text-left transition-colors hover:bg-default-100'
          key={aw.id}
          onClick={() => push('/artwork/' + aw.id)}
        >
          <p className='truncate'>{aw.title.replace(/<[^>]*>?/g, '')}</p>
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
