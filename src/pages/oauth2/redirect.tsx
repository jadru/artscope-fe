import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Cookies } from 'react-cookie';
import { toast } from 'react-toastify';

import jxios from '@/utils/jxios';

const RedirectOAuth2 = () => {
  const { push, query } = useRouter();
  useEffect(() => {
    const cookies = new Cookies();
    if (query.token)
      try {
        jxios
          .post('/api/refresh', query.token, {
            withCredentials: false,
            data: query.token,
            headers: {
              'Content-Type': 'text/plain',
            },
          })
          .then((res) => {
            const { accessToken, refreshToken } = res.data;
            const decodedRefreshToken: { exp: number } =
              jwt_decode(refreshToken);
            cookies.set('refreshToken', refreshToken, {
              expires: new Date(decodedRefreshToken.exp * 1000),
            });
            jxios.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${accessToken}`;
            push('/').then(() => {
              toast.success('로그인이 완료되었습니다.');
              // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // // @ts-ignore
              // if (decodedAccessToken.auth === 'ROLE_USER')
              //   push('/artist/info').then(() => toast('작가 정보를 입력해주세요.'));
            });
          });
      } catch (err) {
        let message;
        if (err instanceof Error) message = err.message;
        else message = String(err);
        toast.error(message);
      }
  }, [push, query]);

  return <div></div>;
};

export default RedirectOAuth2;
