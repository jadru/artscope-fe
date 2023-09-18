'use client';

import FeedListItem from '@/app/feed/post/FeedListItem';

import { feedItemType } from '@/types';

export type TabType = 'feed' | 'post' | 'artwork' | 'exhibition';

export default function FeedList({ data }: { data: feedItemType[] }) {
  return (
    <>
      <div className='flex flex-col'>
        {data.map((feed) => (
          <FeedListItem feed={feed} key={feed.id} />
        ))}
      </div>
    </>
  );
}
