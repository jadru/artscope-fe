import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { onSuccess } from '@/app/user/onSuccess';
import {
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/auth/cookieTokenManager';
import jxios from '@/utils/jxios';

import { loginResponseType } from '@/types/auth';
import { profileApiResponseType } from '@/types/profile';

export const onLogin = async (
  tokenData: loginResponseType,
  router: AppRouterInstance,
  // eslint-disable-next-line no-unused-vars
  setUser: (user: profileApiResponseType | undefined) => void,
  redirect: string
) => {
  jxios.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${tokenData.accessToken}`;
  setAccessToken(tokenData.accessToken, tokenData.expiresIn);
  setRefreshToken(tokenData.refreshToken, tokenData.refreshExpiresIn);
  await onGetProfile(router, setUser, redirect);
};

export const onGetProfile = async (
  router: AppRouterInstance,
  // eslint-disable-next-line no-unused-vars
  setUser: (user: profileApiResponseType | undefined) => void,
  redirect: string
) => {
  if (await getRefreshToken()) {
    const res = await jxios.get('/api/members/profile', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data: profileApiResponseType = await res.data;
    if (res.status === 200) {
      setUser(data);
      onSuccess(data.roleStatus, router, redirect);
    } else {
      setUser(undefined);
    }
  } else {
    setUser(undefined);
  }
};
