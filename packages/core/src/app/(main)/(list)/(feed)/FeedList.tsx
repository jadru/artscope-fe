import React, { useEffect, useState } from 'react';

import FeedListItemAgora from '@/app/(main)/(list)/(feed)/FeedListItem/FeedListItemAgora';
import FeedListItemArtwork from '@/app/(main)/(list)/(feed)/FeedListItem/FeedListItemArtwork';
import FeedListItemEvent from '@/app/(main)/(list)/(feed)/FeedListItem/FeedListItemEvent';
import FeedListItemPost from '@/app/(main)/(list)/(feed)/FeedListItem/FeedListItemPost';

import { feedItemType } from '@/types/feed';

type feedType = (feedItemType[] | feedItemType)[];

interface FeedListProps {
  data: feedItemType[];
}

export default function FeedList({ data }: FeedListProps) {
  const [feeds, setFeeds] = useState<feedType>([]);

  useEffect(() => {
    const newFeeds: feedType = [];
    let artworkGroup: feedItemType[] = [];

    data.forEach((item) => {
      if (item.type === 'artwork') {
        artworkGroup.push(item);
      } else {
        if (artworkGroup.length) {
          newFeeds.push(artworkGroup);
          artworkGroup = [];
        }
        newFeeds.push(item);
      }
    });

    if (artworkGroup.length) {
      newFeeds.push(artworkGroup);
    }

    setFeeds(newFeeds);
  }, [data]);

  const renderFeedItem = (feed: feedItemType | feedItemType[]) => {
    if (Array.isArray(feed)) {
      return (
        <div
          className={`grid ${
            feed.length === 1 || feed.length === 3
              ? 'grid-cols-1'
              : 'grid-cols-2'
          }`}>
          {feed.map((item) => (
            <FeedListItemArtwork feed={item} key={'artwork-' + item.id} />
          ))}
        </div>
      );
    } else {
      switch (feed.type) {
        case 'post':
          return <FeedListItemPost feed={feed} />;
        case 'event':
          return <FeedListItemEvent feed={feed} />;
        case 'agora':
          return <FeedListItemAgora feed={feed} />;
        default:
          return null;
      }
    }
  };

  return (
    <div className='flex max-w-full flex-col gap-4'>
      {feeds.map((feed, index) => (
        <div key={index + '-' + (Array.isArray(feed) ? 'artwork' : feed.type)}>
          {renderFeedItem(feed)}
        </div>
      ))}
      {feeds.length === 0 && <p className='m-12'>데이터가 없습니다.</p>}
    </div>
  );
}
