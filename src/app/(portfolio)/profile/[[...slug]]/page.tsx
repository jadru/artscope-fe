import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { AiOutlineHome, AiOutlineLink } from 'react-icons/ai';

import ASNextImage from '@/components/ASNextImage';
import ResponsiveGrid from '@/components/ResponsiveGrid';

import ArtworkItem from '@/app/(list)/artworks/ArtworkItem';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { ArtworkApiResponseByUsernameType } from '@/types/artwork';
import { profileApiType } from '@/types/profile';

const fetchArtwork = async (username: string) =>
  jxios
    .get(NEXT_PUBLIC_API_URL + '/api/artworks/member/' + username, {
      params: {
        size: 30,
        page: 0,
        sortDirection: 'DESC',
      },
    })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res.data as ArtworkApiResponseByUsernameType;
    });

const fetchProfile = async (username: string) =>
  await jxios
    .get(NEXT_PUBLIC_API_URL + '/api/members/' + username)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res.data as profileApiType;
    });

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
  const data = await fetchProfile(id);
  // const thumbnail = (await parent).openGraph?.images || [];
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: `${data.name.replace(/<[^>]*>?/g, '').slice(0, 20)} Portfolio`,
    description: data.introduction
      ? data.introduction.replace(/<[^>]*>?/g, '')
      : data.name + '님의 포트폴리오입니다.',
    openGraph: {
      title: `${data.name.slice(0, 20)} 이벤트 | Artscope`,
      description: data.introduction
        ? data.introduction.replace(/<[^>]*>?/g, '').slice(0, 100)
        : data.name + '님의 포트폴리오입니다.',
      url: 'https://www.artscope.kr/profile/' + id,
      authors: [data.name],
      images: [data.picture, ...previousImages],
    },
    publisher: 'Artscope',
  };
}

export default async function ProfilePage({
  params,
}: {
  params: { slug: string[] };
}) {
  const data = await fetchProfile(params.slug[0]);
  const artworkData = (await fetchArtwork(
    params.slug[0]
  )) as ArtworkApiResponseByUsernameType;

  const history = data.history?.split('\n').map((line, index) => {
    if (line === '') {
      return;
    }
    return (
      <div key={'line-' + index}>
        {index === 0 && <hr />}
        <div>
          <h3 className='cursor-text px-2.5 py-2 text-xl font-normal hover:bg-stone-900/10'>
            {line}
          </h3>
          {data.history && data.history.length > index && <hr />}
        </div>
      </div>
    );
  });

  return (
    <div className='mx-auto my-6 space-y-3 px-2 md:px-0'>
      <div className='flex w-full items-center justify-between md:py-4'>
        <div className='space-y-3 md:px-2.5'>
          <div className='flex items-center gap-2'>
            <h1 className='text-[2rem]'>{data.name}</h1>
            <h2 className='my-0 text-2xl'>@{data.username}</h2>
          </div>

          <h2 className='my-0 text-xl'>
            {data.companyName}
            {data.companyRole ? ' | ' + data.companyRole : ''}
          </h2>
        </div>
        {data.picture && (
          <ASNextImage
            src={data.picture}
            alt='profile picture'
            className='h-32 w-32 rounded-3xl border object-cover drop-shadow-xl'
            width={180}
            height={180}
          />
        )}
      </div>
      <hr className='h-0.5 bg-black' />
      {data.introduction && (
        <>
          <h2 className='mb-4 border-b-1 border-black px-2.5 pb-3 text-xl'>
            {data.introduction}
          </h2>
        </>
      )}
      {history && (
        <>
          <h3 className='px-2.5'>이력</h3>
          <div>{history.map((item) => item)}</div>
          <hr className='h-0.5 bg-black' />
        </>
      )}
      <div className='flex flex-col'>
        {data.websiteUrl && (
          <>
            <h3 className='px-2.5'>웹사이트 & SNS</h3>
            <Link href={data.websiteUrl}>
              <h4 className='cursor-pointer px-2.5 py-2 text-lg font-bold hover:bg-stone-900/10'>
                <AiOutlineHome className='mb-1 mr-1 inline' size={17} />
                {data.websiteUrl}
              </h4>
            </Link>
          </>
        )}
        {data.websiteUrl && data.snsUrl && <hr />}
        {data.snsUrl && (
          <Link href={data.snsUrl} target='_blank'>
            <h4 className='cursor-pointer px-2.5 py-2 text-lg font-bold hover:bg-stone-900/10'>
              <AiOutlineLink className='mb-1 mr-1 inline' size={17} />
              {data.snsUrl}
            </h4>
          </Link>
        )}
        <hr className='h-0.5 bg-black' />
      </div>
      <ResponsiveGrid>
        {artworkData &&
          artworkData.artworks.map((item) => (
            <ArtworkItem
              artwork={{ artwork: item, isLiked: false }}
              key={item.id}
            />
          ))}
      </ResponsiveGrid>
    </div>
  );
}
