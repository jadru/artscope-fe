'use client';

import ArtworkItemforFeed from '@/app/feed/post/ArtworkItemforFeed';
import FeedListItem from '@/app/feed/post/FeedListItem';

import { feedItemType } from '@/types';

export default function FeedList({ data }: { data: feedItemType[] }) {
  return (
    <>
      <div className='flex flex-col'>
        {data.map((feed) =>
          feed.type === 'artwork' ? (
            <ArtworkItemforFeed feed={feed} key={feed.id} />
          ) : (
            <FeedListItem feed={feed} key={feed.id} />
          )
        )}
      </div>
    </>
  );
}
