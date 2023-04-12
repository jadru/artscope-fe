import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';

import ProfileCard from '@/components/ProfileCard';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { ArtworkType, profileApiType } from '@/types';

export const getServerSideProps: GetServerSideProps<{
  data: ArtworkType;
}> = async ({ params }) => {
  // Fetch data from external API
  const response = await jxios
    .get('https://api.artscope.kr/api/artworks/' + params?.slug)
    .then((res) => res);
  const data: ArtworkType = response.data;

  if (!data) {
    return {
      notFound: true,
    };
  }

  // Pass data to the page via props
  return { props: { data } };
};

const Slug = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const slug = (router.query.slug as string[]) || [];
  const fetcher = (url: string) => jxios.get(url).then((res) => res.data);
  const { data: profileData } = useSWR<profileApiType>(
    slug && data ? '/api/members/' + data?.member : undefined,
    fetcher
  );
  return (
    <>
      <Seo
        description={data.description}
        templateTitle={data.title + ' - Artwork'}
        image={'https://www.artscope.kr/api/og-image?title=' + data.title}
      />
      <NavBar />
      <TabLayout>
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
