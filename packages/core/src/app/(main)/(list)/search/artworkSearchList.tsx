import { useRouter } from 'next/navigation';
import React from 'react';
import { MdArrowForwardIos } from 'react-icons/md';

import ResponsiveGrid from '@/components/ResponsiveGrid';

import ArtworkItem from '@/app/(main)/(list)/artworks/ArtworkItem';

import { DetailedArtworkType } from '@/types/artwork';
import { pageInfoType } from '@/types/default';

export default function ArtworkSearchList({
  artworks,
  pageInfo,
  initialSearchKeyword,
  expanded,
}: {
  artworks: DetailedArtworkType[];
  pageInfo: pageInfoType;
  initialSearchKeyword: string | null;
  expanded?: boolean;
}) {
  const { push } = useRouter();
  return (
    <div className='border-default-400 w-full rounded-2xl border py-2'>
      <>
        <h3 className='mx-3 mb-2'>아트워크 검색 결과</h3>
        <div className='px-2'>
          <ResponsiveGrid>
            {artworks.map((item) => (
              <ArtworkItem
                artwork={{ artwork: item, isLiked: false }}
                key={item.id}
              />
            ))}
          </ResponsiveGrid>
          {!expanded && pageInfo.totalElements > 6 && (
            <div
              className='hover:bg-default-100 mx-2 flex cursor-pointer items-center justify-start rounded-2xl px-3 py-2 transition'
              onClick={() =>
                push(
                  `/search?c=${initialSearchKeyword ?? ''}&type=${'ARTWORK'}`
                )
              }>
              <p>{pageInfo.totalElements}개의 아트워크 검색결과 더보기</p>
              <MdArrowForwardIos className='ml-1 inline' />
            </div>
          )}
        </div>
      </>
    </div>
  );
}
