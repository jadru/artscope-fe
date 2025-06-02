'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { useUser } from '@/states';

export default function LoginNeeded({ href }: { href: string }) {
  const { isLogin } = useUser();
  return !isLogin ? (
    <Link href={href}>
      <Button color='primary' className='opacity-50 hover:opacity-100'>
        로그인이 필요합니다.
      </Button>
    </Link>
  ) : (
    <></>
  );
}
