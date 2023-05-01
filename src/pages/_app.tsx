import { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { CookiesProvider } from 'react-cookie';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { RecoilRoot } from 'recoil';

import '@/styles/globals.scss';
import 'react-toastify/dist/ReactToastify.min.css';

import { GA_TRACKING_ID } from '@/constant/env';

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [isDark, setDark] = useState(false);
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) setDark(true);
    else setDark(false);
  }, []);

  return (
    <RecoilRoot>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='mobile-web-app-capable' content='yes' />
      </Head>
      <CookiesProvider>
        <ToastContainer
          limit={2}
          theme={isDark ? 'dark' : 'light'}
          hideProgressBar
        />
        <QueryClientProvider client={queryClient}>
          <Script
            strategy='afterInteractive'
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <Script
            id='gtag-init'
            strategy='afterInteractive'
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
          <Component {...pageProps} />
        </QueryClientProvider>
      </CookiesProvider>
    </RecoilRoot>
  );
}

export default MyApp;
