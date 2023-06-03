import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import { Cookies } from 'react-cookie';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { artistAuthRequired } from '@/constant/auth';
import { isTokenLoadingAtom, userNameAndRoleAtom } from '@/states/atom';
import jxios from '@/utils/jxios';

const useAuth = () => {
  const [isTokenRefreshing, setIsTokenRefreshing] =
    useRecoilState(isTokenLoadingAtom);
  const setUserInfo = useSetRecoilState(userNameAndRoleAtom);
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
            data: cookies.get('refreshToken'),
            headers: {
              'Content-Type': 'text/plain',
            },
          })
          .then(async (res) => {
            const { accessToken, refreshToken } = res.data;
            jxios.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${accessToken}`;
            const decodedRefreshToken: { exp: number } =
              jwt_decode(refreshToken);
            const decodedAccessToken: {
              exp: number;
              sub: string;
              auth: string;
            } = jwt_decode(accessToken);
            cookies.remove('refreshToken');
            cookies.set('refreshToken', refreshToken, {
              expires: new Date(decodedRefreshToken.exp * 1000),
              path: '/',
            });
            await jxios.get('/api/members/profile').then(async (res) => {
              await setUserInfo({
                username: decodedAccessToken.sub,
                role: decodedAccessToken.auth,
                profileImage: res.data.picture || undefined,
              });
            });
          })
          .catch(() => {
            cookies.remove('refreshToken');
            router.push('/user/login');
          })
          .finally(() => setIsTokenRefreshing(false));
      }
      if (artistAuthRequired.includes(router.asPath)) {
        if (
          !jxios.defaults.headers.common['Authorization'] &&
          !cookies.get('refreshToken')
        ) {
          await router.push('/user/login');
        }
      }
    }
  }, [isTokenRefreshing, router, cookies, setIsTokenRefreshing, setUserInfo]);
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useAuth;
