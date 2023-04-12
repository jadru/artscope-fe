import jwt_decode from 'jwt-decode';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { toast } from 'react-toastify';

import ResponsiveGrid from '@/components/Grid/ResponsiveGrid';
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
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
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
  useEffect(() => {
    if (jxios.defaults.headers.common.Authorization) {
      const decoded: { auth: string } = jwt_decode(
        jxios.defaults.headers.common.Authorization as string
      );
      if (decoded.auth.includes('ROLE_ADMIN')) {
        setIsAdmin(true);
      }
    }
  }, []);

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
        <ResponsiveGrid>
          {status === 'success' &&
            data.pages.map((group) =>
              group.artworks.map((artwork: ArtworkType) => (
                <Link
                  href={'/artwork/' + artwork.id}
                  key={artwork.id}
                  className='w-full rounded-2xl border bg-base-100 hover:bg-base-200 dark:border-slate-600'
                >
                  {artwork.thumbnail && (
                    <div className='relative m-0 h-64 w-full p-0 md:h-32'>
                      {artwork.thumbnail.mediaType === 'image' ? (
                        artwork.thumbnail.mediaUrl !== 'string' && (
                          <Image
                            src={artwork.thumbnail.mediaUrl}
                            alt={artwork.title}
                            className='rounded-2xl'
                            fill
                            style={{
                              margin: 0,
                              padding: 0,
                              objectFit: 'cover',
                            }}
                          />
                        )
                      ) : (
                        <video
                          className='m-0 h-64 w-full rounded-2xl border object-cover p-0 md:h-32'
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
                  <div>
                    <h2 className='mx-2 mt-2 truncate text-xl font-bold'>
                      {artwork.title}
                    </h2>
                    <p className='mx-2 mb-2'> {artwork.description}</p>
                    {isAdmin && (
                      <button
                        onClick={() =>
                          jxios
                            .delete('/api/artworks/' + artwork.id)
                            .then(() => {
                              router.replace(router.asPath).then(() => {
                                toast.success(
                                  artwork.title + '이 삭제되었습니다.'
                                );
                              });
                            })
                        }
                      >
                        delete
                      </button>
                    )}
                  </div>
                </Link>
              ))
            )}
          <div ref={bottom} className='h-2'>
            {isFetchingNextPage && hasNextPage ? 'Loading...' : ''}
          </div>
        </ResponsiveGrid>
      </TabLayout>
      <BottomBar tab='artwork' />
    </>
  );
}
