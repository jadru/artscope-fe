'use client';

import { Button } from '@nextui-org/react';

import Seo from '@/components/Seo';
import Title from '@/components/Title';

const RedirectOAuth2 = () => {
  return (
    <>
      <Seo templateTitle='구글 로그인 실패'></Seo>
      <Title>
        Failed to login with Google
        <br />
        구글 로그인이 실패되었습니다.
      </Title>
      <Button href='/' className='btn btn-primary'>
        메인으로 가기
      </Button>
    </>
  );
};

export default RedirectOAuth2;
