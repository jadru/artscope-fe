'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { ReactElement, useEffect, useRef } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useInView } from 'react-intersection-observer';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import { artwork } from '@/api';
import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';

import { ArtworkType } from '@/types';

const OFFSET = 12;

export default function Artwork() {
  const bottom = useRef(null);
  const { data, isFetchingNextPage, fetchNextPage, status } = useInfiniteQuery(
    ['artworkList'],
    async ({ pageParam = 0 }) => {
      return await artwork
        .list({
          size: OFFSET,
          page: pageParam,
        })
        .then((res) => res.data);
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.pageInfo.page < lastPage.pageInfo.totalPages
          ? lastPage.pageInfo.page + 1
          : undefined,
    }
  );

  const ObservationComponent = (): ReactElement => {
    const [ref, inView] = useInView();
    useEffect(() => {
      if (!data) return;

      const pageLastIdx = data.pages.length - 1;
      const isLast =
        data?.pages[pageLastIdx].pageInfo.totalPages ==
        data?.pages[pageLastIdx].pageInfo.page;

      if (!isLast && inView) fetchNextPage();
    }, [inView]);

    return <div ref={ref} />;
  };

  return (
    <>
      <Seo templateTitle='작품 목록' />
      <NavBar className='border-b-0' />
      <TabLayout classNameChild='' fullWidth top>
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            400: 1,
            768: 2,
            1024: 3,
            1600: 4,
          }}
        >
          <Masonry gutter='0.3rem'>
            {(status === 'loading' && <p>불러오는 중</p>) ||
              (status === 'success' &&
                data.pages.map((group) =>
                  group.artworks.map((aw: ArtworkType) => (
                    <>
                      <Link
                        href={'/artwork/' + aw.artwork.id}
                        key={aw.artwork.id}
                        className='group relative flex h-auto w-full cursor-pointer justify-center overflow-hidden bg-base-100 text-center dark:border-slate-600'
                      >
                        {aw.artwork.thumbnail && (
                          <div className='m-0 grid w-full justify-items-stretch p-0'>
                            {aw.artwork.thumbnail.mediaType === 'image' ? (
                              aw.artwork.thumbnail.mediaUrl !== 'string' && (
                                <Image
                                  src={aw.artwork.thumbnail.mediaUrl}
                                  alt={aw.artwork.title}
                                  width={400}
                                  height={400}
                                  placeholder='blur' // 추가
                                  blurDataURL='data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==' // 추가
                                  className='w-full cursor-zoom-in object-contain duration-200 ease-in-out group-hover:scale-110'
                                />
                              )
                            ) : (
                              <video
                                className='group-hover:blur-1 m-0 w-full duration-200 ease-in-out group-hover:scale-105'
                                src={
                                  NEXT_PUBLIC_MEDIA_STORAGE_URL +
                                  '/' +
                                  aw.artwork.thumbnail.mediaUrl
                                }
                                autoPlay
                                loop
                                muted
                                playsInline
                              />
                            )}
                          </div>
                        )}
                        <div className='absolute h-full w-full bg-black/10 duration-200 group-hover:opacity-0'></div>
                        {aw.artwork.title && (
                          <div className='absolute bottom-2 left-2 mr-2 rounded-md bg-dark/40 px-3 py-2 text-left backdrop-blur'>
                            <div className='flex items-center text-lg font-light text-white'>
                              {aw.artwork.likes}{' '}
                              {aw.isLike ? (
                                <AiFillHeart className='ml-1 inline' />
                              ) : (
                                <AiOutlineHeart className='ml-1 inline' />
                              )}
                            </div>
                            <p className='text-xl font-bold text-white'>
                              {aw.artwork.title}
                            </p>
                          </div>
                        )}
                      </Link>
                    </>
                  ))
                ))}
            <div ref={bottom} className='mb-1 h-1'>
              <ObservationComponent />
            </div>
          </Masonry>
        </ResponsiveMasonry>
        {isFetchingNextPage ? '로딩중...' : ''}
      </TabLayout>
      <Footer />
      <BottomBar tab='playlist' />
    </>
  );
}
