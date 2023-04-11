import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';

import useAuth from '@/hooks/useAuth';

import ProfileCard from '@/components/ProfileCard';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { ArtworkType, profileApiType } from '@/types';

const Slug = () => {
  useAuth();
  const router = useRouter();
  const slug = (router.query.slug as string[]) || [];
  const fetcher = (url: string) => jxios.get(url).then((res) => res.data);
  const { data, error, isLoading } = useSWR<ArtworkType>(
    slug ? '/api/artworks/' + String(slug) : undefined,
    fetcher
  );
  const {
    data: profileData,
    error: profileError,
    isLoading: profileLoading,
  } = useSWR<profileApiType>(
    slug && data ? '/api/members/' + data?.member : undefined,
    fetcher
  );
  return (
    <>
      <Seo templateTitle={data?.title ? data.title : 'Detail' + ' - Artwork'} />
      <NavBar />
      <TabLayout>
        {(isLoading || profileLoading) && <p>불러오는 중</p>}
        {(error || profileError) && <p>에러 발생</p>}
        {data && (
          <div className='block'>
            <h1 className='my-8 text-center text-4xl font-light'>
              {data?.title}
            </h1>
            <div className='my-8 text-lg'>
              <p className='text-center'>{data.description}</p>
            </div>
            {data.artworkMedias.map((artworkMedia) => (
              <>
                <div
                  key={artworkMedia.id}
                  className='unset relative h-auto w-full'
                >
                  {artworkMedia.mediaType === 'image' ? (
                    <Image
                      className='relative h-auto w-full'
                      src={artworkMedia.mediaUrl}
                      alt='artworkMedia'
                      width={200}
                      height={160}
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                  ) : (
                    <video
                      className='relative h-auto w-full'
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
            <div className='h-8'></div>
            {profileData && <ProfileCard profileData={profileData} />}
          </div>
        )}
      </TabLayout>
      <BottomBar tab='artwork' />
    </>
  );
};
export default Slug;
