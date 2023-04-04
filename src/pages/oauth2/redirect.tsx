import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { Cookies } from 'react-cookie';
import { toast } from 'react-toastify';

import jxios from '@/utils/jxios';

const RedirectOAuth2 = () => {
  const router = useRouter();
  const cookies = useMemo(() => new Cookies(), []);
  const { push } = useRouter();
  useEffect(() => {
    try {
      jxios.post('/api/refresh', router.query.token).then((res) => {
        const { accessToken, refreshToken } = res.data;
        const decodedRefreshToken: { exp: number } = jwt_decode(refreshToken);
        const decodedAccessToken: { auth: string } = jwt_decode(accessToken);
        cookies.set('refreshToken', refreshToken, {
          expires: new Date(decodedRefreshToken.exp * 1000),
        });
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`;
        push('/').then(() => {
          toast.success('로그인이 완료되었습니다.');
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (decodedAccessToken.auth === 'ROLE_USER')
            push('/artist/info').then(() => toast('작가 정보를 입력해주세요.'));
        });
      });
    } catch (err) {
      let message;
      if (err instanceof Error) message = err.message;
      else message = String(err);
      toast.error(message);
    }
  }, [push, cookies, router]);

  return <div></div>;
};

export default RedirectOAuth2;
