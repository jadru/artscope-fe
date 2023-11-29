'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { notFound } from 'next/dist/client/components/not-found';
import React, { useEffect, useRef } from 'react';

import FeedObservationComponent from '@/components/ObservationComponent';
import Title from '@/components/Title';

import LocationItem from '@/app/(main)/(list)/spaces/LocationItem';
import SkeletonSpace from '@/app/(main)/(list)/spaces/SkeletonSpace';
import jxios from '@/utils/jxios';

import { LocationResponseType } from '@/types/location';

export default function AgoraListPage() {
  const bottom = useRef(null);
  const LIMIT = 10;

  const fetchLocation = async (page: number) =>
    await jxios
      .get('/api/location/search', {
        params: {
          keyword: '',
          page: page,
          size: LIMIT,
        },
      })
      .then((res) => res.data as LocationResponseType);

  const {
    data,
    isSuccess,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['spaces'],
    queryFn: async ({ pageParam }) => await fetchLocation(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage) {
        return null;
      } else {
        return lastPage.pageInfo.totalPages - lastPage.pageInfo.page > 0
          ? lastPage.pageInfo.page + 1
          : null;
      }
    },
  });

  useEffect(() => {
    if (isError) {
      notFound();
    }
  }, [isError]);

  return (
    <>
      <Title title='Space' description='공간을 소개합니다.' divider={false} />
      <div className='container mx-auto flex flex-col items-stretch gap-2'>
        {isSuccess && (
          <>
            {data.pages.map((group) =>
              group.locations.map((location) => (
                <LocationItem location={location} key={location.locationId} />
              ))
            )}
          </>
        )}
        {isLoading && (
          <>
            <SkeletonSpace />
            <SkeletonSpace />
            <SkeletonSpace />
            <SkeletonSpace />
            <SkeletonSpace />
            <SkeletonSpace />
            <SkeletonSpace />
            <SkeletonSpace />
          </>
        )}
        {isFetchingNextPage && (
          <>
            <SkeletonSpace />
            <SkeletonSpace />
            <SkeletonSpace />
            <SkeletonSpace />
            <SkeletonSpace />
            <SkeletonSpace />
            <SkeletonSpace />
            <SkeletonSpace />
          </>
        )}
        {isSuccess && (
          <div ref={bottom}>
            <FeedObservationComponent
              hasNext={
                data.pages[data.pages.length - 1].pageInfo.page + 1 <
                data.pages[data.pages.length - 1].pageInfo.totalPages
              }
              hasData={Boolean(data)}
              fetchNextPage={fetchNextPage}
            />
          </div>
        )}
        {data && data.pages[0].locations.length === 0 && (
          <h3 className='text-center'>아직 작성된 공간이 없습니다</h3>
        )}
      </div>
    </>
  );
}
