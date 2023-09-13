'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Cookies } from 'react-cookie';
import { toast } from 'react-toastify';

import { userStore } from '@/states';
import jxios from '@/utils/jxios';

const SignoutPage = () => {
  const cookies = useMemo(() => new Cookies(), []);
  const { setUser } = userStore();
  const { push } = useRouter();
  useEffect(() => {
    jxios.post('/api/logout').then(() => {
      cookies.remove('refreshToken');
      setUser({
        name: undefined,
        username: undefined,
        profilePicture: undefined,
        email: undefined,
        oauthProvider: undefined,
        role: [],
      });
      push('/');
      toast.success('로그아웃 되었습니다.');
    });
  }, [cookies, push, setUser]);
  return <></>;
};

export default SignoutPage;
