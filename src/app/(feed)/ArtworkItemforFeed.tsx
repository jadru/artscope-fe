import { CardBody, CardFooter } from '@nextui-org/card';
import { Card } from '@nextui-org/react';
import Link from 'next/link';

import ASNextImage from '@/components/ASNextImage';

import { feedItemType } from '@/types';

const ArtworkItemforFeed = ({ feed }: { feed: feedItemType }) => (
  <Link href={'/artwork/' + feed.id} className='group'>
    <Card shadow='sm' className='m-0 rounded-none'>
      <CardBody className='overflow-visible rounded-none p-0 transition duration-100 group-hover:bg-default-100'>
        <ASNextImage
          src={feed.thumbnailUrl || 'https://via.placeholder.com/300'}
          alt={feed.title ?? 'Artwork'}
          className='h-[180px] w-full bg-white object-cover drop-shadow-sm group-hover:bg-default-100'
          placeholder='blur'
          blurDataURL='data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
          width='300'
          height='300'
        />
      </CardBody>
      <CardFooter className='justify-between space-x-0.5 rounded-none text-small transition duration-100 group-hover:bg-default-100'>
        <b className='w-2/3 truncate'>{feed.title}</b>
        <p className='w-1/3 truncate text-right text-default-500'>
          {feed.authorName}
        </p>
      </CardFooter>
    </Card>
  </Link>
);

export default ArtworkItemforFeed;
