import cookie from 'react-cookies';

import { NEXT_PUBLIC_ROOT_URL } from '@/constant/env';

export const setAccessToken = (accessToken: string, expiresIn: number) =>
  cookie.save('access-token', accessToken, {
    path: '/',
    domain: NEXT_PUBLIC_ROOT_URL,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: new Date(Date.now() + expiresIn * 1000 + 9 * 60 * 60 * 1000),
  });

export const setRefreshToken = (
  refreshToken: string,
  refreshExpiresIn: number
) =>
  cookie.save('refresh-token', refreshToken, {
    path: '/',
    expires: new Date(
      Date.now() + refreshExpiresIn * 1000 + 9 * 60 * 60 * 1000
    ),
  });

export const getAccessToken = async () => await cookie.load('access-token');

export const getRefreshToken = async () => await cookie.load('refresh-token');

export const removeAccessToken = () =>
  cookie.remove('access-token', {
    path: '/',
  });

export const removeRefreshToken = () =>
  cookie.remove('refresh-token', {
    path: '/',
  });
