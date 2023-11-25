import Link from 'next/link';
import React from 'react';

import ASNextImage from '@/components/ASNextImage';
import StandardLabel from '@/components/StandardLabel';

import { editAndPostShortCalculatorKO } from '@/utils/timeCalculator';

import { feedItemType } from '@/types/feed';

const FeedListItemArtwork = ({ feed }: { feed: feedItemType }) => {
  return (
    <Link href={`/artwork/${feed.id}`} className='group'>
      <div className='rounded-xl transition group-hover:bg-default-200'>
        <ASNextImage
          src={feed.thumbnailUrl ?? '/images/default-thumbnail.png'}
          alt={feed.title ?? 'Artworks'}
          className='h-[200px] w-full rounded-xl border object-cover'
          width='220'
          height='220'
        />
        <div className='flex items-center justify-between space-x-0.5 rounded-b-xl px-3 py-2 text-small transition group-hover:bg-default-200'>
          <div className='w-2/3 truncate'>
            <b className='w-full truncate'>
              <StandardLabel label={feed.title} />
            </b>
            <p className='space-x-2 text-sm text-default-500'>
              <span>좋아요 {feed.likes}</span>
              <span>댓글 {feed.comments}</span>
            </p>
          </div>
          <p className='flex w-1/3 flex-col justify-between truncate pl-1 text-right font-bold text-default-500'>
            <StandardLabel label={feed.authorName} />
            <span className='text-right text-[0.86rem] font-normal text-default-500'>
              {editAndPostShortCalculatorKO(feed.createdTime, feed.updatedTime)}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default FeedListItemArtwork;
