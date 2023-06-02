import Lottie from 'lottie-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { ReactElement, useEffect, useRef } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from 'react-query';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import { artworkList } from '@/api/artwork';
import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';

import ArtistAnimation from '../../public/animation/141993-spin-sobky-like-siri.json';

import { ArtworkType } from '@/types';

const OFFSET = 12;

export default function Artwork() {
  const bottom = useRef(null);
  const { data, isFetchingNextPage, fetchNextPage, status } = useInfiniteQuery(
    ['artworkList'],
    async ({ pageParam = 0 }) => {
      return await artworkList(
        {
          size: OFFSET,
          page: pageParam,
        },
        { withCredentials: true }
      );
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
      <NavBar title='ArtPlatform' />
      <TabLayout classNameChild='' fullWidth top>
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            400: 1,
            768: 2,
            1024: 3,
            1600: 4,
          }}
        >
          <Masonry gutter='0.5rem'>
            {(status === 'loading' && <p>불러오는 중</p>) ||
              (status === 'success' &&
                data.pages.map((group, groupIndex: number) =>
                  group.artworks.map((aw: ArtworkType, index: number) => (
                    <>
                      <Link
                        href={'/artwork/' + aw.artwork.id}
                        key={aw.artwork.id}
                        className='group relative flex h-auto w-full cursor-pointer flex-col justify-center overflow-hidden border-2 border-transparent bg-base-100 text-center focus:border-black'
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
                                  className='w-full cursor-pointer object-contain'
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
                        {aw.artwork.title && (
                          <div className='bottom-2 left-2 mr-2 rounded-md px-3 py-2 text-left'>
                            <p className='text-xl font-bold group-hover:underline'>
                              {aw.artwork.title}
                              <br />
                              {aw.artwork.authorName}
                            </p>
                            <div className='flex items-center text-lg font-light'>
                              {aw.artwork.likes}{' '}
                              {aw.isLike ? (
                                <AiFillHeart className='ml-1 inline' />
                              ) : (
                                <AiOutlineHeart className='ml-1 inline' />
                              )}
                            </div>
                          </div>
                        )}
                      </Link>
                      {groupIndex === 0 && index === 5 && (
                        <Link
                          href='/blog'
                          key={aw.artwork.id + '_1'}
                          className='group relative flex cursor-pointer justify-center overflow-hidden bg-base-100 text-center dark:border-slate-600'
                        >
                          <div className='relative m-0 w-full p-0'>
                            <Image
                              src='prod/blog/blog-thumbnail.jpeg'
                              alt='staff-vlog-thumbnail'
                              width={400}
                              height={400}
                              sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1600px) 33.3vw, 25vw'
                              placeholder='blur' // 추가
                              blurDataURL='data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==' // 추가
                              className='w-full object-contain duration-200 ease-in-out'
                            />
                          </div>
                          <div className='absolute h-full w-full duration-200 group-hover:bg-dark/10'></div>
                        </Link>
                      )}
                      {groupIndex === 0 && index === 10 && (
                        <Link
                          href='/blog/634d09fd-79f8-4807-a517-17ebd1c45054'
                          key='634d09fd-79f8-4807-a517-17ebd1c45054'
                          className='from-20% via-60% to-20% group relative flex h-64 cursor-pointer items-center justify-center bg-gradient-to-br from-[#6F38C5] via-[#87A2FB] to-[#ADDDD0] px-0 dark:from-indigo-900 dark:via-cyan-700 dark:to-emerald-600'
                        >
                          <Lottie
                            animationData={ArtistAnimation}
                            className='absolute mr-4 w-[190px] duration-200 ease-in-out group-hover:scale-125'
                          />
                          <div className='flex-col space-y-3 py-8 text-center text-gray-100 duration-200 group-hover:font-bold md:left-24'>
                            <p className='text-4xl'>
                              플랫폼 Artscope
                              <br /> 작품 공모
                            </p>
                          </div>
                        </Link>
                      )}
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
