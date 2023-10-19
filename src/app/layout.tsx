import { Metadata } from 'next';
import { Nanum_Myeongjo, Noto_Sans_KR } from 'next/font/google';
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
  weight: ['100', '400', '700'],
  variable: '--noto-sans-kr',
  subsets: ['latin'],
  display: 'swap',
});

const nanum_Myeongjo = Nanum_Myeongjo({
  preload: false,
  weight: ['400'],
  variable: '--nanum-myeongjo',
});

export const metadata: Metadata = {
  metadataBase: new URL(NEXT_PUBLIC_ROOT_URL + '/'),
  title: {
    template: '%s | 요즘 예술인 커뮤니티 Artscope',
    default: 'Artscope | 요즘 예술인 커뮤니티 아트스코프',
  },
  applicationName: 'Artscope',
  description:
    '예술가와 기획자를 위한 새로운 예술 네트워크 플랫폼 Artscope에서는 Artscope는 다양한 기능을 제공합니다. ' +
    '작품 등록 : 예술가들은 자신의 작품을 등록하고, 작품에 대한 정보와 이미지를 제공할 수 있습니다. ' +
    '예술가 검색 : 사용자는 관심 있는 예술가를 검색하고, 해당 예술가의 작품을 확인할 수 있습니다. ' +
    '소통 기능: 예술가들은 서로 글과 작품에 댓글을 달거나 좋아요를 누를 수 있습니다. ' +
    '프로젝트 제안: 기획자는 예술가에게 프로젝트를 제안하고, 예술가는 프로젝트에 참여 여부를 결정할 수 있습니다. ' +
    '예술 관련 정보 제공: 예술 관련 뉴스, 전시회 정보 등을 제공합니다. ' +
    'Artscope은 예술가와 기획자들의 소통과 협업을 촉진하여, 새로운 예술 작품을 탄생시키는 데 기여하고자 합니다. ' +
    '예술에 관심 있는 모든 분들이 Artscope를 통해 새로운 경험을 할 수 있기를 기대합니다.',
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
      <body className={cls(noto_Sans_KR.className, nanum_Myeongjo.className)}>
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
