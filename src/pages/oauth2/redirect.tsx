import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

const RedirectOAuth2 = () => {
  const { push, query } = useRouter();
  const [, setCookie] = useCookies(['refreshToken']);
  useEffect(() => {
    if (query.token) {
      push('/').then(() => {
        const decodedToken: { exp: number } = jwt_decode(query.token as string);
        setCookie('refreshToken', query.token, {
          expires: new Date(decodedToken.exp * 1000),
        });
      });
    }
  }, [push, query, setCookie]);

  return <div></div>;
};

export default RedirectOAuth2;
