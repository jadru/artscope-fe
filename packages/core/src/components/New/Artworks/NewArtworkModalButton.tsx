'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import UserInfo from '@/components/UserInfo';

type Props = {
  placeholder: string;
};

export default function NewArtworkModalButton({ placeholder }: Props) {
  const { push } = useRouter();
  return (
    <div
      className='animate-fade hover:bg-default-100 flex cursor-pointer flex-row justify-between gap-3 space-y-1 border-x border-b border-white p-3 transition'
      onClick={() => {
        push('/new/artwork');
      }}
    >
      <UserInfo />
      <span className='bg-default-100 text-default-500 flex h-12 w-[calc(100%-3rem)] items-center truncate rounded-3xl border border-white px-3 text-left text-sm font-bold'>
        {placeholder}
      </span>
    </div>
  );
}
