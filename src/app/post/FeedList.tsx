import {} from '@toss/react';
import React, { useEffect, useState } from 'react';

import ArtworkItemforFeed from '@/app/post/ArtworkItemforFeed';
import FeedListItem from '@/app/post/FeedListItem';

import { feedItemType } from '@/types';

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
      if (finalArtworkIndex >= index) continue;

      if (data[index].type === 'artwork') {
        finalArtworkIndex = index;
        for (let i = index + 1; i < data.length; i++) {
          if (data[i].type === 'artwork') {
            finalArtworkIndex = i;
          } else {
            break;
          }
        }
        newFeeds.push(data.slice(index, finalArtworkIndex + 1));
      } else {
        newFeeds.push(data[index]);
      }
    }

    setFeeds(newFeeds);
  }, [data, setFeeds]);

  return (
    <div className='flex flex-col border-b'>
      {feeds.map((feed, index) => (
        <>
          {Array.isArray(feed) ? (
            <div
              className={`mx-2 my-1 grid ${
                feed.length === 1
                  ? 'grid-cols-1'
                  : feed.length % 2 === 0
                  ? 'grid-cols-2'
                  : feed.length % 3 === 0
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
              } gap-1 md:mx-0`}
              key={index}
            >
              {feed.map((feedItem, index) => (
                <ArtworkItemforFeed feed={feedItem} key={'artwork-' + index} />
              ))}
            </div>
          ) : (
            <div key={feed.id}>
              <FeedListItem feed={feed} />
            </div>
          )}
          <hr />
        </>
      ))}
    </div>
  );
}
