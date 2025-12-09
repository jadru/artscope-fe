"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

const RedirectOAuth2 = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-[#0A0A0A]">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
            로그인 실패
          </h1>
        </div>

        {/* Error Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-[#1A1A1A]">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                로그인할 수 없습니다
              </h3>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {error || "알 수 없는 오류로 외부 서비스와 로그인이 실패되었습니다."}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3">
              <Link href="/user/login" className="w-full">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-gray-200 px-6 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
                >
                  다시 로그인
                </Button>
              </Link>
              <Link href="/" className="w-full">
                <Button className="w-full rounded-full bg-gray-900 px-6 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
                  홈으로 가기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedirectOAuth2;
