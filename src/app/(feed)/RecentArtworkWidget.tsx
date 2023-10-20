import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import jxios from '@/utils/jxios';

import { ArtWorkApiResponseType } from '@/types/artwork';

const getRecentArtwork = async () =>
  jxios
    .get('/api/artworks', {
      params: {
        page: 0,
        size: 8,
      },
    })
    .then((res) => res.data as ArtWorkApiResponseType);

export default function RecentArtworkWidget() {
  const post = useQuery({
    queryKey: ['recent_artwork_widget'],
    queryFn: getRecentArtwork,
  });
  const { push } = useRouter();
  return post.data && post.data.artworks.length > 0 ? (
    <div className='hidden w-80 border-b border-r p-4 md:block'>
      <h4 className='mb-1.5 pl-1.5'>최근 작성된 아트워크</h4>
      {post.data?.artworks.map((aw) => (
        <button
          className='w-full truncate rounded-md px-2 py-1.5 text-left transition-colors hover:bg-default-100'
          key={aw.artwork.id}
          onClick={() => push('/artwork/' + aw.artwork.id)}
        >
          <p className='truncate'>{aw.artwork.title}</p>
        </button>
      ))}
    </div>
  ) : (
    <div></div>
  );
}
