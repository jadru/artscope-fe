"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const RedirectOAuth2 = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success">("loading");

  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }

    const controller = new AbortController();

    const applyRefreshToken = async () => {
      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: token,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("refresh failed");
        }

        setStatus("success");
        toast.success("로그인에 성공했습니다.");

        setTimeout(() => {
          router.refresh();
          router.push("/");
        }, 1500);
      } catch (error) {
        toast.error("로그인에 실패했습니다.");
        router.push("/");
      }
    };

    applyRefreshToken();

    return () => controller.abort();
  }, [router, token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-[#0A0A0A]">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
            로그인 성공
          </h1>
        </div>

        {/* Status Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-[#1A1A1A]">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-950">
              {status === "loading" ? (
                <Loader2 className="h-8 w-8 animate-spin text-green-600 dark:text-green-400" />
              ) : (
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                {status === "loading" ? "로그인 처리 중" : "로그인 완료"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {status === "loading"
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

export default RedirectOAuth2;
