import jwt_decode from 'jwt-decode';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import { QueryClient, QueryClientProvider } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';
import 'react-toastify/dist/ReactToastify.min.css';

import jxios from '@/utils/jxios';

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

const artistAuthRequired = ['/profile', '/upload', '/artist/info'];

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const cookies = new Cookies();
    if (!isTokenRefreshing) {
      if (
        !jxios.defaults.headers.common['Authorization'] &&
        cookies.get('refreshToken')
      ) {
        setIsTokenRefreshing(true);
        jxios
          .post('/api/refresh', cookies.get('refreshToken'), {
            withCredentials: false,
            data: cookies.get('refreshToken'),
            headers: {
              'Content-Type': 'text/plain',
            },
          })
          .then((res) => {
            const { accessToken, refreshToken } = res.data;
            jxios.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${accessToken}`;
            const decodedRefreshToken: { exp: number } =
              jwt_decode(refreshToken);
            cookies.set('refreshToken', refreshToken, {
              expires: new Date(decodedRefreshToken.exp * 1000),
            });
          })
          .catch(() => {
            cookies.remove('refreshToken');
            router
              .push('/login')
              .then(() => toast.warn('로그인이 필요합니다.'));
          })
          .finally(() => setIsTokenRefreshing(false));
      }
      if (artistAuthRequired.includes(router.asPath)) {
        if (
          !jxios.defaults.headers.common['Authorization'] &&
          !isTokenRefreshing &&
          !cookies.get('refreshToken')
        ) {
          router.push('/login').then(() => toast.warn('로그인이 필요합니다.'));
        }
      }
    }
  }, [router.events, router, isTokenRefreshing]);
  return (
    <>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
