import { useDebounce } from '@toss/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  AiFillLike,
  AiOutlineEdit,
  AiOutlineLike,
  AiOutlineMessage,
  AiOutlineShareAlt,
} from 'react-icons/ai';
import { toast } from 'react-toastify';

import { NEXT_PUBLIC_ROOT_URL } from '@/constant/env';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { feedItemType } from '@/types/feed';

export default function FeedListItemPostAction({
  feed,
}: {
  feed: feedItemType;
}) {
  const [like, setLike] = useState<boolean>(feed.isLiked);
  const { user, isLogin } = useUser();
  const { push } = useRouter();

  const handleLike = useDebounce(
    () =>
      jxios
        .post(`/api/posts/${feed.id}/like`)
        .then((res) => setLike(res.status !== 204)),
    500
  );

  useEffect(() => {
    setLike(feed.isLiked);
  }, [feed.isLiked]);

  return (
    <div className='mt-1 flex w-full justify-start gap-1 self-start md:w-auto md:justify-items-start'>
      <button
        className={`text-md flex p-2 transition hover:text-red-500 ${
          like ? 'text-red-500' : 'text-gray-500'
        }`}
        onClick={async (e) => {
          e.stopPropagation();
          if (isLogin) {
            setLike(!like);
            handleLike();
          } else {
            push('/user/login');
          }
        }}
      >
        {like ? (
          <AiFillLike className='mr-2 h-5 w-5 text-red-500' />
        ) : (
          <AiOutlineLike className='mr-2 h-5 w-5' />
        )}
        {feed.likes + (like ? 1 : 0) + (feed.isLiked ? -1 : 0)}
      </button>
      <button
        className='flex p-2 text-gray-500 transition hover:text-blue-500'
        onClick={(e) => {
          e.stopPropagation();
          push(`/post/${feed.id}`);
        }}
      >
        <AiOutlineMessage className='mr-2 h-5 w-5' />
        {feed.comments}
      </button>
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
      {user && feed.authorUsername === user?.username && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            push(`/edit/post/${feed.id}`);
          }}
          className='text-md flex p-2 text-gray-500 hover:text-purple-500'
        >
          <AiOutlineEdit className='h-5 w-5' />
        </button>
      )}
      <button
        className='flex p-2 text-gray-500 transition hover:text-amber-600'
        onClick={(e) => {
          e.stopPropagation();
          if (navigator.share) {
            navigator.share({
              url: NEXT_PUBLIC_ROOT_URL + '/post/' + feed.id,
              title: 'Artscope -' + feed.content.slice(0, 25),
            });
          } else {
            if (navigator.clipboard)
              navigator.clipboard
                .writeText(NEXT_PUBLIC_ROOT_URL + '/post/' + feed.id)
                .then(() => {
                  toast.success('링크가 복사되었습니다.', {
                    position: 'bottom-center',
                  });
                });
          }
        }}
      >
        <AiOutlineShareAlt className='h-5 w-5' />
      </button>
    </div>
  );
}
