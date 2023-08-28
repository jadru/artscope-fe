'use client';

import jwt_decode from 'jwt-decode';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { Cookies } from 'react-cookie';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { auth } from '@/api';
import { artistAuthRequired } from '@/constant/auth';
import { isTokenLoadingAtom, userNameAndRoleAtom } from '@/states/atom';
import jxios from '@/utils/jxios';

const useAuth = () => {
  const [isTokenRefreshing, setIsTokenRefreshing] =
    useRecoilState(isTokenLoadingAtom);
  const setUserInfo = useSetRecoilState(userNameAndRoleAtom);
  const router = useRouter();
  const asPath = usePathname();
  const cookies = useMemo(() => new Cookies(), []);
  const refresh = useCallback(async () => {
    if (!isTokenRefreshing && !asPath.startsWith('/oauth2/redirect')) {
      if (
        !jxios.defaults.headers.common['Authorization'] &&
        cookies.get('refreshToken')
      ) {
        await setIsTokenRefreshing(true);
        auth
          .refresh(cookies.get('refreshToken'))
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
            router.push('/user/auth/login');
          })
          .finally(() => setIsTokenRefreshing(false));
      }
      if (artistAuthRequired.includes(asPath)) {
        if (
          !jxios.defaults.headers.common['Authorization'] &&
          !cookies.get('refreshToken')
        ) {
          await router.push('/user/auth/login');
        }
      }
    }
  }, [
    isTokenRefreshing,
    asPath,
    cookies,
    setIsTokenRefreshing,
    setUserInfo,
    router,
  ]);
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useAuth;
