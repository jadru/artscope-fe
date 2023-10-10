import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { Cookies } from 'react-cookie';

import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { profileApiResponseType } from '@/types';

export default function useToken({
  setIsLoading,
}: {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const cookies = useMemo(() => new Cookies(), []);
  const { user, setUser } = useUser();
  const refreshToken = cookies.get('refreshToken');

  useEffect(() => {
    if (jxios.defaults.headers.common['Authorization']) {
      setIsLoading(false);
      return;
    }
    if (user) {
      setIsLoading(false);
      return;
    }
    if (!refreshToken) {
      setIsLoading(false);
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
          expires: new Date((new Date().getTime() / 1000 + expiresIn) * 1000),
        });
        jxios.get('/api/members/profile').then((response) => {
          const profileResponse: profileApiResponseType = response.data;
          setUser(profileResponse);
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
      cookies.remove('refreshToken');
      setIsLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
