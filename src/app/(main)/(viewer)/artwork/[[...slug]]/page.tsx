import { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react';

import ASNextImage from '@/components/ASNextImage';
import MarkdownViewer from '@/components/MarkdownViewer';
import ProfileComponent from '@/components/Profile';
import ArtworkAuthorProfileCard from '@/components/ProfileCard';
import StandardLabel, { standardLabel } from '@/components/StandardLabel';

import ArtworkAction from '@/app/(main)/(viewer)/artwork/[[...slug]]/ArtworkAction';
import ArtworkComment from '@/app/(main)/(viewer)/artwork/[[...slug]]/ArtworkComment';
import ArtworkTags from '@/app/(main)/(viewer)/artwork/[[...slug]]/ArtworkTags';
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
  if (!params.slug) redirect('/artworks');
  const id = params.slug[0];
  const data: ArtworkType = await fetchArtwork(id);
  const thumbnail = data.artwork.thumbnail || [];
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: `${standardLabel(data.artwork.authorName)} 작가, ${standardLabel(
      data.artwork.title
    )}`,
    description: standardLabel(data.artwork.description),
    openGraph: {
      title: `${standardLabel(data.artwork.authorName)} 작가, ${standardLabel(
        data.artwork.title
      )} - Artscope`,
      description: standardLabel(data.artwork.description).slice(0, 100),
      url: 'https://www.artscope.kr/artwork/' + id,
      type: 'article',
      authors: [standardLabel(data.artwork.authorName)],
      images: [
        NEXT_PUBLIC_MEDIA_STORAGE_URL + '/' + thumbnail.mediaUrl,
        ...previousImages,
      ],
    },
    publisher: 'Artscope',
  };
}

export default async function ArtworkPage({
  params,
}: {
  params: { slug: string[] };
}) {
  if (!params.slug) redirect('/artworks');
  const data: ArtworkType = await fetchArtwork(params.slug[0]);
  const author: profileApiResponseType = await fetchAuthorProfile(
    data.artwork.authorUsername
  );
  if (!data || !author) throw new Error('Failed to fetch data');
  return (
    <div className='space-y-3 py-3'>
      <h1 className='break-keep text-[2.3rem] font-normal'>
        <StandardLabel label={data.artwork.title} />
      </h1>
      <ProfileComponent
        username={data.artwork.authorUsername}
        name={data.artwork.authorName}
        picture={author.picture}
        introduction={author.introduction}
      />
      <div className='w-full rounded-xl bg-default-100 px-3 py-3'>
        <MarkdownViewer>{data.artwork.description}</MarkdownViewer>
      </div>
      <div className='w-full rounded-2xl border-2'>
        {data.artwork.artworkMedias.map((media, mediaIndex) => (
          <div key={media.id}>
            {(media.mediaType === 'image' && (
              <ASNextImage
                className='relative h-auto w-full rounded-xl'
                src={media.mediaUrl}
                alt={'artworkMedia' + mediaIndex}
                width={700}
                height={700}
              />
            )) ||
              (media.mediaType === 'url' && (
                <iframe
                  className='aspect-video w-full rounded-xl'
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
                  className='relative h-auto w-full rounded-xl'
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
      <ArtworkAuthorProfileCard
        username={author.username}
        name={author.name}
        picture={author.picture}
      />
      <ArtworkAction aw={data} />
      <ArtworkComment aw={data} />
    </div>
  );
}
