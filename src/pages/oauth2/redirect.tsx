import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Cookies } from 'react-cookie';

const RedirectOAuth2 = () => {
  const { push, query } = useRouter();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveToken = async (token: string) => {
    const cookies = new Cookies();
    const decodedToken: { exp: number } = jwt_decode(token);
    await cookies.set('refreshToken', token, {
      expires: new Date(decodedToken.exp * 1000),
      path: '/',
    });
    await push('/');
  };
  useEffect(() => {
    if (query.token) {
      saveToken(query.token as string);
    }
  }, [saveToken, query.token]);

  return <div></div>;
};

export default RedirectOAuth2;
