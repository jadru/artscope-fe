import axios from 'axios';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Cookies } from 'react-cookie';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';
import 'react-toastify/dist/ReactToastify.min.css';

import jxios from '@/utils/jxios';

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();
  const cookies = useMemo(() => new Cookies(), []);
  useEffect(() => {
    const refreshToken: string = cookies.get('refreshToken');
    if (refreshToken) {
      jxios
        .post('/api/refresh', refreshToken)
        .then((res) => {
          const { accessToken } = res.data;
          axios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${accessToken}`;
        })
        .catch(() => {
          cookies.remove('refreshToken');
        });
    }
  }, [cookies, router.events]);
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
