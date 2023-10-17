'use client';

import { Link } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';

import Title from '@/components/Title';

const RedirectOAuth2 = () => {
  const searchParams = useSearchParams();
  return (
    <>
      <Title>
        Failed to login with Google
        <br />
        {searchParams.get('error') ?? '구글 로그인이 실패되었습니다.'}
      </Title>
      <Link href='/' color='primary' className='w-full text-center'>
        메인으로 가기
      </Link>
    </>
  );
};

export default RedirectOAuth2;
