'use client';

import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { AiOutlineGoogle } from 'react-icons/ai';

import Title from '@/components/Title';

import LoginForm from '@/app/user/(fancy)/login/LoginForm';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import { useUser } from '@/states';

const Login = () => {
  const router = useRouter();
  const { isLogin } = useUser();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    if (isLogin) {
      router.push('/');
    }
  }, [router, isLogin]);
  return (
    <>
      <Title
        title='로그인'
        description='한번의 로그인으로 포트폴리오를 만들고 다른 아티스트들과 소통하세요.'
      />
      <p></p>
      <Button
        color='warning'
        variant='solid'
        fullWidth
        size='lg'
        startContent={<AiOutlineGoogle className='h-6 w-6 text-lg' />}
        onClick={() =>
          router.push(NEXT_PUBLIC_API_URL + '/oauth2/authorization/google')
        }>
        구글로 로그인 또는 회원가입
      </Button>
      <p className='text-center'>또는</p>
      <LoginForm redirect={redirect} />
      <div className='flex w-full justify-between'>
        <Link href='/user/signup' className='hover:underline'>
          회원가입
        </Link>
        <Link href='/user/find' className='hover:underline'>
          아이디 / 비밀번호 찾기
        </Link>
      </div>
    </>
  );
};

export default Login;
