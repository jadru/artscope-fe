import GoogleTagManager from '@magicul/next-google-tag-manager';
import { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans_KR } from 'next/font/google';
import Script from 'next/script';
import React from 'react';
import { ToastContainer } from 'react-toastify';

import '../styles/globals.scss';
import 'react-toastify/dist/ReactToastify.css';

import { Providers } from '@/app/providers';
import {
  GOOGLE_ANALYTICS_ID,
  GOOGLE_TAG_MANAGER_ID,
  NEXT_PUBLIC_ROOT_URL,
} from '@/constant/env';
import { cls } from '@/utils';

const ibm_flex_Sans_KR = IBM_Plex_Sans_KR({
  weight: ['200', '400', '700'],
  variable: '--ibm-plex-sans-kr',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(NEXT_PUBLIC_ROOT_URL + '/'),
  title: {
    template: '%s | 창의적인 예술가들의 성장과 교류 커뮤니티 Artscope',
    default: 'Artscope | 창의적인 예술가들의 성장과 교류 커뮤니티 아트스코프',
  },
  applicationName: 'Artscope',
  description:
    'Artscope은 예술가들의 성장과 교류를 위한 플랫폼입니다. ' +
    '작품 등록, 예술가 검색, 소통 기능, 프로젝트 제안, 예술 관련 정보 제공 등 다양한 기능을 제공합니다. ' +
    '이를 통해 예술가와 기획자들의 소통과 협업을 촉진하여, 새로운 예술 작품을 탄생시키는 데 기여합니다. ' +
    '예술에 관심 있는 모든 분들이 Artscope를 통해 새로운 경험을 할 수 있기를 기대합니다.',
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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: {
      template: '%s | 창의적인 예술가들의 성장과 교류 커뮤니티 Artscope',
      default: 'Artscope | 창의적인 예술가들의 성장과 교류 커뮤니티 아트스코프',
    },
    description:
      'Artscope은 예술가들의 성장과 교류를 위한 플랫폼입니다. ' +
      '작품 등록, 예술가 검색, 소통 기능, 프로젝트 제안, 예술 관련 정보 제공 등 다양한 기능을 제공합니다. ' +
      '이를 통해 예술가와 기획자들의 소통과 협업을 촉진하여, 새로운 예술 작품을 탄생시키는 데 기여합니다. ' +
      '예술에 관심 있는 모든 분들이 Artscope를 통해 새로운 경험을 할 수 있기를 기대합니다.',
    siteName: 'Artscope',
    type: 'website',
    locale: 'ko_KR',
    url: NEXT_PUBLIC_ROOT_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  themeColor: 'white',
  initialScale: 1,
  maximumScale: 1,
  width: 'device-width',
  colorScheme: 'light',
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
      <body className={cls(ibm_flex_Sans_KR.className, 'min-h-screen')}>
        <ToastContainer limit={2} hideProgressBar />
        <link rel='manifest' href='/manifest.json' />
        {GOOGLE_TAG_MANAGER_ID && (
          <GoogleTagManager id={GOOGLE_TAG_MANAGER_ID} />
        )}
        {GOOGLE_ANALYTICS_ID && (
          <>
            <Script
              src={
                'https://www.googletagmanager.com/gtag/js?id=' +
                GOOGLE_ANALYTICS_ID
              }
            />
            <Script id='google-analytics'>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ANALYTICS_ID}');
              `}
            </Script>
          </>
        )}

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
