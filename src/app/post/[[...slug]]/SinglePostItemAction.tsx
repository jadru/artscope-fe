import { Button } from '@nextui-org/react';
import { DebounceClick, useDebounce } from '@toss/react';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  AiFillLike,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineLike,
  AiOutlineMessage,
  AiOutlineShareAlt,
} from 'react-icons/ai';
import { toast } from 'react-toastify';
import { RWebShare } from 'react-web-share';

import { NEXT_PUBLIC_ROOT_URL } from '@/constant/env';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { SinglePostType } from '@/types';

export default function SinglePostItemAction({
  feed,
  setEditMode,
}: {
  feed: SinglePostType;
  setEditMode: Dispatch<SetStateAction<boolean>>;
}) {
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

  const handleDelete = () => {
    if (confirm('포스트를 정말 삭제하시겠습니까?'))
      jxios.delete(`/api/posts/${feed.id}`).then(() => {
        toast.success('포스트가 삭제되었습니다.');
        push('/');
      });
  };

  return (
    <>
      <div className='flex w-full justify-between gap-1 self-start md:w-auto md:justify-items-start'>
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
              onClick={handleLike}
            >
              {feed.likes + (like ? 1 : 0) + (feed.isLiked ? -1 : 0)} 좋아요
            </Button>
          </DebounceClick>
          <DebounceClick wait={500}>
            <Button
              startContent={<AiOutlineMessage className='h-5 w-5' />}
              variant='light'
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
                  className='text-md text-gray-500 hover:text-purple-500'
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditMode(true);
                  }}
                >
                  수정
                </Button>
              </DebounceClick>
              <DebounceClick wait={500}>
                <Button
                  startContent={<AiOutlineDelete className='h-5 w-5' />}
                  variant='light'
                  className='text-md text-gray-500 hover:text-red-500'
                  onClick={handleDelete}
                >
                  삭제
                </Button>
              </DebounceClick>
            </>
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
                className='text-md text-gray-500 hover:text-amber-600'
              >
                공유
              </Button>
            </RWebShare>
          </DebounceClick>
        </div>
      </div>
    </>
  );
}
