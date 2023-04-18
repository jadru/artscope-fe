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

const OFFSET = 12;

export default function Artwork() {
  const bottom = useRef(null);
  const {
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    status,
    hasNextPage,
  } = useInfiniteQuery(
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
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 400: 1, 768: 2, 1024: 3, 1600: 4 }}
        >
          <Masonry gutter='0.4rem'>
            {status === 'success' &&
              data.pages.map((group) =>
                group.artworks.map((artwork: ArtworkType) => (
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
                              width={artwork.thumbnail.imageWidth}
                              height={artwork.thumbnail.imageHeight}
                              className='cursor-zoom-in object-cover duration-500 ease-in-out group-hover:scale-110'
                              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                            />
                          )
                        ) : (
                          <video
                            className='m-0 w-full border object-cover duration-300 ease-in-out group-hover:scale-105'
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
                    <div className='absolute h-full w-full bg-black/20 duration-500 group-hover:opacity-0'></div>
                    <p className='absolute bottom-2 left-2 mr-2 rounded-md bg-dark/40 px-3 py-2 text-left text-xl font-bold text-white backdrop-blur'>
                      {artwork.title}
                    </p>
                  </Link>
                ))
              )}
            <div ref={bottom} className='mb-1 h-1'>
              <ObservationComponent />
              {isFetchingNextPage
                ? 'Loading more...'
                : hasNextPage
                ? 'Load More'
                : 'Nothing more to load'}
            </div>
          </Masonry>
        </ResponsiveMasonry>
      </TabLayout>
      <Footer />
      <BottomBar tab='artwork' />
    </>
  );
}
