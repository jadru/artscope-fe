import axios from 'axios';
import * as React from 'react';
import { useRef } from 'react';
import { useInfiniteQuery } from 'react-query';

import ResponsiveGrid from '@/components/Grid/ResponsiveGrid';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import { ArtWorkApiResponseType } from '@/types';

const OFFSET = 10;
const getArtWorkList = ({ pageParam = 0 }) =>
  axios
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
    <div>
      <Seo templateTitle='Artwork' />
      <main>
        <section>
          <NavBar title='ArtPlatform' />
          <TabLayout className='px-2' classNameChild='mt-2'>
            {status === 'loading' && <p>불러오는 중</p>}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/** @ts-ignore **/}
            {status === 'error' && <p>{error.message}</p>}
            <ResponsiveGrid>
              {status === 'success' &&
                data.pages.map((group) =>
                  group.artworks.map((artwork) => (
                    <div key={artwork.id}>
                      <p>{artwork.title}</p>
                      <p>{artwork.description}</p>
                      <p>
                        {new Date(artwork.createdTime).toLocaleDateString(
                          'ko-KR'
                        )}
                      </p>
                    </div>
                  ))
                )}
              <div ref={bottom} />
              {isFetchingNextPage && <p>계속 불러오는 중</p>}
            </ResponsiveGrid>
          </TabLayout>
          <BottomBar tab='artwork' />
        </section>
      </main>
    </div>
  );
}
