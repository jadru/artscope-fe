import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Cookies } from 'react-cookie';

const RedirectOAuth2 = () => {
  const { push, query } = useRouter();

  useEffect(() => {
    if (query.token) {
      const cookies = new Cookies();
      const decodedToken: { exp: number } = jwt_decode(query.token as string);
      cookies.set('refreshToken', query.token, {
        expires: new Date(decodedToken.exp * 1000),
      });
      push('/');
    }
  }, [push, query]);

  return <div></div>;
};

export default RedirectOAuth2;
