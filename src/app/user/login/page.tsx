'use client';

import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AiOutlineGoogle } from 'react-icons/ai';

import Title from '@/components/Title';

import LoginForm from '@/app/user/login/LoginForm';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import { useUser } from '@/states';

const Login = () => {
  const router = useRouter();
  const { isLogin } = useUser();

  useEffect(() => {
    if (isLogin) {
      router.push('/');
    }
  }, [router, isLogin]);
  return (
    <>
      <Title>로그인</Title>
      <LoginForm />
      <div className='flex gap-1'>
        <Button
          color='secondary'
          variant='flat'
          onClick={() => router.push('/user/signup')}
          className='w-1/2'
        >
          회원가입
        </Button>
        <Button
          color='warning'
          variant='flat'
          className='w-1/2'
          startContent={<AiOutlineGoogle className='h-6 w-6 text-lg' />}
          onClick={() =>
            router.push(NEXT_PUBLIC_API_URL + '/oauth2/authorization/google')
          }
        >
          구글로 로그인
        </Button>
      </div>
    </>
  );
};

export default Login;
