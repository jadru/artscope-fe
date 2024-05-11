import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { onGetProfile } from '@/auth/onLogin';
import { useUser } from '@/states';

export default function useUserHook() {
  const { isLogin, setUser } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (isLogin) return;
    const fetchProfile = async () => await onGetProfile(router, setUser);
    fetchProfile();
  }, [setUser]);
}
