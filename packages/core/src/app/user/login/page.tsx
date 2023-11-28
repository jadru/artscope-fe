'use client';

import { Button } from '@nextui-org/react';
import Link from 'next/link';
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
      <Title
        title='로그인'
        description={
          <>
            로그인 및 회원가입시
            <br />
            <Link
              href='https://plip.kr/pcc/1bdbcbd7-0bde-4101-8ce2-cc4e1fc53eef/consent/1.html'
              target='_blank'
              className='font-bold text-black underline'
            >
              개인정보 수집 및 이용 동의서
            </Link>
            {' 및 '}
            <Link
              href='https://www.plip.kr/pcc/1bdbcbd7-0bde-4101-8ce2-cc4e1fc53eef/privacy-policy'
              target='_blank'
              className='font-bold text-black underline'
            >
              개인정보 처리방침
            </Link>
            에
            <br />
            동의하게 됩니다.
          </>
        }
      />
      <p></p>
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
