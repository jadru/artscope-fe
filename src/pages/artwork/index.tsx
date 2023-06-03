import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { ReactElement, useEffect, useRef } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from 'react-query';

import Footer from '@/components/Footer';
import ResponsiveGrid from '@/components/Grid/ResponsiveGrid';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import { artworkList } from '@/api/artwork';

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
      <NavBar className='border-b-0' />
      <TabLayout fullWidth top>
        <ResponsiveGrid>
          {(status === 'loading' && <p>불러오는 중</p>) ||
            (status === 'success' &&
              data.pages.map((group) =>
                group.artworks.map((aw: ArtworkType) => (
                  <>
                    <Link
                      href={'/artwork/' + aw.artwork.id}
                      key={aw.artwork.id}
                      className='group relative flex h-auto w-full cursor-pointer flex-col justify-center overflow-hidden border-2 border-transparent bg-base-100 text-center focus:border-black'
                    >
                      {aw.artwork.thumbnail && (
                        <div className='m-0 grid w-full justify-items-stretch p-0'>
                          <Image
                            src={aw.artwork.thumbnail.mediaUrl}
                            alt={aw.artwork.title}
                            width={400}
                            height={400}
                            placeholder='blur' // 추가
                            blurDataURL='data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==' // 추가
                            className='h-[100vw] w-full cursor-pointer object-cover md:h-[50vw] lg:h-[33vw] xl:h-[25vw] 2xl:h-[20vw]'
                          />
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
                  </>
                ))
              ))}
          <div ref={bottom} className='mb-1 h-1'>
            <ObservationComponent />
          </div>
        </ResponsiveGrid>
        {isFetchingNextPage ? '로딩중...' : ''}
      </TabLayout>
      <Footer />
      <BottomBar tab='playlist' />
    </>
  );
}
