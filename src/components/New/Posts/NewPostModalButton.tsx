'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import UserInfo from '@/components/UserInfo';

type Props = {
  placeholder: string;
};

export default function NewPostModalButton({ placeholder }: Props) {
  const { push } = useRouter();

  return (
    <div
      className='flex w-full max-w-full animate-fade cursor-pointer flex-row justify-between gap-3 space-y-1 overflow-hidden border-default-200 p-3 transition hover:bg-default-100'
      onClick={() => {
        push('/new/post');
      }}
    >
      <UserInfo />
      <span className='flex h-12 w-[calc(100%-3rem)] items-center truncate rounded-3xl border border-white bg-default-100 px-3 text-left text-sm font-bold text-default-500'>
        {placeholder}
      </span>
    </div>
  );
}
