'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ReactElement, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

import useUser from '@/hooks/useUser';

import ResponsiveGrid from '@/components/ResponsiveGrid';

import ArtworkItem from '@/app/artworks/ArtworkItem';
import NewArtworkModal from '@/app/artworks/NewArtworkModalButton';
import UserInfo from '@/app/UserInfo';

import { ArtWorkApiResponseType, ArtworkType } from '@/types';

export default function Page() {
  const bottom = useRef(null);
  const user = useUser();
  const LIMIT = 10;
  const fetchArtworks = async ({ pageParam = 0 }) =>
    await axios
      .get('/api/artworks', {
        params: {
          page: pageParam,
          size: LIMIT,
          sortDirection: 'DESC',
        },
      })
      .then((res) => res.data as ArtWorkApiResponseType);

  const { data, isSuccess, fetchNextPage } = useInfiniteQuery(
    ['artworks'],
    ({ pageParam = 0 }) => fetchArtworks({ pageParam }),
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

    return <div ref={ref} className='mb-1 h-1' />;
  };
  return (
    <div className='container mx-auto flex flex-col items-center justify-center'>
      <div className='container max-w-screen-md'>
        {user && user.username && (
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
                <ArtworkItem artwork={aw} key={aw.artwork.id} />
              ))
            )}
            <div ref={bottom}>
              <ObservationComponent />
            </div>
          </ResponsiveGrid>
        )}
      </div>
    </div>
  );
}
