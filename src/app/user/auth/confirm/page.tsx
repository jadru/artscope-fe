"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

import jxios from "@/utils/jxios";
import { Button } from "@/components/ui/button";

const EmailConfirm = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { push } = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!code) {
      setStatus("error");
      return;
    }

    jxios
      .get("/api/server/mail/authenticate", {
        params: { code },
      })
      .then(() => {
        setStatus("success");
        toast.success("이메일 인증이 완료되었습니다.");
        setTimeout(() => push("/user/login"), 2000);
      })
      .catch(() => {
        setStatus("error");
        toast.error("인증에 실패했습니다. 링크를 다시 확인해주세요.");
      });
  }, [code, push]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-[#0A0A0A]">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
            이메일 인증
          </h1>
        </div>

        {/* Status Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-[#1A1A1A]">
          {status === "loading" && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
                <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                  인증 처리 중
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  잠시만 기다려주세요...
                </p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                  인증 완료
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  이메일 인증이 완료되었습니다.
                  <br />
                  로그인 페이지로 이동합니다...
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                  인증 실패
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  인증에 실패했습니다.
                  <br />
                  링크가 만료되었거나 올바르지 않습니다.
                </p>
              </div>
              <Button
                onClick={() => push("/user/signup")}
                className="w-full rounded-full bg-gray-900 px-6 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                회원가입 페이지로 이동
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirm;
