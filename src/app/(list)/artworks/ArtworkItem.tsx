import Link from 'next/link';

import ASNextImage from '@/components/ASNextImage';

import { ArtworkType } from '@/types/artwork';

const ArtworkItem = ({ artwork: aw }: { artwork: ArtworkType }) => {
  return (
    <Link
      href={'/artwork/' + aw.artwork.id}
      className='group cursor-pointer transition'
    >
      <div className='transition group-hover:opacity-70'>
        <div className='overflow-visible p-0'>
          <ASNextImage
            src={aw.artwork.thumbnail.mediaUrl}
            alt={aw.artwork.title}
            className='h-[190px] w-full object-cover '
            placeholder='blur'
            blurDataURL='data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
            width='300'
            height='300'
          />
        </div>
        <div className='flex items-center justify-between space-x-0.5 px-3 py-2 text-small group-hover:bg-default-100'>
          <div className='w-2/3 truncate'>
            <b className='w-full truncate'>{aw.artwork.title}</b>
            <p className='space-x-2 text-sm text-default-500'>
              <span>좋아요 {aw.artwork.likes}</span>
              <span>댓글 {aw.artwork.comments}</span>
            </p>
          </div>
          <p className='w-1/3 truncate pl-1 text-right font-bold text-default-500'>
            {aw.artwork.authorName}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ArtworkItem;
