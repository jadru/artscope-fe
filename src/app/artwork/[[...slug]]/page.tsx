import { NEXT_PUBLIC_API_URL } from '@/constant/env';

import { ArtworkType } from '@/types';

const fetchArtwork = async (id: string) =>
  fetch(NEXT_PUBLIC_API_URL + '/api/artworks/' + id).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  });

export default async function ProfilePage({
  params,
}: {
  params: { slug: string[] };
}) {
  const data: ArtworkType = await fetchArtwork(params.slug[0]);
  return (
    <>
      <h1 className='my-6 text-center font-serif font-light'>
        {data.artwork.title}
      </h1>
      <h2 className='mx-24 my-6 text-left font-bold'>
        {data.artwork.description}
      </h2>
      <div className='flex flex-col items-center justify-center'>
        {data.artwork.artworkMedias.map((media) => (
          <>
            {media.mediaType + ' | ' + media.mediaUrl}
            <br />
          </>
        ))}
      </div>
    </>
  );
}
