import Image from 'next/image';

import {
  NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_MEDIA_STORAGE_URL,
} from '@/constant/env';

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
    <div className='my-10 space-y-4'>
      <h1 className='text-center font-serif text-5xl font-light'>
        {data.artwork.title}
      </h1>
      <h2 className='text-md mx-24 text-left font-bold'>
        {data.artwork.description}
      </h2>
      <div className='flex flex-col items-center justify-center'>
        {data.artwork.artworkMedias.map((media, mediaIndex) => (
          <>
            {(media.mediaType === 'image' && (
              <Image
                className='relative h-auto w-full'
                src={media.mediaUrl}
                alt={'artworkMedia' + mediaIndex}
                width={700}
                height={700}
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              />
            )) ||
              (media.mediaType === 'url' && (
                <iframe
                  className='aspect-video w-full'
                  src={
                    'https://www.youtube.com/embed/' +
                    media.mediaUrl.substring(media.mediaUrl.indexOf('=') + 1)
                  }
                  title='YouTube video player'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  allowFullScreen
                ></iframe>
              )) || (
                <video
                  className='relative h-auto w-full'
                  src={NEXT_PUBLIC_MEDIA_STORAGE_URL + '/' + media.mediaUrl}
                  controls
                />
              )}
          </>
        ))}
      </div>
    </div>
  );
}
