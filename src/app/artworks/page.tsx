'use client';

import { Card } from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

import ResponsiveGrid from '@/components/ResponsiveGrid';

import NewArtworkModal from '@/app/artworks/NewArtworkModalButton';
import UserInfo from '@/app/UserInfo';
import { userStore } from '@/states';

import { ArtWorkApiResponseType, ArtworkType } from '@/types';

export default function Page() {
  const bottom = useRef(null);
  const LIMIT = 10;
  const { user } = userStore();
  const { data, isSuccess, fetchNextPage } = useInfiniteQuery(
    ['artworks'],
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
    <div className='container mx-auto flex flex-col items-center justify-center'>
      <div className='container max-w-screen-md'>
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
                <Card key={aw.artwork.id}>
                  <Link
                    href={'/artwork/' + aw.artwork.id}
                    className='bg-base-100 group relative flex h-full w-full cursor-pointer justify-center overflow-hidden text-center'
                  >
                    <Image
                      src={aw.artwork.thumbnail.mediaUrl}
                      alt={aw.artwork.title}
                      width={200}
                      height={200}
                      placeholder='blur' // 추가
                      blurDataURL='data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==' // 추가
                      className='w-full object-cover duration-75 group-hover:opacity-70'
                    />

                    <div className='absolute bottom-0 left-0 m-0 w-full bg-white p-2 duration-75 group-hover:bg-orange-50'>
                      <p className='text-light text-md truncate text-left font-serif group-hover:text-gray-700'>
                        {aw.artwork.title} - {aw.artwork.authorName}
                      </p>
                    </div>
                  </Link>
                </Card>
              ))
            )}
            <div ref={bottom} className='mb-1 h-1'>
              <ObservationComponent />
            </div>
          </ResponsiveGrid>
        )}
      </div>
    </div>
  );
}
