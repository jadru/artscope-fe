import Link from 'next/link';

import ASNextImage from '@/components/ASNextImage';

import { feedItemType } from '@/types/feed';

const FeedListItemArtwork = ({ feed }: { feed: feedItemType }) => {
  return (
    <Link
      href={`/artwork/${feed.id}`}
      className='group cursor-pointer transition'
    >
      <div>
        <div className='overflow-visible rounded-none p-0 transition duration-100 group-hover:bg-default-100'>
          <ASNextImage
            src={feed.thumbnailUrl || 'https://via.placeholder.com/300'}
            alt={feed.title ?? 'Artworks'}
            className='h-[200px] w-full  object-cover drop-shadow-sm'
            placeholder='blur'
            blurDataURL='data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
            width='150'
            height='150'
          />
        </div>
        <div className='space-x-0.5 rounded-none px-2 py-3 text-small transition group-hover:bg-default-200'>
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
