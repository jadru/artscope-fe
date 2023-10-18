import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { onGetProfile } from '@/auth/onLogin';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

export default function useUserHook() {
  const { setUser } = useUser();
  const router = useRouter();
  useEffect(() => {
    const fetch = async () => await onGetProfile(router, setUser);
    if (!jxios.defaults.headers.common.Authorization) fetch();
  }, [router, setUser]);
}
