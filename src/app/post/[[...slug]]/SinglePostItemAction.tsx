import { Button } from '@nextui-org/react';
import { DebounceClick, useDebounce } from '@toss/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  AiFillLike,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineLike,
  AiOutlineMessage,
  AiOutlineShareAlt,
} from 'react-icons/ai';
import { toast } from 'react-toastify';

import { NEXT_PUBLIC_ROOT_URL } from '@/constant/env';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { SinglePostType } from '@/types/feed';

export default function SinglePostItemAction({
  feed,
}: {
  feed: SinglePostType;
}) {
  const [like, setLike] = useState<boolean>(feed.isLiked);
  const [firstLike, setFirstLike] = useState<boolean>(feed.isLiked);
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
    if (feed.likeMembers.find((data) => data.username === user?.username)) {
      setFirstLike(true);
      setLike(true);
    }
  }, [feed.likeMembers, feed.isLiked, user?.username, feed]);

  const handleDelete = () => {
    if (confirm('포스트를 정말 삭제하시겠습니까?'))
      jxios.delete(`/api/posts/${feed.id}`).then(() => {
        toast.success('포스트가 삭제되었습니다.');
        push('/');
      });
  };

  return (
    <>
      <div className='mt-2 flex w-full justify-between gap-1 self-start border-t px-2 pt-2 md:w-auto md:justify-items-start'>
        <div>
          <DebounceClick wait={500}>
            <Button
              startContent={
                like ? (
                  <AiFillLike className='h-5 w-5 text-red-500' />
                ) : (
                  <AiOutlineLike className='h-5 w-5' />
                )
              }
              variant='light'
              className={`text-md hover:text-red-500 ${
                like ? 'text-red-500' : 'text-gray-500'
              }`}
              size='sm'
              onClick={handleLike}
            >
              {feed.likes + (like ? 1 : 0) + (firstLike ? -1 : 0)} 좋아요
            </Button>
          </DebounceClick>
          <DebounceClick wait={500}>
            <Button
              startContent={<AiOutlineMessage className='h-5 w-5' />}
              variant='light'
              size='sm'
              className='text-md text-gray-500 hover:text-blue-500'
            >
              {feed.comments} 댓글
            </Button>
          </DebounceClick>
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
            <>
              <DebounceClick wait={500}>
                <Button
                  startContent={<AiOutlineEdit className='h-5 w-5' />}
                  variant='light'
                  size='sm'
                  className='text-md text-gray-500 hover:text-purple-500'
                  onClick={(e) => {
                    e.stopPropagation();
                    push(`/post/${feed.id}?edit=true`);
                  }}
                >
                  수정
                </Button>
              </DebounceClick>
              <DebounceClick wait={500}>
                <Button
                  startContent={<AiOutlineDelete className='h-5 w-5' />}
                  variant='light'
                  size='sm'
                  className='text-md text-gray-500 hover:text-red-500'
                  onClick={handleDelete}
                >
                  삭제
                </Button>
              </DebounceClick>
            </>
          )}
          <Button
            startContent={<AiOutlineShareAlt className='h-5 w-5' />}
            variant='light'
            size='sm'
            className='text-md text-gray-500 hover:text-amber-600'
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
            공유
          </Button>
        </div>
      </div>
    </>
  );
}
