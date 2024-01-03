import { useRouter } from 'next/navigation';
import React from 'react';
import { MdArrowForwardIos } from 'react-icons/md';

import FeedListItemPost from '@/app/(main)/(list)/(feed)/FeedListItem/FeedListItemPost';

import { pageInfoType } from '@/types/default';
import { feedItemType } from '@/types/feed';

export default function PostSearchList({
  posts,
  pageInfo,
  initialSearchKeyword,
  expanded,
}: {
  posts: feedItemType[];
  pageInfo: pageInfoType;
  initialSearchKeyword: string | null;
  expanded?: boolean;
}) {
  const { push } = useRouter();
  return (
    <div className='border-default-400 w-full rounded-2xl border py-2'>
      <h3 className='mx-3 mb-2'>포스트 검색 결과</h3>
      <div className='px-2'>
        {posts.map((item) => (
          <FeedListItemPost feed={item} key={item.id} />
        ))}
      </div>
      {!expanded && pageInfo.totalElements > 6 && (
        <div
          className='hover:bg-default-100 mx-2 flex cursor-pointer items-center justify-start rounded-2xl px-3 py-2 transition'
          onClick={() =>
            push(`/search?c=${initialSearchKeyword ?? ''}&type=${'POST'}`)
          }>
          <p>{pageInfo.totalElements}개의 포스트 검색결과 더보기</p>
          <MdArrowForwardIos className='ml-1 inline' />
        </div>
      )}
    </div>
  );
}
