import GoogleTagManager from "@magicul/next-google-tag-manager";
import { Metadata, Viewport } from "next";
import { Source_Code_Pro } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import React from "react";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/next";

import "../styles/globals.css";

import { Providers } from "@/app/providers";
import {
  GOOGLE_ANALYTICS_ID,
  GOOGLE_TAG_MANAGER_ID,
  NEXT_PUBLIC_ROOT_URL,
} from "@/constant/env";
import { cn } from "@/utils";
import Navbar from "@/components/Navbar";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const source_Code_PRO = Source_Code_Pro({
  weight: ["900"],
  variable: "--source-code-pro",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(NEXT_PUBLIC_ROOT_URL + "/"),
  title: {
    template: "%s | 창의적인 예술가들의 아카이브 커뮤니티 Artscope",
    default: "Artscope | 창의적인 예술가들의 아카이브 커뮤니티",
  },
  applicationName: "Artscope",
  description:
    "예술가(크리에이터)들의 작품과 생각을 포스팅하고 아카이브, 공유하는 커뮤니티입니다. 작품과 아이디어를 세상과 공유하세요.",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  },
  icons: {
    icon: "/favicon/favicon.svg",
    shortcut: "/favicon/favicon.svg",
    apple: "/favicon/apple-touch-icon.png",
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/favicon/android-chrome-192x192.png",
      },
      {
        rel: "mask-icon",
        url: "/favicon.svg",
        color: "#F2EBD7",
      },
    ],
  },
  generator: "Media Xi",
  keywords: [
    "아트스코프",
    "Artscope",
    "예술",
    "art",
    "artwork",
    "artist",
    "artplatform",
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: {
      template: "%s | 창의적인 예술가들의 아카이브 커뮤니티 Artscope",
      default: "Artscope | 창의적인 예술가들의 아카이브 커뮤니티",
    },
    description:
      "예술가(크리에이터)들의 작품과 생각을 포스팅하고 아카이브, 공유하는 커뮤니티입니다. 작품과 아이디어를 세상과 공유하세요.",
    siteName: "Artscope",
    type: "website",
    locale: "ko_KR",
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
  themeColor: "white",
  initialScale: 1,
  maximumScale: 1,
  width: "device-width",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="light font-normal">
      <body
        className={cn(
          pretendard.variable,
          source_Code_PRO.variable,
          "p-0 m-0 min-h-screen font-sans antialiased text-foreground"
        )}
      >
        <ToastContainer limit={2} hideProgressBar />
        <link rel="manifest" href="/manifest.json" />
        {GOOGLE_TAG_MANAGER_ID && (
          <GoogleTagManager id={GOOGLE_TAG_MANAGER_ID} />
        )}
        <Analytics />
        {GOOGLE_ANALYTICS_ID && (
          <>
            <Script
              src={
                "https://www.googletagmanager.com/gtag/js?id=" +
                GOOGLE_ANALYTICS_ID
              }
            />
            <Script id="google-analytics">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ANALYTICS_ID}');
              `}
            </Script>
          </>
        )}
        <Providers>
          <div className="flex flex-col min-h-screen">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
