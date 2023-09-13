'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Cookies } from 'react-cookie';
import { toast } from 'react-toastify';

import Seo from '@/components/Seo';

import { userStore } from '@/states';
import jxios from '@/utils/jxios';

const RedirectOAuth2 = () => {
  const { push } = useRouter();
  const cookies = useMemo(() => new Cookies(), []);
  const { token } = useParams();
  const { setUser } = userStore();
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
            httpOnly: true,
            sameSite: 'strict',
          });
          jxios.get('/api/members/profile').then((res) => {
            setUser({
              username: res.data.username,
              name: res.data.name,
              profilePicture: res.data.profilePicture,
              email: res.data.email,
              role: res.data.role,
            });

            if (res.data.artistStatus === 'NONE') {
              push('/user/signup/artist');
              toast.info('회원가입을 해주세요.');
            } else {
              push('/');
              toast.success('로그인이 완료되었습니다.');
            }
          });
        });
    } else {
      push('/');
    }
  }, [cookies, push, token, setUser]);

  return <Seo templateTitle='구글 로그인'></Seo>;
};

export default RedirectOAuth2;
