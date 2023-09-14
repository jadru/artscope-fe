'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement, useEffect, useRef } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useInView } from 'react-intersection-observer';

import ResponsiveGrid from '@/components/ResponsiveGrid';

import NewArtworkModal from '@/app/feed/artwork/NewArtworkModalButton';
import UserInfo from '@/app/UserInfo';
import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';
import { userStore } from '@/states';

import { ArtWorkApiResponseType, ArtworkType } from '@/types';

export default function Index() {
  const bottom = useRef(null);
  const LIMIT = 10;
  const { user } = userStore();
  const { data, isSuccess, fetchNextPage } = useInfiniteQuery(
    ['artwork-list'],
    ({ pageParam = 0 }) =>
      axios
        .get('/api/artworks', {
          params: {
            page: pageParam,
            size: LIMIT,
            sortDirection: 'DESC',
          },
        })
        .then((res) => res.data as ArtWorkApiResponseType),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.pageInfo.totalPages - lastPage.pageInfo.page > 0
          ? lastPage.pageInfo.page + 1
          : null;
      },
    }
  );

  const ObservationComponent = (): ReactElement => {
    const [ref, inView] = useInView();
    useEffect(() => {
      if (!data) return;

      const pageLastIdx = data.pages.length - 1;
      const isLast =
        data?.pages[pageLastIdx].pageInfo.totalPages -
          data?.pages[pageLastIdx].pageInfo.page ===
        0;

      if (!isLast && inView) fetchNextPage();
    }, [inView]);

    return <div ref={ref} />;
  };
  return (
    <>
      {user.username && (
        <div className='flex flex-row justify-start gap-2 space-y-1 p-3'>
          <UserInfo />
          <NewArtworkModal
            submitBtnText='업로드'
            placeholder='감각적인 작품이 있나요?'
          />
        </div>
      )}
      {isSuccess && (
        <ResponsiveGrid>
          {data.pages.map((group) =>
            group.artworks.map((aw: ArtworkType) => (
              <>
                <Link
                  href={'/artwork/' + aw.artwork.id}
                  key={aw.artwork.id}
                  className='bg-base-100 group relative flex h-auto w-full cursor-pointer justify-center overflow-hidden text-center dark:border-slate-600'
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
                    <div className='bg-dark/40 absolute bottom-2 left-2 mr-2 rounded-md px-3 py-2 text-left backdrop-blur'>
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
          )}
          <div ref={bottom} className='mb-1 h-1'>
            <ObservationComponent />
          </div>
        </ResponsiveGrid>
      )}
    </>
  );
}
