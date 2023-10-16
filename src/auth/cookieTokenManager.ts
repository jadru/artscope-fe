import cookie from 'react-cookies';

export const setAccessToken = (accessToken: string, expiresIn: number) =>
  cookie.save('access-token', accessToken, {
    path: '/',
    httpOnly: true,
    secure: true,
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

export const getAccessToken = () => cookie.load('access-token');

export const getRefreshToken = () => cookie.load('refresh-token');

export const removeAccessToken = () => cookie.remove('access-token');

export const removeRefreshToken = () => cookie.remove('refresh-token');
