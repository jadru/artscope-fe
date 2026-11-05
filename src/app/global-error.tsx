"use client";

import "../styles/globals.css";

// 루트 레이아웃까지 실패했을 때만 사용되므로 <html>/<body>를 직접 렌더링한다.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <head>
        <title>일시적인 오류 | Artscope</title>
      </head>
      <body className="m-0 bg-white font-sans antialiased">
        <main
          role="alert"
          className="flex min-h-screen flex-col items-center justify-center px-4 text-center text-gray-900"
        >
          <p className="font-['Source_Code_Pro'] text-xl font-bold">Artscope</p>
          <h1 className="mt-6 text-2xl font-semibold md:text-3xl">
            일시적인 오류가 발생했어요
          </h1>
          <p className="mt-3 max-w-sm text-sm text-gray-600">
            잠시 후 다시 시도해 주세요. 문제가 계속되면 홈에서 다시 시작해
            주세요.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => reset()}
              className="h-11 min-w-[120px] rounded-full bg-gray-900 px-6 text-sm font-medium text-white hover:bg-gray-800"
            >
              다시 시도
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="inline-flex h-11 items-center rounded-full border border-gray-300 px-6 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              홈으로 가기
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
