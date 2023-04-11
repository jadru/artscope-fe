import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Cookies } from 'react-cookie';
import { toast } from 'react-toastify';

import Seo from '@/components/Seo';

import jxios from '@/utils/jxios';

const RedirectOAuth2 = () => {
  const { push, query } = useRouter();

  useEffect(() => {
    if (query.token) {
      const cookies = new Cookies();
      jxios
        .post('/api/refresh', query.token, {
          withCredentials: false,
          data: cookies.get('refreshToken'),
          headers: {
            'Content-Type': 'text/plain',
          },
        })
        .then((res) => {
          const { accessToken, refreshToken } = res.data;
          jxios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${accessToken}`;
          const decodedRefreshToken: { exp: number } = jwt_decode(refreshToken);
          cookies.set('refreshToken', refreshToken, {
            expires: new Date(decodedRefreshToken.exp * 1000),
            path: '/',
          });
          jxios
            .get('/api/members/profile')
            .then((res) => {
              if (res.data.artistStatus === 'NONE') {
                push('/artist/info').then(() =>
                  toast.info('작가 정보를 입력해주세요.')
                );
              } else {
                push('/').then(() => toast.success('로그인이 완료되었습니다.'));
              }
            })
            .catch(() => {
              push('/').then(() => toast.success('로그인이 완료되었습니다.'));
            });
        })
        .catch(() => {
          cookies.remove('refreshToken', { path: '/' });
          push('/login');
        });
    }
  }, [push, query.token]);

  return <Seo templateTitle='Google Login'></Seo>;
};

export default RedirectOAuth2;
