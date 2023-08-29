import Lottie from 'lottie-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';

import AudioFileGridItem from '@/components/AudioFileGridItem';
import Skeleton from '@/components/Skeleton';

import { profile } from '@/api';
import jxios from '@/utils/jxios';

import { ArtWorkApiByMember } from '@/types';

import ProfileAnimation from '~/animation/8020-profile.json';

async function getProfile(slug: string) {
  const { data } = await profile.get(slug);
  return data;
}

export default async function PortfolioView() {
  const params = useParams();
  const profileData = await getProfile(params.slug[0]);
  const fetcher = (url: string) =>
    jxios
      .get(url, {
        params: {
          page: 0,
          size: 12,
        },
      })
      .then((res) => res.data);
  const { data: userArtworksData, isLoading: userArtworkLoading } =
    useSWR<ArtWorkApiByMember>(
      '/api/artworks/member/' + profileData?.username,
      fetcher
    );
  return (
    <div className='flex w-full flex-col md:border-2'>
      <div className='relative flex w-full flex-col items-center justify-center p-6 dark:text-gray-100 md:flex-row md:space-x-12'>
        <div className='group avatar h-24 w-24'>
          <div className='mask rounded-full border'>
            {profileData.picture ? (
              <Image
                src={profileData.picture}
                alt='profile'
                width={250}
                height={250}
                className='object-cover'
              />
            ) : (
              <Lottie animationData={ProfileAnimation} className='w-full' />
            )}
          </div>
        </div>
        <div className='mt-3 space-y-1.5 divide-solid text-center text-black dark:text-gray-100 md:mt-0'>
          <p className='truncate text-3xl font-bold'>{profileData.name}</p>
          {/* <p className='text-md truncate font-bold'> */}
          {/*   {'@' + profileData.username} */}
          {/* </p> */}
          {profileData.introduction && (
            <p className='whitespace-pre-wrap text-left text-xl font-light text-primary'>
              {profileData.introduction}
            </p>
          )}
          {profileData.history && (
            <p className='whitespace-pre-wrap text-left'>
              {profileData.history}
            </p>
          )}
          <div className='link space-x-3 text-left font-black'>
            {profileData.snsUrl && (
              <Link
                href={profileData.snsUrl}
                rel='noopener noreferrer'
                target='_blank'
              >
                SNS
              </Link>
            )}
            {profileData.websiteUrl && (
              <Link
                href={profileData.websiteUrl}
                rel='noopener noreferrer'
                target='_blank'
              >
                WEBSITE
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className='grid w-full grid-cols-3 gap-0.5 md:gap-1 md:border-t-2'>
        {userArtworksData &&
          userArtworksData?.artworks.map((artwork) => (
            <Link
              key={artwork.id}
              className='group relative'
              href={'/artwork/' + artwork.id}
            >
              {artwork.thumbnail.mediaType === 'image' ? (
                <Image
                  src={artwork.thumbnail.mediaUrl}
                  alt='artwork'
                  width={200}
                  height={200}
                  className='aspect-square w-full object-cover'
                />
              ) : (
                <AudioFileGridItem className='aspect-square w-full object-cover' />
              )}
              {/* {artwork.title && ( */}
              {/*   <p className='md:text-md absolute bottom-2 left-2 mr-2 rounded-md bg-dark/40 px-3 py-2 text-left text-sm font-bold text-white backdrop-blur'> */}
              {/*     {artwork.title} */}
              {/*   </p> */}
              {/* )} */}
            </Link>
          ))}
        {userArtworkLoading && <Skeleton className='h-full w-2/3' />}
      </div>
    </div>
  );
}
