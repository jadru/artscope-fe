import { Metadata } from 'next';
import { Nanum_Myeongjo, Noto_Sans_KR } from 'next/font/google';
import Script from 'next/script';
import React from 'react';
import { ToastContainer } from 'react-toastify';

import '../styles/globals.scss';
import 'react-toastify/dist/ReactToastify.css';

import NavBar from '@/app/Navbar';
import { Providers } from '@/app/providers';
import { GA_TRACKING_ID } from '@/constant/env';
import { cls } from '@/utils';

const nanum_Myeongjo = Nanum_Myeongjo({
  preload: false,
  weight: ['400', '700'],
  variable: '--nanum-myeongjo',
});

const noto_Sans_KR = Noto_Sans_KR({
  preload: false,
  weight: ['100', '400', '700', '900'],
  variable: '--noto-sans-kr',
});

export const metadata: Metadata = {
  title: 'Artscope',
  description: 'Welcome to Next.js',
  viewport: 'width=device-width, initial-scale=1.0',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes',
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
      <body className={cls(nanum_Myeongjo.className, noto_Sans_KR.className)}>
        <ToastContainer limit={2} hideProgressBar />
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
          <NavBar />
          <div className='container mx-auto min-h-screen max-w-[1024px]'>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
