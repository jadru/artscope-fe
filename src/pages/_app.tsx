import { NextPage } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { RecoilRoot } from 'recoil';

import '@/styles/globals.scss';
import 'react-toastify/dist/ReactToastify.min.css';

import { GA_TRACKING_ID } from '@/constant/env';

export type NextPageWithLayout<P = NonNullable<unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [queryClient] = useState(() => new QueryClient());
  const [isDark, setDark] = useState(false);
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) setDark(true);
    else setDark(false);
  }, []);

  return getLayout(
    <RecoilRoot>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='mobile-web-app-capable' content='yes' />
      </Head>
      <ToastContainer
        limit={2}
        theme={isDark ? 'dark' : 'light'}
        hideProgressBar
      />
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
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default MyApp;
