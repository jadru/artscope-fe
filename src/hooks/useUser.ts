import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { onGetProfile } from '@/auth/onLogin';
import { useUser } from '@/states';

export default function useUserHook() {
  const { setUser } = useUser();
  const router = useRouter();
  useEffect(() => {
    const fetch = async () => await onGetProfile(router, setUser);
    fetch();
  }, [router, setUser]);
}
