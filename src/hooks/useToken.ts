import { useEffect, useMemo } from 'react';
import { Cookies } from 'react-cookie';

import { userStore } from '@/states';
import jxios from '@/utils/jxios';

export default function useToken() {
  const { setUser, setIsLoading } = userStore();
  const cookies = useMemo(() => new Cookies(), []);
  useEffect(() => {
    if (jxios.defaults.headers.common['Authorization']) {
      setIsLoading(false);
      return;
    }
    const refreshToken = cookies.get('refreshToken');
    if (!refreshToken) {
      setIsLoading(false);
      return;
    }
    jxios
      .post('/api/refresh', refreshToken, {
        headers: { 'Content-Type': 'text/plain' },
      })
      .then((res) => {
        const { accessToken, refreshToken } = res.data;
        jxios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`;
        cookies.remove('refreshToken');
        cookies.set('refreshToken', refreshToken, {
          path: '/',
        });
        jxios.get('/api/members/profile').then((resProfile) => {
          const { data } = resProfile;
          setUser({
            username: data.username,
            role: data.authrities,
            name: data.name,
            profilePicture: data.picture,
            email: data.email,
            oauthProvider: data.oauthProvider,
          });
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
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      setIsLoading(false);
      cookies.remove('refreshToken');
    };
  }, [cookies, setUser, setIsLoading]);
}
