'use client';

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

import { NEXT_PUBLIC_ROOT_URL } from '@/constant/env';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { ArtworkType } from '@/types/artwork';

export default function ArtworkAction({ aw }: { aw: ArtworkType }) {
  const [like, setLike] = useState<boolean>(aw.isLike);
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
    setLike(aw.isLike);
  }, [aw.isLike]);

  return (
    <div className='flex w-full justify-between gap-1 self-start md:w-auto md:justify-items-start'>
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
          {aw.artwork.likes + (like ? 1 : 0) + (aw.isLike ? -1 : 0)}
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
          <Button
            onClick={() => push(`/artwork/${aw.artwork.id}?edit=true`)}
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
              text: aw.artwork.authorName + ' 작품',
              url: NEXT_PUBLIC_ROOT_URL + '/artwork/' + aw.artwork.id,
              title: aw.artwork.title + ' - Artscope',
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
