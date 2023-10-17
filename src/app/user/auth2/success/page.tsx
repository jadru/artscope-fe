'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Cookies } from 'react-cookie';

import { onLogin } from '@/auth/onLogin';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { loginResponseType } from '@/types/auth';

const RedirectOAuth2 = () => {
  const router = useRouter();
  const cookies = useMemo(() => new Cookies(), []);
  const { setUser } = useUser();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  useEffect(() => {
    if (token) {
      jxios
        .post('/api/refresh', token as string, {
          headers: {
            'Content-Type': 'text/plain',
          },
        })
        .then(async (ressponseRefreshToken) => {
          await onLogin(
            ressponseRefreshToken.data as loginResponseType,
            router,
            setUser
          );
        });
    } else {
      router.push('/');
    }
  }, [setUser, cookies, router, token]);

  return <div></div>;
};

export default RedirectOAuth2;
