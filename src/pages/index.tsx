import Lottie from 'lottie-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { ReactElement, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from 'react-query';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { ArtworkType } from '@/types';

import ArtistAnimation from '~/animation/141993-spin-sobky-like-siri.json';

const OFFSET = 12;

export default function Artwork() {
  const bottom = useRef(null);
  const { data, error, isFetchingNextPage, fetchNextPage, status } =
    useInfiniteQuery(
      'artworkList',
      async ({ pageParam = 0 }) => {
        const response = await jxios.get('/api/artworks', {
          params: {
            size: OFFSET,
            page: pageParam,
          },
          withCredentials: true,
        });
        return response.data;
      },
      {
        getNextPageParam: (lastPage) =>
          lastPage.pageInfo.page <= lastPage.pageInfo.totalPages
            ? lastPage.pageInfo.page + 1
            : undefined,
      }
    );

  const ObservationComponent = (): ReactElement => {
    const [ref, inView] = useInView();
    useEffect(() => {
      if (!data) return;

      const pageLastIdx = data.pages.length - 1;
      const isLast = data?.pages[pageLastIdx].isLast;

      if (!isLast && inView) fetchNextPage();
    }, [inView]);

    return <div ref={ref} />;
  };

  return (
    <>
      <Seo templateTitle='Artwork' />
      <NavBar title='ArtPlatform' />
      <TabLayout classNameChild='mt-2' fullWidth>
        {status === 'loading' && <p>불러오는 중</p>}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/** @ts-ignore **/}
        {status === 'error' && <p>{error.message}</p>}
        <div className='from-20% via-60% to-20% relative mb-1.5 flex h-64 touch-none items-center justify-center bg-gradient-to-br from-[#6F38C5] via-[#87A2FB] to-[#ADDDD0] px-0 dark:from-indigo-900 dark:via-cyan-700 dark:to-emerald-600'>
          <Lottie
            animationData={ArtistAnimation}
            className='mr-4 w-[140px] md:w-[240px]'
          />
          <div className='flex-col space-y-3 py-8 text-gray-100 md:left-24'>
            <h1>
              2023 금샘미술관
              <br className='visible lg:hidden' /> 전시 작품 공모
            </h1>
            <p>2023.04.01 - 05.30</p>
            <Link
              href='/exhibition/2023-summer-ks'
              className='btn-outline btn text-gray-100'
            >
              더 알아보기
            </Link>
          </div>
        </div>
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 400: 1, 768: 2, 1024: 3, 1600: 4 }}
        >
          <Masonry gutter='0.4rem'>
            {status === 'success' &&
              data.pages.map((group, groupIndex: number) =>
                group.artworks.map((artwork: ArtworkType, index: number) => (
                  <>
                    <Link
                      href={'/artwork/' + artwork.id}
                      key={artwork.id}
                      className='group relative flex cursor-pointer justify-center overflow-hidden bg-base-100 text-center dark:border-slate-600'
                    >
                      {artwork.thumbnail && (
                        <div className='relative m-0 w-full p-0'>
                          {artwork.thumbnail.mediaType === 'image' ? (
                            artwork.thumbnail.mediaUrl !== 'string' && (
                              <Image
                                src={artwork.thumbnail.mediaUrl}
                                alt={artwork.title}
                                width={300}
                                height={300}
                                className='w-full cursor-zoom-in object-contain duration-500 ease-in-out group-hover:scale-110'
                              />
                            )
                          ) : (
                            <video
                              className='group-hover:blur-1 m-0 w-full duration-300 ease-in-out group-hover:scale-105'
                              src={
                                NEXT_PUBLIC_MEDIA_STORAGE_URL +
                                '/' +
                                artwork.thumbnail.mediaUrl
                              }
                              autoPlay
                              loop
                              muted
                              playsInline
                            />
                          )}
                        </div>
                      )}
                      <div className='absolute h-full w-full bg-black/10 duration-500 group-hover:opacity-0'></div>
                      {artwork.title && (
                        <p className='absolute bottom-2 left-2 mr-2 rounded-md bg-dark/40 px-3 py-2 text-left text-xl font-bold text-white backdrop-blur'>
                          {artwork.title}
                        </p>
                      )}
                    </Link>
                    {groupIndex === 0 && index === 6 && (
                      <Link
                        href='/blog/staff-vlog'
                        key={artwork.id + '_1'}
                        className='group relative flex cursor-pointer justify-center overflow-hidden bg-base-100 text-center dark:border-slate-600'
                      >
                        <div className='relative m-0 w-full p-0'>
                          <Image
                            src='prod/blog/staff-vlog.jpeg'
                            alt='staff-vlog-thumbnail'
                            width={300}
                            height={300}
                            className='w-full cursor-zoom-in object-contain duration-500 ease-in-out group-hover:scale-110'
                          />
                        </div>
                        <div className='absolute h-full w-full duration-500 group-hover:bg-dark/30'></div>

                        <p className='absolute bottom-2 left-2 mr-2 rounded-md bg-dark/40 px-3 py-2 text-left text-xl font-bold text-white backdrop-blur'>
                          staff vlog
                        </p>
                      </Link>
                    )}
                  </>
                ))
              )}
            <div ref={bottom} className='mb-1 h-1'>
              <ObservationComponent />
              {isFetchingNextPage ? '로딩중...' : ''}
            </div>
          </Masonry>
        </ResponsiveMasonry>
      </TabLayout>
      <Footer />
      <BottomBar tab='playlist' />
    </>
  );
}
