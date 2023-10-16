import { setAccessToken, setRefreshToken } from '@/auth/cookieTokenManager';

import { loginResponseType } from '@/types/auth';

export const setLoginOnCookie = (loginResponse: loginResponseType) => {
  setAccessToken(loginResponse.accessToken, loginResponse.expiresIn);
  setRefreshToken(loginResponse.refreshToken, loginResponse.refreshExpiresIn);
};
