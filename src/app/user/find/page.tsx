import Link from "next/link";
import { User, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function FindPWID() {
  return (
    <div className="flex flex-col items-stretch gap-8 py-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          계정 찾기
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          아이디 또는 비밀번호를 잊으셨나요?
        </p>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <Link href="/user/find/username" className="block">
          <div className="group rounded-2xl border border-gray-200 p-6 transition-all hover:border-gray-900 hover:shadow-sm dark:border-gray-800 dark:hover:border-white">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-900 dark:bg-gray-900 dark:group-hover:bg-white">
                <User className="h-5 w-5 text-gray-600 transition-colors group-hover:text-white dark:text-gray-400 dark:group-hover:text-gray-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  아이디 찾기
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  가입하신 이메일로 아이디를 찾아드립니다
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/user/find/password" className="block">
          <div className="group rounded-2xl border border-gray-200 p-6 transition-all hover:border-gray-900 hover:shadow-sm dark:border-gray-800 dark:hover:border-white">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-900 dark:bg-gray-900 dark:group-hover:bg-white">
                <Lock className="h-5 w-5 text-gray-600 transition-colors group-hover:text-white dark:text-gray-400 dark:group-hover:text-gray-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  비밀번호 찾기
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  비밀번호 재설정 링크를 이메일로 보내드립니다
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Back to Login */}
      <div className="border-t border-gray-100 pt-6 text-center dark:border-gray-900">
        <Link
          href="/user/login"
          className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          로그인 페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
}
