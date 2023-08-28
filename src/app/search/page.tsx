'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactElement, useEffect, useLayoutEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

import Footer from '@/components/Footer';
import ResponsiveGrid from '@/components/Grid/ResponsiveGrid';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';
import Title from '@/components/Title';

import { artwork } from '@/api';

import { DetailedArtworkType } from '@/types';

const OFFSET = 12;

const SearchPage = () => {
  const bottom = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const {
    data,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    remove,
    status,
    fetchPreviousPage,
  } = useInfiniteQuery(
    ['searchList'],
    async ({ pageParam = 0 }) => {
      return await artwork
        .search(searchKeyword, {
          size: OFFSET,
          page: pageParam,
        })
        .then((res) => res.data);
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.pageInfo.page + 1 <= lastPage.pageInfo.totalPages
          ? lastPage.pageInfo.page + 1
          : undefined,
      getPreviousPageParam: (firstPage) =>
        firstPage.pageInfo.page !== 0 ? 0 : undefined,
    }
  );

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

  const handleSearchInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing && e.currentTarget.value === searchKeyword) {
      return;
    }
    setSearchKeyword(e.currentTarget.value);
    if (e.key.match('Enter')) callApi();
  };

  const callApi = async () => {
    await remove();
    await fetchPreviousPage();
  };

  return (
    <>
      <Seo templateTitle='검색' />
      <NavBar />
      <TabLayout fullWidth top>
        <Title>검색</Title>
        <div className='join mb-2'>
          <input
            id='keyword'
            type='text'
            ref={inputRef}
            placeholder='작품명, 설명, 작가, 태그'
            className='input join-item'
            onKeyDown={handleSearchInput}
          />
          <button className='btn join-item rounded-r-full' onClick={callApi}>
            검색
          </button>
        </div>
        <p>
          {searchKeyword !== '' &&
            data &&
            data.pages[0].pageInfo.totalElements + '개의 검색결과가 있습니다.'}
        </p>
        <ResponsiveGrid>
          {status === 'success' &&
            !isFetchingPreviousPage &&
            data.pages.map((group) =>
              group.artworks.map((artwork: DetailedArtworkType) => (
                <>
                  <Link
                    href={'/artwork/' + artwork.id}
                    key={artwork.id}
                    className='group relative flex h-auto w-full cursor-pointer flex-col justify-center overflow-hidden border-2 border-transparent bg-base-100 text-center focus:border-black dark:bg-transparent'
                  >
                    {artwork.thumbnail && (
                      <div className='m-0 grid w-full justify-items-stretch p-0'>
                        <Image
                          src={artwork.thumbnail.mediaUrl}
                          alt={artwork.title}
                          width={400}
                          height={400}
                          placeholder='blur' // 추가
                          blurDataURL='data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==' // 추가
                          className='h-[60vw] w-full cursor-pointer object-cover md:h-[30vw] lg:h-[23vw] xl:h-[15vw] 2xl:h-[10vw]'
                        />
                      </div>
                    )}
                    {artwork.title && (
                      <div className='bottom-2 left-2 mr-2 rounded-md px-3 py-2 text-left'>
                        <p className='text-xl font-bold group-hover:underline'>
                          {artwork.title}
                          <br />
                          {artwork.authorName}
                        </p>
                        <div className='flex items-center text-lg font-light'>
                          {artwork.likes} {/* {isLike ? ( */}
                          {/*   <AiFillHeart className='ml-1 inline' /> */}
                          {/* ) : ( */}
                          {/*   <AiOutlineHeart className='ml-1 inline' /> */}
                          {/* )} */}
                        </div>
                      </div>
                    )}
                  </Link>
                </>
              ))
            )}
        </ResponsiveGrid>
        <div ref={bottom} className='mb-1 h-1'>
          <ObservationComponent />
        </div>
        {isFetchingNextPage ? '로딩중...' : ''}
      </TabLayout>
      <Footer />
      <BottomBar tab='playlist' />
    </>
  );
};

export default SearchPage;
