import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';

import { tokenAtom } from '@/states/atoms';

const RedirectOAuth2 = () => {
  const router = useRouter();
  const setToken = useSetRecoilState(tokenAtom);
  useEffect(() => {
    try {
      const token = router.query.token as string;
      setToken(token);
      router.push('/').then(() => toast.success('로그인이 완료되었습니다.'));
    } catch (err) {
      let message;
      if (err instanceof Error) message = err.message;
      else message = String(err);
      toast.error(message);
    }
  }, [router, setToken]);

  return <div></div>;
};

export default RedirectOAuth2;
