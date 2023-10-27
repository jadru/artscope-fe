import { Card, CardBody, CardFooter } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

import ASNextImage from '@/components/ASNextImage';

import { ArtworkType } from '@/types/artwork';

const ArtworkItem = ({ artwork: aw }: { artwork: ArtworkType }) => {
  const { push } = useRouter();
  return (
    <div
      onClick={() => push('/artwork/' + aw.artwork.id)}
      className='group cursor-pointer'
    >
      <Card shadow='sm'>
        <CardBody className='overflow-visible p-0 transition duration-100 group-hover:bg-default-100'>
          <ASNextImage
            src={aw.artwork.thumbnail.mediaUrl}
            alt={aw.artwork.title}
            className='h-[180px] w-full rounded-xl bg-white object-cover drop-shadow-sm group-hover:bg-default-100'
            placeholder='blur'
            blurDataURL='data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='
            width='300'
            height='300'
          />
        </CardBody>
        <CardFooter className='flex-row justify-between space-x-0.5 text-small transition duration-100 group-hover:bg-default-100'>
          <div className='w-2/3 truncate'>
            <b className='w-full truncate'>{aw.artwork.title}</b>
            <p className='space-x-2 text-sm text-default-500'>
              <span>좋아요 {aw.artwork.likes}</span>
              <span>댓글 {aw.artwork.comments}</span>
            </p>
          </div>
          <p className='w-1/3 truncate text-right font-bold text-default-500'>
            {aw.artwork.authorName}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ArtworkItem;
