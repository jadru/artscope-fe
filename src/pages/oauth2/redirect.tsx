import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Cookies } from 'react-cookie';
import Session from 'react-session-api';
import { toast } from 'react-toastify';

const RedirectOAuth2 = () => {
  const router = useRouter();
  useEffect(() => {
    const cookies = new Cookies();
    try {
      axios.post('/api/refresh', router.query.token).then((res) => {
        const token = res.data.accessToken;
        cookies.set('refreshToken', res.data.refreshToken, {
          expires: res.data.expiresIn,
        });
        Session.set('token', token);
        router.push('/').then(() => toast.success('로그인이 완료되었습니다.'));
      });
    } catch (err) {
      let message;
      if (err instanceof Error) message = err.message;
      else message = String(err);
      toast.error(message);
    }
  }, [router]);

  return <div></div>;
};

export default RedirectOAuth2;
