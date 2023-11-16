import Link from 'next/link';

import ASNextImage from '@/components/ASNextImage';

import { SinglePostType } from '@/types/feed';

export default function SinglePostProfile({ feed }: { feed: SinglePostType }) {
  return (
    <Link
      className='cursor-pointer p-0'
      href={`/profile/${feed.authorUsername}`}
    >
      <div className='flex flex-row items-start justify-start gap-2 p-3 transition hover:underline'>
        <ASNextImage
          src={feed.authorProfileImageUrl || 'prod/images/default.jpg'}
          alt='프로필 사진'
          width={40}
          height={40}
          className='h-10 w-10 rounded-full border object-cover'
        />
        <div className='ml-0.5 flex flex-col transition hover:underline'>
          <p className='inline text-[0.9rem] font-bold'>{feed.authorName}</p>
          <p
            className={`${
              feed.authorDescription ? 'ml-0.5 inline w-full' : ''
            } line-clamp-1 text-[0.9rem] text-default-500`}
          >
            @{feed.authorUsername}{' '}
            {feed.authorDescription ? '- ' + feed.authorDescription : ''}
          </p>
        </div>
      </div>
    </Link>
  );
}
