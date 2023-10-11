'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Cookies } from 'react-cookie';
import { toast } from 'react-toastify';

import { useUser } from '@/states';
import jxios from '@/utils/jxios';

const SignoutPage = () => {
  const cookies = useMemo(() => new Cookies(), []);
  const { push, refresh } = useRouter();
  const { clearUser } = useUser();
  useEffect(() => {
    jxios.post('/api/logout');
    cookies.remove('refreshToken');
    clearUser();
    push('/');
    toast.success('로그아웃 되었습니다.');
    refresh();
  }, [clearUser, refresh, cookies, push]);
  return <></>;
};

export default SignoutPage;
