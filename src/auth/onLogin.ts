import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { onSuccess } from '@/app/user/onSuccess';
import {
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/auth/cookieTokenManager';
import jxios from '@/utils/jxios';
import { getRefreshToken as getRefreshFromApi } from '@/utils/jxios';

import { loginResponseType } from '@/types/auth';
import { profileApiResponseType } from '@/types/profile';

export const onLogin = async (
  tokenData: loginResponseType,
  router: AppRouterInstance,
  setUser: (user: profileApiResponseType | undefined) => void
) => {
  jxios.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${tokenData.accessToken}`;
  setAccessToken(tokenData.accessToken, tokenData.expiresIn);
  setRefreshToken(tokenData.refreshToken, tokenData.refreshExpiresIn);
  await onGetProfile(router, setUser);
};

export const onGetProfile = async (
  router: AppRouterInstance,
  setUser: (user: profileApiResponseType | undefined) => void
) => {
  if (getRefreshToken()) {
    jxios
      .get('/api/members/profile', {
        headers: { withCredentials: true },
      })
      .then((res) => {
        const data: profileApiResponseType = res.data;
        setUser(data);
        onSuccess(data.artistStatus, router);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          getRefreshFromApi();
        }
      });
  } else {
    setUser(undefined);
  }
};
