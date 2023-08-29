import { Button, Card, User } from '@nextui-org/react';
import Image from 'next/image';
import {
  AiFillEye,
  AiFillHeart,
  AiFillMessage,
  AiFillStar,
} from 'react-icons/ai';
import { toast } from 'react-toastify';

import { FeedItemType } from '@/app/new/FeedList';

export default function FeedListItem({ feed }: { feed: FeedItemType }) {
  return (
    <div
      className='flex cursor-pointer flex-row justify-between border-t p-4 pb-2 transition-colors hover:bg-default-100'
      onClick={() => {
        toast('피드 모달');
      }}
    >
      <div className='flex-col text-left'>
        <div
          className='cursor-pointer'
          onClick={(e) => {
            e.stopPropagation();
            toast('프로필 선택');
          }}
        >
          <User
            name={feed.authorName}
            description={
              '@' +
              feed.authorId +
              (feed.authorDescription ? ' - ' + feed.authorDescription : '')
            }
            avatarProps={{
              src: feed.authorProfileImage,
            }}
            className='p-1 hover:underline'
          />
        </div>
        <div className='flex flex-col justify-start px-1.5 py-3'>
          <div className='flex flex-col gap-1'>
            <h4 className='text-xl font-semibold leading-none text-default-600'>
              {feed.title}
            </h4>
            <h5 className='text-medium tracking-tight text-default-400'>
              {feed.content}
            </h5>
          </div>
        </div>
        <div className='gap-1'>
          <Button
            startContent={<AiFillHeart className='h-5 w-5' />}
            variant='light'
            className='text-md text-gray-500 hover:text-red-500'
            onClick={(e) => {
              e.stopPropagation();
              toast('좋아요 누름');
            }}
          >
            {feed.likeCount}
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
            {feed.commentCount}
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
            {feed.saveCount}
          </Button>
          <Button
            startContent={<AiFillEye className='h-5 w-5' />}
            variant='light'
            className='text-md text-gray-500 hover:text-orange-500'
            onClick={(e) => {
              e.stopPropagation();
              toast('조회 누름');
            }}
          >
            {feed.viewCount}
          </Button>
        </div>
      </div>
      {feed.thumbnail && (
        <Card
          isFooterBlurred
          radius='lg'
          className='h-max min-w-max border-none'
        >
          <Image
            alt='Woman listing to music'
            className='object-cover'
            height={200}
            src={feed.thumbnail}
            width={200}
          />
        </Card>
      )}
    </div>
  );
}
