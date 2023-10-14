'use client';

import { Button } from '@nextui-org/react';
import Link from 'next/link';
import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

import Seo from '@/components/Seo';

export default function NotFoundPage() {
  return (
    <>
      <Seo templateTitle='Not:Found' />
      <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black dark:text-gray-200'>
        <RiAlarmWarningFill
          size={60}
          className='drop-shadow-glow animate-flicker text-red-500'
        />
        <h1 className='md:text-6xl mt-8 text-4xl'>페이지를 찾을 수 없습니다</h1>
        <Link className='mb-8 mt-4' href='/'>
          <Button color='primary'>홈으로 돌아가기</Button>
        </Link>
      </div>
    </>
  );
}
