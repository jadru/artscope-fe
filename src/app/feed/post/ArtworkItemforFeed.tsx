import { Card } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';

import { feedItemType } from '@/types';

const ArtworkItemforFeed = ({ feed }: { feed: feedItemType }) => (
  <Card>
    <Link
      href={'/artwork/' + feed.id}
      className='bg-base-100 group relative flex h-full w-full cursor-pointer justify-center overflow-hidden text-center'
    >
      {feed.thumbnailUrl && (
        <Image
          src={feed.thumbnailUrl}
          alt={feed.title}
          width={200}
          height={200}
          placeholder='blur' // 추가
          blurDataURL='data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==' // 추가
          className='h-full w-full object-cover duration-75'
        />
      )}
      <div className='absolute bottom-1 left-0 mx-1 w-[calc(100%-0.5rem)] rounded-xl border bg-white/70 p-2 opacity-100 backdrop-blur transition duration-75 group-hover:opacity-100 md:opacity-0'>
        <p className='text-bold truncate text-center font-serif text-lg text-black'>
          {feed.title}
        </p>
      </div>
    </Link>
  </Card>
);

export default ArtworkItemforFeed;
