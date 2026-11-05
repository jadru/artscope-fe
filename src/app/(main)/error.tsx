"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

import LoadErrorState from "@/components/shared/LoadErrorState";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleRetry = () => {
    // 서버 컴포넌트 데이터를 다시 가져온 뒤 에러 경계를 초기화한다.
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4">
      <h1 className="sr-only">일시적인 오류</h1>
      <LoadErrorState
        title="페이지를 불러오지 못했어요"
        onRetry={handleRetry}
      />
      <Link
        href="/"
        className="-mt-8 inline-flex min-h-11 items-center text-sm text-gray-600 underline underline-offset-4 hover:text-gray-900"
      >
        홈으로 가기
      </Link>
    </main>
  );
}
