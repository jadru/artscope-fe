import { Button, Card, User } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiFillHeart, AiFillMessage, AiFillStar } from 'react-icons/ai';
import { toast } from 'react-toastify';

import { feedItemType } from '@/types';

export default function FeedListItem({ feed }: { feed: feedItemType }) {
  const { push } = useRouter();
  const [readMore, setReadMore] = useState<boolean>(false);
  return (
    <div
      className={`my-1.5 rounded-2xl bg-white p-4 pb-2 outline outline-1 outline-blue-100 drop-shadow-md transition-colors ${
        feed.type === 'artwork' ? 'cursor-pointer hover:bg-gray-100' : ''
      }`}
      onClick={() => {
        if (feed.type === 'artwork') push(`/artwork/${feed.id}`);
      }}
    >
      <div className='flex w-full flex-col justify-between text-left md:flex-row'>
        <div>
          <div
            className='cursor-pointer'
            onClick={(e) => {
              e.stopPropagation();
              push(`/profile/${feed.authorUsername}`);
            }}
          >
            <User
              name={feed.authorName}
              description={
                '@' +
                feed.authorUsername +
                (feed.authorDescription ? ' - ' + feed.authorDescription : '')
              }
              avatarProps={{
                src: feed.authorProfileImageUrl
                  ? feed.authorProfileImageUrl
                  : undefined,
              }}
              className='p-1 hover:underline'
            />
          </div>
          <div className='flex flex-col justify-start px-1.5 py-3'>
            <div className='text flex w-full flex-col gap-1'>
              {feed.title && (
                <h4 className='w-full text-xl font-semibold text-default-600'>
                  {feed.title}
                </h4>
              )}
              <h5
                className={`${
                  !readMore && feed.content.length > 130
                    ? 'cursor-pointer hover:underline'
                    : ''
                } w-full overflow-x-hidden text-medium tracking-tight text-default-800`}
                onClick={() => {
                  if (!readMore && feed.content.length > 130) setReadMore(true);
                }}
              >
                {!readMore && feed.content.length > 130
                  ? feed.content.slice(0, 130) + '... 더보기'
                  : feed.content}
              </h5>
            </div>
          </div>
        </div>
        {feed.thumbnailUrl && (
          <Card
            isFooterBlurred
            radius='lg'
            className='h-max w-full max-w-none border-none md:max-w-fit'
          >
            <Image
              alt='Woman listing to music'
              className='w-full object-cover'
              height={200}
              src={feed.thumbnailUrl}
              width={200}
            />
          </Card>
        )}
      </div>
      <div className='w-full justify-evenly gap-1 self-start md:w-auto md:justify-items-start'>
        <Button
          startContent={<AiFillHeart className='h-5 w-5' />}
          variant='light'
          className='text-md text-gray-500 hover:text-red-500'
          onClick={(e) => {
            e.stopPropagation();
            toast('좋아요 누름');
          }}
        >
          {feed.likes}
        </Button>
        <Button
          startContent={<AiFillMessage className='h-5 w-5' />}
          variant='light'
          className='text-md text-gray-500 hover:text-blue-500'
          onClick={(e) => {
            e.stopPropagation();
            toast('댓글 누름');
          }}
        >
          {feed.likes}
        </Button>
        <Button
          startContent={<AiFillStar className='h-5 w-5' />}
          variant='light'
          className='text-md text-gray-500 hover:text-green-500'
          onClick={(e) => {
            e.stopPropagation();
            toast('저장 누름');
          }}
        >
          {feed.likes}
        </Button>
      </div>
    </div>
  );
}
