'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import {
  removeAccessToken,
  removeRefreshToken,
} from '@/auth/cookieTokenManager';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

const SignoutPage = () => {
  const { push, refresh } = useRouter();
  const { clearUser } = useUser();
  useEffect(() => {
    jxios.post('/api/logout');
    removeAccessToken();
    removeRefreshToken();
    clearUser();
    push('/');
    toast.success('로그아웃 되었습니다.');
    refresh();
  }, [clearUser, refresh, push]);
  return <></>;
};

export default SignoutPage;
