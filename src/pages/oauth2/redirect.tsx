import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';

import jxios from '@/utils/jxios';

const RedirectOAuth2 = () => {
  const { push, query } = useRouter();
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);
  const [, setCookie] = useCookies(['refreshToken']);
  useEffect(() => {
    if (query.token && !isTokenRefreshing) setIsTokenRefreshing(true);
    jxios
      .post('/api/refresh', query.token, {
        withCredentials: false,
        headers: {
          'Content-Type': 'text/plain',
        },
      })
      .then((res) => {
        const { accessToken, refreshToken } = res.data;
        const decodedRefreshToken: { exp: number } = jwt_decode(refreshToken);
        setCookie('refreshToken', refreshToken, {
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
      })
      .catch((err) => {
        toast.error(err.message);
        push('/').then(() => toast.error('로그인에 실패했습니다.'));
      })
      .finally(() => setIsTokenRefreshing(false));
  }, [isTokenRefreshing, setCookie, push, query]);

  return <div></div>;
};

export default RedirectOAuth2;
