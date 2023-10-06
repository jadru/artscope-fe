import { useEffect, useMemo } from 'react';
import { Cookies } from 'react-cookie';

import { useUser as globalUserState } from '@/states';
import { userCookieType } from '@/utils/auth';

export default function useUser() {
  const { user, setUser } = globalUserState();
  const cookies = useMemo(() => new Cookies(), []);
  useEffect(() => {
    const cookieUser = cookies.get('user');
    if (!cookieUser) {
      return;
    }
    const userCookie = cookieUser
      .split('&')
      .reduce((res: NonNullable<unknown>, item: string) => {
        const parts = item.split('=');
        return { ...res, [parts[0]]: parts[1] === null ? null : parts[1] };
      }, {});
    setUser(userCookie as userCookieType);
  }, [cookies, setUser]);
  return user;
}
