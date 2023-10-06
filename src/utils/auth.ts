import { Cookies } from 'react-cookie';

import { profileApiType, roleType } from '@/types';

export type userCookieType = {
  username: string;
  role: roleType;
  name: string;
  email: string;
  picture: string;
};

export const saveUserOnCookie = (
  data: profileApiType,
  cookies: Cookies,
  expires: number
) => {
  if (data) {
    const { username, name, email, picture } = data;
    cookies.set(
      'user',
      `username=${username}&name=${name}&email=${email}&picture=${picture}`,
      {
        path: '/',
        expires: new Date((new Date().getTime() / 1000 + expires) * 1000),
      }
    );
  }
};

export const removeUserOnCookie = (cookies: Cookies) => {
  cookies.remove('user');
};
