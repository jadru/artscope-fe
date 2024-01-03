'use client';

import React from 'react';
import { BiShare } from 'react-icons/bi';
import { toast } from 'react-toastify';

import { NEXT_PUBLIC_ROOT_URL } from '@/constant/env';

export default function ShareButton({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  return (
    <button
      className='flex items-center gap-1 hover:font-bold hover:underline'
      onClick={(e) => {
        e.stopPropagation();
        if (navigator.share) {
          navigator.share({
            url: NEXT_PUBLIC_ROOT_URL + '/event/' + id,
            title: 'Artscope -' + title,
          });
        } else {
          if (navigator.clipboard)
            navigator.clipboard
              .writeText(NEXT_PUBLIC_ROOT_URL + '/event/' + id)
              .then(() => {
                toast.success('링크가 복사되었습니다.', {
                  position: 'bottom-center',
                });
              });
        }
      }}>
      <BiShare size={20} />
      공유하기
    </button>
  );
}
