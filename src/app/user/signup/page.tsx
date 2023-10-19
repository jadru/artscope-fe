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
      <Title>회원가입</Title>
      <SignupForm />
    </>
  );
};

export default SignupPage;
