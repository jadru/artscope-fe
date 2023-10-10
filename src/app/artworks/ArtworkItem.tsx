import { CardBody, CardFooter } from '@nextui-org/card';
import { Card } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';

import { ArtworkType } from '@/types';

const ArtworkItem = ({ artwork: aw }: { artwork: ArtworkType }) => (
  <Link href={'/artwork/' + aw.artwork.id} className='group'>
    <Card shadow='sm'>
      <CardBody className='overflow-visible p-0 transition duration-100 group-hover:bg-default-100'>
        <Image
          src={aw.artwork.thumbnail.mediaUrl}
          alt={aw.artwork.title}
          className='h-[180px] w-full rounded-xl bg-white object-cover drop-shadow-sm group-hover:bg-default-100'
          placeholder='blur'
          blurDataURL='data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
          width='300'
          height='300'
        />
      </CardBody>
      <CardFooter className='justify-between space-x-0.5 text-small transition duration-100 group-hover:bg-default-100'>
        <b className='truncate'>{aw.artwork.title}</b>
        <p className='text-default-500'>{aw.artwork.authorName}</p>
      </CardFooter>
    </Card>
  </Link>
);

export default ArtworkItem;
