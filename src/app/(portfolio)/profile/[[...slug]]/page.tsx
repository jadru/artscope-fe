import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { AiOutlineHome, AiOutlineLink } from 'react-icons/ai';

import ASNextImage from '@/components/ASNextImage';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import StandardLabel, { standardLabel } from '@/components/StandardLabel';

import ArtworkItem from '@/app/(list)/(feed)/artworks/ArtworkItem';
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
    title: `${standardLabel(
      data.name.replace(/<[^>]*>?/g, '').slice(0, 20)
    )} Portfolio`,
    description: data.introduction
      ? standardLabel(data.introduction.replace(/<[^>]*>?/g, ''))
      : standardLabel(data.name) + '님의 포트폴리오입니다.',
    openGraph: {
      title: `${standardLabel(data.name.slice(0, 20))} 이벤트 | Artscope`,
      description: data.introduction
        ? standardLabel(data.introduction.replace(/<[^>]*>?/g, '')).slice(
            0,
            100
          )
        : standardLabel(data.name) + '님의 포트폴리오입니다.',
      url: 'https://www.artscope.kr/profile/' + id,
      authors: [standardLabel(data.name)],
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
  if (!data || !artworkData) throw new Error('Failed to fetch data');
  const history = data.history?.split('\n').map((line) => {
    if (line === '') {
      return;
    }
    return (
      <li className='py-0.5 font-normal' key={'line-' + line}>
        <StandardLabel label={line} />
      </li>
    );
  });

  return (
    <div className='mx-auto flex flex-col items-stretch gap-2 px-2 md:px-0'>
      <div className='flex w-full items-center justify-between py-1.5 md:py-4'>
        <div className='md:px-2.5'>
          <div className='flex items-center gap-2'>
            <h1 className='text-[2rem]'>
              <StandardLabel label={data.name} />
            </h1>
            <h2 className='my-0 text-2xl'>@{data.username}</h2>
          </div>

          <h2 className='my-0 text-xl'>
            {data.companyName ? <StandardLabel label={data.companyName} /> : ''}
            {data.companyRole
              ? ' | ' + <StandardLabel label={data.companyRole} />
              : ''}{' '}
            {data.roleStatus.startsWith('ARTIST')
              ? '작가'
              : data.roleStatus.startsWith('CURATOR')
              ? '기획자'
              : ''}
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
      {data.introduction && (
        <div className='rounded-2xl border border-default-400 px-2.5 py-2'>
          <h2 className='mb-1 text-xl font-normal'>소개</h2>
          <p>
            <StandardLabel label={data.introduction} />
          </p>
        </div>
      )}
      {history && (
        <div className='rounded-2xl border border-default-400 px-2.5 py-2'>
          <h2 className='mb-1 text-xl font-normal'>이력</h2>
          <ol className='ml-6 list-disc'>{history.map((item) => item)}</ol>
        </div>
      )}
      {(data.websiteUrl || data.snsUrl) && (
        <div className='rounded-2xl border border-default-400 px-2.5 py-2'>
          {data.websiteUrl && (
            <>
              <h2 className='mb-1 text-xl font-normal'>웹사이트 & SNS</h2>
              <Link href={standardLabel(data.websiteUrl)}>
                <p className='cursor-pointer rounded-xl px-2.5 py-2 transition hover:bg-stone-900/10'>
                  <AiOutlineHome className='mb-1 mr-1 inline' size={19} />
                  {standardLabel(data.websiteUrl)}
                </p>
              </Link>
            </>
          )}
          {data.snsUrl && (
            <Link href={standardLabel(data.snsUrl)} target='_blank'>
              <p className='cursor-pointer rounded-xl px-2.5 py-2 transition hover:bg-stone-900/10'>
                <AiOutlineLink className='mb-1 mr-1 inline' size={19} />
                {standardLabel(data.snsUrl)}
              </p>
            </Link>
          )}
        </div>
      )}
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
