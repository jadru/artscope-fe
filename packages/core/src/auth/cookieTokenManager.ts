import { setCookie, getCookie, deleteCookie } from 'cookies-next';

import { NEXT_PUBLIC_ROOT_URL } from '@/constant/env';

export const setAccessToken = (accessToken: string, expiresIn: number) =>
  setCookie('access-token', accessToken, {
    path: '/',
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + expiresIn * 1000 + 9 * 60 * 60 * 1000),
  });

export const setRefreshToken = (
  refreshToken: string,
  refreshExpiresIn: number
) =>
  setCookie('refresh-token', refreshToken, {
    path: '/',
    expires: new Date(
      Date.now() + refreshExpiresIn * 1000 + 9 * 60 * 60 * 1000
    ),
  });

export const getAccessToken = () => getCookie('access-token');

export const getRefreshToken = () => getCookie('refresh-token');

export const removeAccessToken = () =>
  deleteCookie('access-token', {
    path: '/',
  });

export const removeRefreshToken = () =>
  deleteCookie('refresh-token', {
    path: '/',
  });
