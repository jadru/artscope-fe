import { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Script from 'next/script';
import React from 'react';
import { ToastContainer } from 'react-toastify';

import '../styles/globals.scss';
import 'react-toastify/dist/ReactToastify.css';

import Footer from '@/components/Footer';

import NavBar from '@/app/(feed)/Navbar';
import { Providers } from '@/app/providers';
import { GA_TRACKING_ID, NEXT_PUBLIC_ROOT_URL } from '@/constant/env';
import { cls } from '@/utils';

const noto_Sans_KR = Noto_Sans_KR({
  weight: ['100', '400', '700', '900'],
  variable: '--noto-sans-kr',
  subsets: ['latin'],
  display: 'swap',
});

// const nanum_Myeongjo = Nanum_Myeongjo({
//   preload: false,
//   weight: ['400'],
//   variable: '--nanum-myeongjo',
// });

export const metadata: Metadata = {
  metadataBase: new URL(NEXT_PUBLIC_ROOT_URL + '/'),
  title: {
    template: '%s | 새로운 예술 플랫폼 Artscope',
    absolute: 'Artscope 아트스코프 - 새로운 예술 플랫폼',
  },
  applicationName: 'Artscope',
  description: '예술가와 기획자를 위한 새로운 예술 네트워크 플랫폼 Artscope',
  viewport: 'width=device-width, initial-scale=1.0',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes',
  },
  icons: {
    icon: '/favicon/favicon.svg',
    shortcut: '/favicon/favicon.svg',
    apple: '/favicon/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/favicon/android-chrome-192x192.png',
      },
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#086788',
      },
    ],
  },
  generator: 'Media Xi',
  keywords: [
    '아트스코프',
    'Artscope',
    '예술',
    'art',
    'artwork',
    'artist',
    'artplatform',
  ],
  colorScheme: 'light',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Artscope',
    description: '예술가와 기획자를 위한 새로운 예술 네트워크 플랫폼',
    siteName: 'Artscope',
    type: 'website',
    locale: 'ko_KR',
    url: NEXT_PUBLIC_ROOT_URL,
  },
  themeColor: 'white',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko' className='light'>
      <body className={cls(noto_Sans_KR.className)}>
        <ToastContainer limit={2} hideProgressBar />
        <link rel='manifest' href='/manifest.json' />
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
        <Providers>
          <NavBar theme='light' />
          <div className='container mx-auto min-h-[calc(100vh-10rem)] max-w-[1024px]'>
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
