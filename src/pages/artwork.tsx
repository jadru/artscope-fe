import Image from 'next/image';
import * as React from 'react';
import { useRef } from 'react';
import { useInfiniteQuery } from 'react-query';

import ResponsiveGrid from '@/components/Grid/ResponsiveGrid';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import jxios from '@/utils/jxios';

import { ArtWorkApiResponseType } from '@/types';

const OFFSET = 10;
const getArtWorkList = ({ pageParam = 0 }) =>
  jxios
    .get('/api/artworks', {
      params: {
        size: OFFSET,
        page: pageParam,
      },
    })
    .then((res) => res?.data);
export default function Playlist() {
  const bottom = useRef(null);
  const { data, error, isFetchingNextPage, status } = useInfiniteQuery(
    'artworkList', // data의 이름
    getArtWorkList,
    {
      getNextPageParam: (lastPage: ArtWorkApiResponseType) => {
        if (lastPage.pageInfo.totalPages <= lastPage.pageInfo.page + 1)
          return undefined;
        else return lastPage.pageInfo.page + 1;
      },
    }
  );

  return (
    <>
      <Seo templateTitle='Artwork' />
      <NavBar title='ArtPlatform' />
      <TabLayout classNameChild='mt-2'>
        {status === 'loading' && <p>불러오는 중</p>}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/** @ts-ignore **/}
        {status === 'error' && <p>{error.message}</p>}
        <ResponsiveGrid>
          {status === 'success' &&
            data.pages.map((group) =>
              group.artworks.map((artwork) => (
                <div key={artwork.id} className='w-full border bg-base-100'>
                  {artwork.thumbnail && (
                    <div className='relative m-0 h-32 w-full p-0'>
                      {artwork.thumbnail.mediaType === 'image' ? (
                        artwork.thumbnail.mediaUrl !== 'string' && (
                          <Image
                            src={artwork.thumbnail.mediaUrl}
                            alt={artwork.title}
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
                          className='m-0 w-full border object-cover p-0'
                          src={artwork.thumbnail.mediaUrl}
                        />
                      )}
                    </div>
                  )}
                  <div className=''>
                    <h2 className='m-1.5 text-2xl font-light'>
                      {artwork.title}
                    </h2>
                    <p className='m-1.5'> {artwork.description}</p>
                  </div>
                </div>
              ))
            )}
          <div ref={bottom} />
          {isFetchingNextPage && <p>계속 불러오는 중</p>}
        </ResponsiveGrid>
      </TabLayout>
      <BottomBar tab='artwork' />
    </>
  );
}
