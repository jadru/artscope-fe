import { Metadata, ResolvingMetadata } from 'next';
import React from 'react';

import ASNextImage from '@/components/ASNextImage';
import MarkdownViewer from '@/components/MarkdownViewer';

import ArtworkAction from '@/app/(viewer)/artwork/[[...slug]]/ArtworkAction';
import ArtworkAuthorProfile from '@/app/(viewer)/artwork/[[...slug]]/ArtworkAuthorProfile';
import ArtworkComment from '@/app/(viewer)/artwork/[[...slug]]/ArtworkComment';
import ArtworkProfile from '@/app/(viewer)/artwork/[[...slug]]/ArtworkProfile';
import ArtworkTags from '@/app/(viewer)/artwork/[[...slug]]/ArtworkTags';
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
    description: data.artwork.description.replace(/<[^>]*>?/g, ''),
    openGraph: {
      title: `${data.artwork.title} - ${data.artwork.authorName} | Artscope`,
      description: data.artwork.description
        .replace(/<[^>]*>?/g, '')
        .slice(0, 100),
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
}: {
  params: { slug: string[] };
}) {
  const data: ArtworkType = await fetchArtwork(params.slug[0]);
  const author: profileApiResponseType = await fetchAuthorProfile(
    data.artwork.authorUsername
  );
  if (!data || !author) throw new Error('Failed to fetch data');
  return (
    <div>
      <h1 className='break-words px-3 pt-2 text-left text-4xl md:px-0'>
        {data.artwork.title}
      </h1>
      <ArtworkProfile aw={data} />
      <div className='px-3 py-3 md:px-0'>
        <MarkdownViewer>{data.artwork.description}</MarkdownViewer>
      </div>
      <div>
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
                    media.mediaUrl.substring(media.mediaUrl.indexOf('=') + 1)
                  }
                  title='YouTube video player'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  allowFullScreen
                ></iframe>
              )) || (
                <video
                  className='relative h-auto w-full'
                  poster={
                    NEXT_PUBLIC_MEDIA_STORAGE_URL + '/' + data.artwork.thumbnail
                  }
                  src={NEXT_PUBLIC_MEDIA_STORAGE_URL + '/' + media.mediaUrl}
                  controls
                />
              )}
          </div>
        ))}
      </div>
      <ArtworkTags data={data} />
      <ArtworkAuthorProfile author={author} />
      <ArtworkAction aw={data} />
      <ArtworkComment aw={data} />
    </div>
  );
}
