import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Cookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';

import Seo from '@/components/Seo';

import { userNameAndRoleAtom } from '@/states/atom';
import jxios from '@/utils/jxios';

const RedirectOAuth2 = () => {
  const { push, query } = useRouter();
  const setUserInfo = useSetRecoilState(userNameAndRoleAtom);
  useEffect(() => {
    if (query.token) {
      const cookies = new Cookies();
      jxios
        .post('/api/refresh', query.token, {
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
          const decodedAccessToken: {
            exp: number;
            sub: string;
            auth: string;
          } = jwt_decode(accessToken);
          setUserInfo({
            username: decodedAccessToken.sub,
            role: decodedAccessToken.auth,
          });
          cookies.remove('refreshToken');
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
  }, [push, query.token, setUserInfo]);

  return <Seo templateTitle='Google Login'></Seo>;
};

export default RedirectOAuth2;
