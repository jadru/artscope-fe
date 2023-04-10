import Lottie from 'lottie-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { AiFillSafetyCertificate } from 'react-icons/ai';
import { HiOutlineDocumentSearch } from 'react-icons/hi';
import useSWR from 'swr';

import ResponsiveGrid from '@/components/Grid/ResponsiveGrid';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { ArtworkType, profileApiType } from '@/types';

import ProfileAnimation from '~/animation/8020-profile.json';

const Slug = () => {
  const router = useRouter();
  const slug = (router.query.slug as string[]) || [];
  const fetcher = (url: string) => jxios.get(url).then((res) => res.data);
  const { data, error, isLoading } = useSWR<ArtworkType>(
    '/api/artworks/' + slug[0],
    fetcher
  );
  const {
    data: profileData,
    error: profileError,
    isLoading: profileLoading,
  } = useSWR<profileApiType>('/api/members/' + data?.member, fetcher);
  return (
    <>
      <Seo templateTitle={data?.title ? data.title : 'Detail' + ' - Artwork'} />
      <NavBar />
      <TabLayout>
        {isLoading || (profileLoading && <p>불러오는 중</p>)}
        {error || (profileError && <p>에러 발생</p>)}
        {data && (
          <div className='block'>
            <h1 className='my-8 text-center text-4xl font-light'>
              {data?.title}
            </h1>
            <div className='relative h-48 w-full'>
              {data.thumbnail.mediaType === 'image' ? (
                <Image
                  className='rounded-2xl'
                  src={data.thumbnail.mediaUrl}
                  alt='artworkMedia'
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <video
                  src={
                    NEXT_PUBLIC_MEDIA_STORAGE_URL +
                    '/' +
                    data.thumbnail.mediaUrl
                  }
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}
            </div>
            <div className='my-8 text-lg'>
              <p>{data.description}</p>
            </div>
            <ResponsiveGrid>
              {data.artworkMedias.map((artworkMedia) => (
                <>
                  <div key={artworkMedia.id} className='relative h-64 w-full'>
                    {artworkMedia.mediaType === 'image' ? (
                      <Image
                        src={artworkMedia.mediaUrl}
                        alt='artworkMedia'
                        className='rounded-2xl'
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <video
                        className='rounded-2xl'
                        src={
                          NEXT_PUBLIC_MEDIA_STORAGE_URL +
                          '/' +
                          artworkMedia.mediaUrl
                        }
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    )}
                    {artworkMedia.description && (
                      <p className='absolute bottom-0 w-full truncate rounded-b-2xl bg-black/50 p-0.5 text-center text-xl font-bold text-white'>
                        {artworkMedia.description}
                      </p>
                    )}
                  </div>
                </>
              ))}
            </ResponsiveGrid>
            {profileData && (
              <div className='flex w-full flex-col items-center justify-center space-y-2 text-center'>
                <div className='card flex w-[300px] flex-row justify-between bg-white/60 px-8 py-6 drop-shadow-2xl'>
                  <div className='avatar'>
                    <div className='mask mask-hexagon w-24 rounded-full bg-white/50'>
                      {profileData.picture ? (
                        <Image
                          src={profileData.picture}
                          alt='profile'
                          width={200}
                          height={200}
                        />
                      ) : (
                        <Lottie
                          animationData={ProfileAnimation}
                          className='h-24 w-24'
                        />
                      )}
                    </div>
                  </div>
                  <div className='flex flex-col justify-center pr-4 text-black'>
                    <p className='text-2xl font-bold'>{profileData.name}</p>
                    <p>
                      <>
                        @{data.member}{' '}
                        {(profileData.artistStatus === 'APPROVED' && (
                          <AiFillSafetyCertificate className='h-2 w-2' />
                        )) ||
                          (profileData.artistStatus === 'PENDING' && (
                            <HiOutlineDocumentSearch className='h-2 w-2' />
                          ))}
                      </>
                    </p>
                  </div>
                </div>
                <div>
                  <p>{profileData.introduction}</p>
                  <p>{profileData.history}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </TabLayout>
      <BottomBar tab='artwork' />
    </>
  );
};
export default Slug;
