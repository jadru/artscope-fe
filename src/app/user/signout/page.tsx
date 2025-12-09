"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LogOut, Loader2 } from "lucide-react";

import {
  removeAccessToken,
  removeRefreshToken,
  removeAuthStateFlag,
} from "@/auth/cookieTokenManager";
import { useProfile } from "@/auth/use-profile";
import jxios from "@/utils/jxios";

const SignoutPage = () => {
  const { push, refresh } = useRouter();
  const { data: user } = useProfile();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const logout = async () => {
      try {
        await jxios.post("/api/server/logout");
      } catch (error) {
        // 에러가 발생해도 로그아웃 진행
      } finally {
        removeAccessToken();
        removeRefreshToken();
        removeAuthStateFlag();
        toast.success("로그아웃 되었습니다.");

        setTimeout(() => {
          setIsLoggingOut(false);
          refresh();
          push("/");
        }, 1000);
      }
    };

    logout();
  }, [user, refresh, push]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-[#0A0A0A]">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
            로그아웃
          </h1>
        </div>

        {/* Status Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-[#1A1A1A]">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
              {isLoggingOut ? (
                <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
              ) : (
                <LogOut className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                {isLoggingOut ? "로그아웃 중..." : "로그아웃 완료"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isLoggingOut
                  ? "잠시만 기다려주세요..."
                  : "홈 페이지로 이동합니다..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignoutPage;
