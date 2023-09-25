import { Card } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';

import { ArtworkType } from '@/types';

const ArtworkItem = ({ artwork: aw }: { artwork: ArtworkType }) => (
  <Card>
    <Link
      href={'/artwork/' + aw.artwork.id}
      className='bg-base-100 group relative flex h-full w-full cursor-pointer justify-center overflow-hidden text-center'
    >
      <Image
        src={aw.artwork.thumbnail.mediaUrl}
        alt={aw.artwork.title}
        width={200}
        height={200}
        placeholder='blur' // 추가
        blurDataURL='data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==' // 추가
        className='h-full w-full object-cover duration-75'
      />

      <div className='absolute bottom-1 left-0 mx-1 w-[calc(100%-0.5rem)] rounded-xl border bg-white/70 p-2 opacity-100 backdrop-blur transition duration-75 group-hover:opacity-100 md:opacity-0'>
        <p className='text-bold truncate text-center font-serif text-lg text-black'>
          {aw.artwork.title}
        </p>
      </div>
    </Link>
  </Card>
);

export default ArtworkItem;
