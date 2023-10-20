import { Metadata, ResolvingMetadata } from 'next';
import React from 'react';

import ASNextImage from '@/components/ASNextImage';

import ArtworkAction from '@/app/artwork/[[...slug]]/ArtworkAction';
import ArtworkAuthorProfile from '@/app/artwork/[[...slug]]/ArtworkAuthorProfile';
import ArtworkComment from '@/app/artwork/[[...slug]]/ArtworkComment';
import ArtworkContent from '@/app/artwork/[[...slug]]/ArtworkContent';
import ArtworkEdit from '@/app/artwork/[[...slug]]/ArtworkEdit';
import ArtworkTags from '@/app/artwork/[[...slug]]/ArtworkTags';
import {
  NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_MEDIA_STORAGE_URL,
} from '@/constant/env';
import jxios from '@/utils/jxios';

import { ArtworkType } from '@/types/artwork';
import { profileApiResponseType } from '@/types/profile';

const fetchArtwork = async (id: string) =>
  await jxios
    .get(NEXT_PUBLIC_API_URL + '/api/artworks/' + id, {
      withCredentials: true,
    })
    .then((res) => res.data as ArtworkType);

const fetchAuthorProfile = async (id: string) =>
  await jxios
    .get(NEXT_PUBLIC_API_URL + '/api/members/' + id, {
      withCredentials: true,
    })
    .then((res) => res.data as profileApiResponseType);

export async function generateMetadata(
  {
    params,
  }: {
    params: { slug: string[] };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.slug[0];
  const data: ArtworkType = await fetchArtwork(id);
  const thumbnail = data.artwork.thumbnail || [];
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: `${data.artwork.title} - ${data.artwork.authorName} 작가`,
    description: data.artwork.description,
    openGraph: {
      title: `${data.artwork.title} - ${data.artwork.authorName} | Artscope`,
      description: data.artwork.description.slice(0, 100),
      url: 'https://www.artscope.kr/artwork/' + id,
      type: 'article',
      authors: [data.artwork.authorName],
      images: [
        NEXT_PUBLIC_MEDIA_STORAGE_URL + '/' + thumbnail.mediaUrl,
        ...previousImages,
      ],
    },
    publisher: data.artwork.authorName,
  };
}

export default async function ArtworkPage({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const data: ArtworkType = await fetchArtwork(params.slug[0]);
  const isEdit = Boolean(searchParams?.edit) ?? false;
  if (!data) throw new Error('Failed to fetch data');
  const author: profileApiResponseType = await fetchAuthorProfile(
    data.artwork.authorUsername
  );
  return (
    <div className='space-y-3 py-4 md:border-x'>
      {!isEdit ? (
        <>
          <h1 className='mx-2 break-words text-left font-serif text-4xl'>
            {data.artwork.title}
          </h1>
          <ArtworkTags data={data} />
          <div className='h-0.5 bg-default-100'></div>
          <h2 className='mx-2 break-words text-left text-xl font-normal'>
            <ArtworkContent content={data.artwork.description} />
          </h2>

          <div className=''>
            {data.artwork.artworkMedias.map((media, mediaIndex) => (
              <div key={media.id}>
                {(media.mediaType === 'image' && (
                  <ASNextImage
                    className='relative h-auto w-full'
                    src={media.mediaUrl}
                    alt={'artworkMedia' + mediaIndex}
                    width={700}
                    height={700}
                  />
                )) ||
                  (media.mediaType === 'url' && (
                    <iframe
                      className='aspect-video w-full'
                      src={
                        'https://www.youtube.com/embed/' +
                        media.mediaUrl.substring(
                          media.mediaUrl.indexOf('=') + 1
                        )
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
              </div>
            ))}
          </div>
          <hr className='h-0.5 bg-default-100'></hr>
          <ArtworkAuthorProfile author={author} />
          <hr className='h-0.5 bg-default-100'></hr>
          <ArtworkAction aw={data} />
          <hr className='h-0.5 bg-default-100'></hr>
          <ArtworkComment aw={data} />
        </>
      ) : (
        <ArtworkEdit data={data} />
      )}
    </div>
  );
}
