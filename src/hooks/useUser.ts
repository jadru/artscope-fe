import { useEffect, useMemo, useState } from 'react';
import { Cookies } from 'react-cookie';

import { userCookieType } from '@/utils/auth';

export default function useUser() {
  const [user, setUser] = useState<userCookieType>();
  const cookies = useMemo(() => new Cookies(), []);
  useEffect(() => {
    const user = cookies.get('user');
    if (!user) {
      setUser(undefined);
      return;
    }
    const userCookie = user
      .split('&')
      .reduce((res: NonNullable<unknown>, item: string) => {
        const parts = item.split('=');
        return { ...res, [parts[0]]: parts[1] === null ? null : parts[1] };
      }, {});
    setUser(userCookie as userCookieType);
  }, [cookies]);
  return user || null;
}
