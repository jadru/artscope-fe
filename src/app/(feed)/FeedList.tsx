import {} from '@toss/react';
import React, { useEffect, useState } from 'react';

import ArtworkItemforFeed from '@/app/(feed)/ArtworkItemforFeed';
import FeedListItem from '@/app/(feed)/FeedListItem';

import { feedItemType } from '@/types/feed';

type feedType = (feedItemType[] | feedItemType)[];

interface FeedListProps {
  data: feedItemType[];
}

export default function FeedList({ data }: FeedListProps) {
  const [feeds, setFeeds] = useState<feedType>([]);

  useEffect(() => {
    const newFeeds: feedType = [];
    let finalArtworkIndex = 0;

    for (let index = 0; index < data.length; index++) {
      if (finalArtworkIndex > index) continue;

      if (data[index].type === 'artwork') {
        finalArtworkIndex = index;
        for (let i = index + 1; i < data.length; i++) {
          if (data[i].type === 'artwork') {
            finalArtworkIndex = i + 1;
          } else {
            break;
          }
        }
        newFeeds.push(data.slice(index, finalArtworkIndex));
      } else {
        newFeeds.push(data[index]);
        finalArtworkIndex = index;
      }
    }

    if (finalArtworkIndex < data.length - 1) {
      newFeeds.push(data.slice(finalArtworkIndex + 1));
    }
    setFeeds(newFeeds);
  }, [data, setFeeds]);

  return (
    <div className='flex flex-col'>
      {feeds.map((feed) => (
        <div key={Array.isArray(feed) ? feed[0].id : feed.id}>
          {Array.isArray(feed) ? (
            <div
              className={`grid ${
                feed.length === 1
                  ? 'grid-cols-1'
                  : feed.length % 2 === 0
                  ? 'grid-cols-2'
                  : feed.length % 3 === 0
                  ? 'grid-cols-1 md:grid-cols-3'
                  : 'grid-cols-2'
              } gap-0 border-x md:mx-0`}
            >
              {feed.map((feedItem) => (
                <ArtworkItemforFeed
                  feed={feedItem}
                  key={'artwork-' + feedItem.id}
                />
              ))}
            </div>
          ) : (
            <FeedListItem feed={feed} />
          )}
          <hr />
        </div>
      ))}
    </div>
  );
}
