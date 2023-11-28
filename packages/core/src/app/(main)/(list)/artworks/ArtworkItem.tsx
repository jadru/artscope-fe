import Link from 'next/link';
import React from 'react';

import ASNextImage from '@/components/ASNextImage';
import StandardLabel from '@/components/StandardLabel';

import { ArtworkType } from '@/types/artwork';

const ArtworkItem = ({ artwork: aw }: { artwork: ArtworkType }) => {
  return (
    <Link
      href={'/artwork/' + aw.artwork.id}
      className='group cursor-pointer rounded-xl transition'
    >
      <div>
        <div className='overflow-visible rounded-t-2xl bg-black p-0'>
          <ASNextImage
            src={aw.artwork.thumbnail.mediaUrl}
            alt={aw.artwork.title}
            className='h-[230px] w-full rounded-t-xl object-cover transition group-hover:opacity-60 group-hover:drop-shadow-sm'
            placeholder='blur'
            blurDataURL='data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
            width='230'
            height='230'
          />
        </div>
        <div className='text-small group-hover:bg-default-200 flex items-center justify-between space-x-0.5 rounded-b-xl px-3 py-2 transition'>
          <div className='w-2/3 truncate'>
            <b className='w-full truncate'>
              <StandardLabel label={aw.artwork.title} />
            </b>
            <p className='text-default-500 space-x-2 text-sm'>
              <span>좋아요 {aw.artwork.likes}</span>
              <span>댓글 {aw.artwork.comments}</span>
            </p>
          </div>
          <p className='text-default-500 flex w-1/3 flex-col justify-between truncate pl-1 text-right font-bold'>
            <StandardLabel label={aw.artwork.authorName} />
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ArtworkItem;
