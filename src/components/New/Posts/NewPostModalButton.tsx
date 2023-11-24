'use client';

import Link from 'next/link';
import React from 'react';
import {
  BiSolidCalendar,
  BiSolidNetworkChart,
  BiSolidZap,
} from 'react-icons/bi';

import UserInfo from '@/components/UserInfo';

import { useUser } from '@/states';

type Props = {
  placeholder: string;
};

export default function NewPostButton({ placeholder }: Props) {
  const { isLogin } = useUser();

  return isLogin ? (
    <div className='flex w-full max-w-full flex-row items-start justify-between gap-3 overflow-hidden rounded-xl p-3'>
      <UserInfo />
      <div className='w-[calc(100%-3rem)] space-y-1'>
        <Link
          href='/new/post'
          className='flex h-12 w-full items-center truncate rounded-xl border-2 border-transparent bg-default-100 px-3 text-left text-sm font-bold text-default-500 transition hover:border-default-600'
        >
          {placeholder}
        </Link>
        <div className='flex gap-0.5'>
          <Link
            href='/new/artwork'
            className='flex items-center gap-0.5 rounded-xl border-2 border-transparent bg-default-100 p-1.5 text-[0.8rem] transition hover:border-blue-600 hover:text-blue-600'
          >
            <BiSolidZap />
            작품 추가
          </Link>
          <Link
            href='/new/event'
            className='flex items-center gap-0.5 rounded-xl border-2 border-transparent bg-default-100 p-1.5 text-[0.8rem] transition hover:border-yellow-600 hover:text-yellow-600'
          >
            <BiSolidCalendar />
            이벤트 작성
          </Link>{' '}
          <Link
            href='/new/agora'
            className='flex items-center gap-0.5 rounded-xl border-2 border-transparent bg-default-100 p-1.5 text-[0.8rem] transition hover:border-green-600 hover:text-green-600'
          >
            <BiSolidNetworkChart />
            아고라 시작
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
