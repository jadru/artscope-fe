'use client';

import Link from 'next/link';
import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

import NavBar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

// eslint-disable-next-line no-empty-pattern
export default function Error({}: { error: Error; reset: () => void }) {
  return (
    <>
      <NavBar />
      <div className='flex min-h-screen flex-col items-center justify-center text-center text-black dark:text-gray-200'>
        <RiAlarmWarningFill
          size={60}
          className='drop-shadow-glow animate-flicker text-red-500'
        />
        <h1 className='mt-8 text-4xl md:text-6xl'>페이지를 찾을 수 없습니다</h1>
        <Link className='mb-8 mt-4' href='/'>
          <Button color='primary'>홈으로 돌아가기</Button>
        </Link>
      </div>
    </>
  );
}
