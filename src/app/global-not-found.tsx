import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";

import "../styles/globals.css";

import { MainFooter } from "@/components/layout";
import NotFoundContent from "@/components/shared/NotFoundContent";

// 매칭되지 않는 모든 URL에 대해 서버 HTML부터 lang="ko"와 404 본문을 내려주기 위한 전역 404.
// (루트 레이아웃을 거치지 않으므로 <html>/<body>를 직접 렌더링한다.)
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다 | Artscope",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon/favicon.svg" },
};

export default function GlobalNotFound() {
  return (
    <html lang="ko" className="light font-normal">
      <body
        className={`${pretendard.variable} m-0 min-h-screen p-0 font-sans antialiased text-foreground`}
      >
        <div className="flex min-h-screen flex-col bg-white">
          <header className="border-b border-gray-100 bg-white">
            <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
              <Link href="/" className="text-lg font-semibold text-gray-900">
                ArtScope
              </Link>
            </div>
          </header>
          <NotFoundContent />
          <MainFooter />
        </div>
      </body>
    </html>
  );
}
