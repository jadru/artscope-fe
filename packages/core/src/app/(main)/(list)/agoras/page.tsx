'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { notFound } from 'next/dist/client/components/not-found';
import React, { useEffect, useRef } from 'react';

import FeedObservationComponent from '@/components/ObservationComponent';
import Title from '@/components/Title';

import AgoraItem from '@/app/(main)/(list)/agoras/AgoraItem';
import SkeletonAgora from '@/app/(main)/(list)/agoras/SkeletonAgora';
import jxios from '@/utils/jxios';

import { AgoraListType } from '@/types/agora';

export default function AgoraListPage() {
  const bottom = useRef(null);
  const LIMIT = 10;

  const fetchAgora = async (page: number) =>
    await jxios
      .get('/api/agoras', {
        params: {
          page: page,
          size: LIMIT,
        },
      })
      .then((res) => res.data as AgoraListType);

  const {
    data,
    isSuccess,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['agoras'],
    queryFn: async ({ pageParam }) => await fetchAgora(pageParam),
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
      <Title
        title='Agora'
        description='다양한 주제에 대해 토론하고 투표하세요.'
        divider={false}
      />
      <div className='container mx-auto'>
        {isSuccess && (
          <>
            {data.pages.map((group) =>
              group.agoras.map((agora) => (
                <AgoraItem agora={agora} key={agora.id} />
              ))
            )}
          </>
        )}
        {isLoading && (
          <>
            <SkeletonAgora />
            <SkeletonAgora />
            <SkeletonAgora />
            <SkeletonAgora />
            <SkeletonAgora />
            <SkeletonAgora />
            <SkeletonAgora />
            <SkeletonAgora />
          </>
        )}
        {isFetchingNextPage && (
          <>
            <SkeletonAgora />
            <SkeletonAgora />
            <SkeletonAgora />
            <SkeletonAgora />
            <SkeletonAgora />
            <SkeletonAgora />
            <SkeletonAgora />
            <SkeletonAgora />
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
        {data && data.pages[0].agoras.length === 0 && (
          <h3 className='text-center'>아직 작성된 아고라가 없습니다.</h3>
        )}
      </div>
    </>
  );
}
