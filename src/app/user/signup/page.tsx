'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Title from '@/components/Title';

import SignupForm from '@/app/user/signup/SignupForm';
import { useUser } from '@/states';

const SignupPage = () => {
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
        title='회원가입'
        description='회원가입을 하시면 다양한 서비스를 이용하실 수 있습니다.'
      />
      <SignupForm />
    </>
  );
};

export default SignupPage;
