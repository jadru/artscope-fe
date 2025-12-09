"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function EmailVerification() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-[#0A0A0A]">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
            이메일 인증
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            메일함을 확인해주세요
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-[#1A1A1A]">
          <div className="flex flex-col items-center space-y-6 text-center">
            {/* Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
              <Mail className="h-8 w-8 animate-pulse text-blue-600 dark:text-blue-400" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                인증 메일을 발송했습니다
              </h3>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {email ? (
                  <>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {email}
                    </span>
                    <br />
                    위 주소로 보낸 이메일을 확인해주세요.
                  </>
                ) : (
                  "등록하신 이메일 주소로 인증 메일을 발송했습니다."
                )}
              </p>
            </div>

            {/* Tips */}
            <div className="w-full space-y-2 rounded-lg bg-gray-50 p-4 text-left dark:bg-gray-900">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                이메일이 보이지 않나요?
              </p>
              <ul className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                <li>• 스팸 메일함을 확인해보세요</li>
                <li>• 이메일 주소를 정확히 입력했는지 확인해보세요</li>
                <li>• 몇 분 후에 다시 시도해보세요</li>
              </ul>
            </div>

            {/* Action */}
            <Link href="/" className="w-full">
              <Button className="w-full rounded-full bg-gray-900 px-6 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
                홈으로 가기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
