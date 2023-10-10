'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Cookies } from 'react-cookie';
import { toast } from 'react-toastify';

import Seo from '@/components/Seo';

import { onSuccess } from '@/app/user/onSuccess';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { profileApiResponseType } from '@/types';

const RedirectOAuth2 = () => {
  const router = useRouter();
  const cookies = useMemo(() => new Cookies(), []);
  const { setUser } = useUser();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  useEffect(() => {
    if (token) {
      jxios
        .post('/api/refresh', token as string, {
          headers: {
            'Content-Type': 'text/plain',
          },
        })
        .then((ress) => {
          jxios.defaults.headers.common['Authorization'] =
            'Bearer ' + ress.data.accessToken;
          cookies.set('refreshToken', ress.data.refreshToken, {
            path: '/',
          });
          jxios.get('/api/members/profile').then((res) => {
            const data: profileApiResponseType = res.data;
            setUser(data);
            toast.success('로그인이 완료되었습니다.');
            onSuccess(data.artistStatus, router);
          });
        });
    } else {
      router.push('/');
    }
  }, [setUser, cookies, router, token]);

  return <Seo templateTitle='구글 로그인'></Seo>;
};

export default RedirectOAuth2;
