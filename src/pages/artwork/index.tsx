import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';
import Title from '@/components/Title';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { ArtworkType } from '@/types';

const OFFSET = 10;

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

  const handleObserver = useCallback(
    // eslint-disable-next-line
    (entries: any) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    if (bottom) {
      const element = bottom.current;
      const option = { threshold: 0 };

      const observer = new IntersectionObserver(handleObserver, option);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      observer.observe(element);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return () => observer.unobserve(element);
    } else return;
  }, [fetchNextPage, hasNextPage, handleObserver]);
  return (
    <>
      <Seo templateTitle='Artwork' />
      <NavBar title='ArtPlatform' />
      <TabLayout classNameChild='mt-2'>
        <Title>Artworks</Title>
        {status === 'loading' && <p>불러오는 중</p>}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/** @ts-ignore **/}
        {status === 'error' && <p>{error.message}</p>}
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 400: 1, 540: 2, 768: 2, 1024: 3 }}
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
                              className='object-cover duration-500 ease-in-out group-hover:scale-110'
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
                    <p className='absolute bottom-2 left-2 mr-2 rounded-md bg-dark/40 p-1 text-left text-xl font-bold text-white backdrop-blur duration-300 group-hover:ease-in-out'>
                      {artwork.title}
                    </p>
                  </Link>
                ))
              )}
            <div ref={bottom} className='h-2'>
              {isFetchingNextPage && hasNextPage ? 'Loading...' : ''}
            </div>
          </Masonry>
        </ResponsiveMasonry>
      </TabLayout>
      <Footer />
      <BottomBar tab='artwork' />
    </>
  );
}
