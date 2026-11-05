import Link from "next/link";

// not-found.tsx(경로 내부 notFound())와 global-not-found.tsx(매칭되지 않는 URL)가 함께 쓰는 404 본문
export default function NotFoundContent() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center text-gray-900">
      <p
        aria-hidden="true"
        className="font-['Source_Code_Pro'] text-6xl font-bold text-gray-200 md:text-7xl"
      >
        404
      </p>
      <h1 className="mt-6 text-2xl font-semibold md:text-3xl">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-3 max-w-sm text-sm text-gray-600">
        주소가 바뀌었거나 삭제된 페이지일 수 있어요.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-full bg-gray-900 px-6 text-sm font-medium text-white hover:bg-gray-800"
        >
          홈으로 돌아가기
        </Link>
        <Link
          href="/gallery"
          className="inline-flex h-11 items-center rounded-full border border-gray-300 px-6 text-sm font-medium text-gray-900 hover:bg-gray-50"
        >
          갤러리 둘러보기
        </Link>
      </div>
    </main>
  );
}
