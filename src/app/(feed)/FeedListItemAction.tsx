import { Button } from '@nextui-org/react';
import { DebounceClick, useDebounce } from '@toss/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  AiFillLike,
  AiOutlineEdit,
  AiOutlineLike,
  AiOutlineMessage,
  AiOutlineShareAlt,
} from 'react-icons/ai';
import { RWebShare } from 'react-web-share';

import { getRefreshToken } from '@/auth/cookieTokenManager';
import { NEXT_PUBLIC_ROOT_URL } from '@/constant/env';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { feedItemType } from '@/types/feed';

export default function FeedListItemAction({ feed }: { feed: feedItemType }) {
  const [like, setLike] = useState<boolean>(feed.isLiked);
  const { user, isLogin } = useUser();
  const { push } = useRouter();

  const handleLike = useDebounce(
    () =>
      isLogin
        ? jxios
            .post(`/api/posts/${feed.id}/like`)
            .then((res) => setLike(res.status !== 204))
        : push('/user/login'),
    500
  );

  useEffect(() => {
    setLike(feed.isLiked);
  }, [feed.isLiked]);

  return (
    <div className='flex w-full justify-between gap-1 self-start px-1 md:w-auto md:justify-items-start'>
      <div>
        <Button
          startContent={
            like ? (
              <AiFillLike className='h-5 w-5 text-red-500' />
            ) : (
              <AiOutlineLike className='h-5 w-5' />
            )
          }
          variant='light'
          size='sm'
          className={`text-md hover:text-red-500 ${
            like ? 'text-red-500' : 'text-gray-500'
          }`}
          onClick={async () => {
            if (await getRefreshToken()) {
              setLike(!like);
              handleLike();
            } else {
              push('/user/login');
            }
          }}
        >
          {feed.likes + (like ? 1 : 0) + (feed.isLiked ? -1 : 0)}
        </Button>
        <Button
          startContent={<AiOutlineMessage className='h-5 w-5' />}
          variant='light'
          size='sm'
          className='text-md text-gray-500 hover:text-blue-500'
          onClick={() => {
            push(`/post/${feed.id}`);
          }}
        >
          {feed.comments}
        </Button>
      </div>
      {/* <DebounceClick wait={500}> */}
      {/*   <Button */}
      {/*     startContent={<AiOutlineStar className='h-5 w-5' />} */}
      {/*     variant='light' */}
      {/*     className='text-md text-gray-500 hover:text-green-500' */}
      {/*     onClick={handleSave} */}
      {/*   > */}
      {/*     {0} */}
      {/*   </Button> */}
      {/* </DebounceClick> */}
      <div>
        {feed.authorUsername === user?.username && (
          <Button
            onClick={() => {
              push(`/post/${feed.id}?edit=true`);
            }}
            startContent={<AiOutlineEdit className='h-5 w-5' />}
            variant='light'
            size='sm'
            className='text-md text-gray-500 hover:text-purple-500'
          >
            수정 / 삭제
          </Button>
        )}
        <DebounceClick wait={500}>
          <RWebShare
            data={{
              text: 'Artscope 포스트',
              url: NEXT_PUBLIC_ROOT_URL + '/post/' + feed.id,
              title: feed.content.slice(0, 18) + ' - Artscope',
            }}
          >
            <Button
              startContent={<AiOutlineShareAlt className='h-5 w-5' />}
              variant='light'
              size='sm'
              className='text-md text-gray-500 hover:text-amber-600'
            >
              공유
            </Button>
          </RWebShare>
        </DebounceClick>
      </div>
    </div>
  );
}
