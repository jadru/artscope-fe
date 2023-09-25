'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Cookies } from 'react-cookie';
import { toast } from 'react-toastify';

import Seo from '@/components/Seo';

import { saveUserOnCookie } from '@/utils/auth';
import jxios from '@/utils/jxios';

import { profileApiType } from '@/types';

const RedirectOAuth2 = () => {
  const { push } = useRouter();
  const cookies = useMemo(() => new Cookies(), []);
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
            saveUserOnCookie(
              res.data as profileApiType,
              cookies,
              ress.data.expiresIn as number
            );
            push('/');
            toast.success('로그인이 완료되었습니다.');
          });
        });
    } else {
      push('/');
    }
  }, [cookies, push, token]);

  return <Seo templateTitle='구글 로그인'></Seo>;
};

export default RedirectOAuth2;
