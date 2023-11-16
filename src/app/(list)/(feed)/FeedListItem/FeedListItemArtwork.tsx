import Link from 'next/link';

import ASNextImage from '@/components/ASNextImage';

import { feedItemType } from '@/types/feed';

const FeedListItemArtwork = ({ feed }: { feed: feedItemType }) => {
  return (
    <Link href={`/artwork/${feed.id}`} className='group'>
      <div>
        <div className='overflow-visible rounded-xl p-0 transition duration-100 group-hover:bg-default-100'>
          <ASNextImage
            src={feed.thumbnailUrl || 'https://via.placeholder.com/300'}
            alt={feed.title ?? 'Artworks'}
            className='h-[200px] w-full rounded-t-xl border object-cover drop-shadow-sm'
            width='220'
            height='220'
          />
        </div>
        <div className='space-x-0.5 rounded-b-xl px-2 py-3 text-small transition group-hover:bg-default-200'>
          <h3 className='truncate text-[0.86rem]'>{feed.title}</h3>
          <h4 className='truncate text-[0.86rem] text-default-500'>
            {feed.authorName}
          </h4>
        </div>
      </div>
    </Link>
  );
};

export default FeedListItemArtwork;
