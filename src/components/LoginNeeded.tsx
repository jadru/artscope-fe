'use client';

import { Button } from '@nextui-org/react';
import Link from 'next/link';

import { useUser } from '@/states';

export default function LoginNeeded({ href }: { href: string }) {
  const { isLogin } = useUser();
  return !isLogin ? (
    <Link href={href}>
      <Button
        variant='bordered'
        color='primary'
        className='opacity-50 hover:opacity-100'
        fullWidth
      >
        로그인이 필요합니다.
      </Button>
    </Link>
  ) : (
    <></>
  );
}
