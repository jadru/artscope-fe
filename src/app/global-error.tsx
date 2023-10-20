'use client';

import { Button } from '@nextui-org/react';
import Link from 'next/link';
import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black dark:text-gray-200'>
      <RiAlarmWarningFill
        size={60}
        className='drop-shadow-glow animate-flicker text-red-500'
      />
      <h1 className='md:text-6xl mt-8 text-4xl'>문제가 발생했습니다</h1>
      <h3 className='mt-8 text-3xl md:text-4xl'>{error.message}</h3>
      <Link className='mb-8 mt-4' href='/'>
        <Button color='primary'>홈으로 돌아가기</Button>
        <Button color='secondary' onClick={() => reset()}>
          새로고침
        </Button>
      </Link>
    </div>
  );
}
