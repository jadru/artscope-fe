import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { onSuccess } from '@/app/user/onSuccess';
import { setAccessToken, setRefreshToken } from '@/auth/cookieTokenManager';
import jxios from '@/utils/jxios';

import { loginResponseType } from '@/types/auth';
import { profileApiResponseType } from '@/types/profile';

export const onLogin = async (
  tokenData: loginResponseType,
  router: AppRouterInstance,
  setUser: (user: profileApiResponseType) => void
) => {
  jxios.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${tokenData.accessToken}`;
  setAccessToken(tokenData.accessToken, tokenData.expiresIn);
  setRefreshToken(tokenData.refreshToken, tokenData.refreshExpiresIn);
  await jxios.get('/api/members/profile').then((res) => {
    const data: profileApiResponseType = res.data;
    setUser(data);

    onSuccess(data.artistStatus, router);
  });
};
