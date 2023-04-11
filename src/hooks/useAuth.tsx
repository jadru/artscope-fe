import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import { Cookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';

import { artistAuthRequired } from '@/constant/auth';
import { isTokenLoadingAtom } from '@/states/atom';
import jxios from '@/utils/jxios';

const useAuth = () => {
  const [isTokenRefreshing, setIsTokenRefreshing] =
    useRecoilState(isTokenLoadingAtom);
  const router = useRouter();
  const cookies = useMemo(() => new Cookies(), []);
  const refresh = useCallback(async () => {
    if (!isTokenRefreshing && !router.asPath.startsWith('/oauth2/redirect')) {
      if (
        !jxios.defaults.headers.common['Authorization'] &&
        cookies.get('refreshToken')
      ) {
        await setIsTokenRefreshing(true);
        await jxios
          .post('/api/refresh', cookies.get('refreshToken'), {
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
            const decodedRefreshToken: { exp: number } =
              jwt_decode(refreshToken);
            cookies.set('refreshToken', refreshToken, {
              expires: new Date(decodedRefreshToken.exp * 1000),
              path: '/',
            });
          })
          .catch(() => {
            cookies.remove('refreshToken', { path: '/' });
            router
              .push('/auth/login')
              .then(() => toast.warn('로그인이 필요합니다.'));
          })
          .finally(() => setIsTokenRefreshing(false));
      }
      if (artistAuthRequired.includes(router.asPath)) {
        if (
          !jxios.defaults.headers.common['Authorization'] &&
          !isTokenRefreshing &&
          !cookies.get('refreshToken')
        ) {
          router
            .push('/auth/login')
            .then(() => toast.warn('로그인이 필요합니다.'));
        }
      }
    }
  }, [isTokenRefreshing, router, cookies, setIsTokenRefreshing]);
  useEffect(() => {
    refresh();
  }, [refresh]);
};

export default useAuth;
