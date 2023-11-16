'use client';

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

import { ArtworkType } from '@/types/artwork';

export default function ArtworkAction({ aw }: { aw: ArtworkType }) {
  const [like, setLike] = useState<boolean>(aw.isLiked);
  const [firstLike, setFirstLike] = useState<boolean>(aw.isLiked);
  const { user, isLogin } = useUser();
  const { push } = useRouter();

  const handleLike = useDebounce(
    () =>
      isLogin
        ? jxios
            .post(`/api/artworks/${aw.artwork.id}/like`)
            .then((res) => setLike(res.status !== 204))
        : push('/user/login'),
    500
  );

  useEffect(() => {
    const fetchLike = async () =>
      await jxios
        .get('/api/artworks/' + aw.artwork.id + '/member/likes')
        .then((res) => {
          if (res.data) {
            setLike(true);
            setFirstLike(true);
          }
        });
    if (isLogin) fetchLike();
  }, [aw.isLiked, aw.artwork.id, isLogin]);

  return (
    <div className='flex w-full justify-between gap-1 self-start py-2 md:w-auto md:justify-items-start'>
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
          onClick={() => {
            setLike(!like);
            handleLike();
          }}
        >
          {aw.artwork.likes + (like ? 1 : 0) + (firstLike ? -1 : 0)}
        </Button>
        <Button
          startContent={<AiOutlineMessage className='h-5 w-5' />}
          variant='light'
          size='sm'
          onClick={() => push(`/artwork/${aw.artwork.id}`)}
          className='text-md text-gray-500 hover:text-blue-500'
        >
          {aw.artwork.comments}
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
        {aw.artwork.authorUsername === user?.username && (
          <>
            <Button
              onClick={() => push(`/artwork/${aw.artwork.id}?edit=true`)}
              startContent={<AiOutlineEdit className='h-5 w-5' />}
              variant='light'
              size='sm'
              className='text-md text-gray-500 hover:text-purple-500'
            >
              수정
            </Button>
            <Button
              onClick={() =>
                confirm(aw.artwork.title + ' 작품을 삭제하시겠습니까?') &&
                jxios.delete(`/api/artworks/${aw.artwork.id}`).then(() => {
                  toast.success('작품이 삭제되었습니다.');
                  push('/artworks');
                })
              }
              startContent={<AiOutlineDelete className='h-5 w-5' />}
              variant='light'
              size='sm'
              className='text-md text-gray-500 hover:text-red-500'
            >
              삭제
            </Button>
          </>
        )}
        <DebounceClick wait={500}>
          <Button
            startContent={<AiOutlineShareAlt className='h-5 w-5' />}
            variant='light'
            size='sm'
            className='text-md text-gray-500 hover:text-amber-600'
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.share) {
                navigator.share({
                  url: NEXT_PUBLIC_ROOT_URL + '/artwork/' + aw.artwork.id,
                  title: 'Artscope -' + aw.artwork.description.slice(0, 25),
                });
              } else {
                if (navigator.clipboard)
                  navigator.clipboard
                    .writeText(
                      NEXT_PUBLIC_ROOT_URL + '/artwork/' + aw.artwork.id
                    )
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
        </DebounceClick>
      </div>
    </div>
  );
}
