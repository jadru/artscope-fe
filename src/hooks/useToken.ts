import { useCallbackOnce } from '@toss/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import cookies from 'react-cookies';

import { removeRefreshToken } from '@/auth/cookieTokenManager';
import { onLogin } from '@/auth/onLogin';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

export default function useToken() {
  const { setNotLogin, setUser, isLogin } = useUser();
  const refreshToken = cookies.load('refresh-token');
  const router = useRouter();

  const callToken = useCallbackOnce(() => {
    if (isLogin !== undefined) {
      return;
    }
    if (jxios.defaults.headers.common['Authorization']) {
      return;
    }
    if (cookies.load('access-token')) {
      return;
    }
    if (!refreshToken) {
      setNotLogin();
      return;
    }
    jxios
      .post('/api/refresh', refreshToken, {
        headers: { 'Content-Type': 'text/plain' },
      })
      .then(async (res) => {
        await onLogin(res.data, router, setUser);
      })
      .catch((err) => {
        if (
          err.response.status === 400 ||
          err.response.status === 401 ||
          err.response.status === 403
        ) {
          removeRefreshToken();
          setNotLogin();
        }
      });
  }, []);

  useEffect(() => {
    callToken();
    return () => {
      cookies.remove('refresh-token');
      setNotLogin();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
