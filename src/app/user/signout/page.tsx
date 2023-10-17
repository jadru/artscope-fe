'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import cookie from 'react-cookies';
import { toast } from 'react-toastify';

import { useUser } from '@/states';
import jxios from '@/utils/jxios';

const SignoutPage = () => {
  const { push, refresh } = useRouter();
  const { clearUser } = useUser();
  useEffect(() => {
    jxios.post('/api/logout');
    cookie.remove('refresh-token');
    clearUser();
    push('/');
    toast.success('로그아웃 되었습니다.');
    refresh();
  }, [clearUser, refresh, push]);
  return <></>;
};

export default SignoutPage;
