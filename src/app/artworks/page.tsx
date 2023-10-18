'use client';

import { Card, Skeleton } from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { notFound } from 'next/navigation';
import { ReactElement, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

import ResponsiveGrid from '@/components/ResponsiveGrid';
import RootLayout from '@/components/RootLayout';

import ArtworkItem from '@/app/artworks/ArtworkItem';
import NewArtworkModal from '@/app/artworks/NewArtworkModalButton';
import { useUser } from '@/states';

import { ArtWorkApiResponseType, ArtworkType } from '@/types/artwork';

const SkeletonArtwork = () => (
  <Card className='w-full gap-2'>
    <Skeleton className='h-[180px] w-full rounded-2xl' />
    <div className='mx-3 mb-3 mt-2 flex h-4 justify-between'>
      <Skeleton className=' w-[140px] rounded-full' />
      <Skeleton className=' w-[70px] rounded-full' />
    </div>
  </Card>
);
export default function Page() {
  const bottom = useRef(null);
  const { user } = useUser();
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
      .then((res) => {
        return res.data as ArtWorkApiResponseType;
      })
      .catch((err) => {
        throw Error(err);
      });

  const { data, isSuccess, refetch, fetchNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ['artworks'],
      queryFn: async ({ pageParam }) => await fetchArtworks({ pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        return lastPage.pageInfo.totalPages - lastPage.pageInfo.page > 0
          ? lastPage.pageInfo.page + 1
          : null;
      },
    });

  useEffect(() => {
    if (isError) {
      notFound();
    }
  }, [isError]);

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
    <RootLayout>
      {user && user.username && (
        <NewArtworkModal
          submitBtnText='업로드'
          placeholder='감각적인 작품이 있나요?'
          refetch={refetch}
        />
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
      {isLoading && (
        <ResponsiveGrid>
          <SkeletonArtwork />
          <SkeletonArtwork />
          <SkeletonArtwork />
          <SkeletonArtwork />
          <SkeletonArtwork />
          <SkeletonArtwork />
          <SkeletonArtwork />
          <SkeletonArtwork />
          <SkeletonArtwork />
          <SkeletonArtwork />
          <SkeletonArtwork />
          <SkeletonArtwork />
        </ResponsiveGrid>
      )}
      {data && data.pages[0].artworks.length === 0 && (
        <h3 className='text-center'>아직 작성된 작품이 없습니다.</h3>
      )}
    </RootLayout>
  );
}
