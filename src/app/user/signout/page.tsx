'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Cookies } from 'react-cookie';
import { toast } from 'react-toastify';

import jxios from '@/utils/jxios';

const SignoutPage = () => {
  const cookies = useMemo(() => new Cookies(), []);
  const { push, refresh } = useRouter();
  useEffect(() => {
    jxios.post('/api/logout');
    cookies.remove('refreshToken');
    push('/');
    toast.success('로그아웃 되었습니다.');
    refresh();
  }, [refresh, cookies, push]);
  return <></>;
};

export default SignoutPage;
