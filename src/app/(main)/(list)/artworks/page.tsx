'use client';

import { Skeleton } from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { notFound } from 'next/navigation';
import { ReactElement, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

import RootLayout from '@/components/RootLayout';
import Title from '@/components/Title';

import ArtworkItem from '@/app/(main)/(list)/artworks/ArtworkItem';

import { ArtWorkApiResponseType } from '@/types/artwork';

const SkeletonArtwork = () => (
  <div className='w-full'>
    <Skeleton className='h-[190px] w-full' />
    <div className='flex w-full items-center justify-between px-3 pb-3 pt-3'>
      <div>
        <Skeleton className='h-3 w-[140px] rounded-full' />
        <Skeleton className='mt-2 h-3 w-[140px] rounded-full' />
      </div>
      <Skeleton className='h-4 w-[70px] rounded-full' />
    </div>
  </div>
);
export default function Page() {
  const bottom = useRef(null);
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

  const {
    data,
    isSuccess,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
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
    <RootLayout className='w-full'>
      <Title
        title='Artworks'
        description='감각적인 예술 작품들을 살펴보세요.'
        divider={false}
      />
      <div>
        {isSuccess && (
          <div className='grid w-full grid-cols-2 gap-1.5 px-1 md:px-0 md:pb-1'>
            {data.pages.map((group) =>
              group.artworks.map((aw) => (
                <ArtworkItem artwork={aw} key={aw.artwork.id} />
              ))
            )}
            <div ref={bottom}>
              <ObservationComponent />
            </div>
          </div>
        )}
        {isLoading && (
          <div className='grid w-full grid-cols-2 gap-1.5 px-1 md:px-0 md:pb-1'>
            <SkeletonArtwork />
            <SkeletonArtwork />
            <SkeletonArtwork />
            <SkeletonArtwork />
            <SkeletonArtwork />
            <SkeletonArtwork />
            <SkeletonArtwork />
            <SkeletonArtwork />
          </div>
        )}
        {isFetchingNextPage && (
          <div className='grid w-full grid-cols-2 gap-1.5 px-1 md:px-0 md:pb-1'>
            <SkeletonArtwork />
            <SkeletonArtwork />
            <SkeletonArtwork />
            <SkeletonArtwork />
            <SkeletonArtwork />
            <SkeletonArtwork />
            <SkeletonArtwork />
            <SkeletonArtwork />
          </div>
        )}
        {data && data.pages[0].artworks.length === 0 && (
          <h3 className='text-center'>아직 작성된 작품이 없습니다.</h3>
        )}
      </div>
    </RootLayout>
  );
}
