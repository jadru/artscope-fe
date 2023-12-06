'use client';

import { Link } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';

import Title from '@/components/Title';

const RedirectOAuth2 = () => {
  const searchParams = useSearchParams();
  return (
    <>
      <Title
        title='로그인 실패'
        description={
          searchParams.get('error') ??
          '알 수 없는 오류로 외부 서비스와 로그인이 실패되었습니다.'
        }
      />
      <Link href='/' color='primary' className='w-full text-center'>
        메인으로 가기
      </Link>
    </>
  );
};

export default RedirectOAuth2;
