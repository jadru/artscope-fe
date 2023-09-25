import { useEffect, useMemo } from 'react';
import { Cookies } from 'react-cookie';

import useUser from '@/hooks/useUser';

import { saveUserOnCookie } from '@/utils/auth';
import jxios from '@/utils/jxios';

export default function useToken() {
  const cookies = useMemo(() => new Cookies(), []);
  const user = useUser();
  useEffect(() => {
    if (jxios.defaults.headers.common['Authorization']) {
      return;
    }
    const refreshToken = cookies.get('refreshToken');
    if (user) {
      return;
    }
    if (!refreshToken) {
      return;
    }
    jxios
      .post('/api/refresh', refreshToken, {
        headers: { 'Content-Type': 'text/plain' },
      })
      .then((res) => {
        const { accessToken, refreshToken, expiresIn } = res.data;
        jxios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`;
        cookies.remove('refreshToken');
        cookies.set('refreshToken', refreshToken, {
          path: '/',
        });
        jxios.get('/api/members/profile').then((resProfile) => {
          saveUserOnCookie(resProfile.data, cookies, expiresIn as number);
        });
      })
      .catch((err) => {
        if (
          err.response.status === 400 ||
          err.response.status === 401 ||
          err.response.status === 403
        ) {
          cookies.remove('refreshToken');
        }
      });

    return () => {
      cookies.remove('refreshToken');
    };
  }, [cookies, user]);
}
