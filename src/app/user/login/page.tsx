"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { AiOutlineGoogle } from "react-icons/ai";

import { Button } from "@/components/ui/button";

import LoginForm from "@/app/user/login/LoginForm";
import { NEXT_PUBLIC_API_URL } from "@/constant/env";
import { useProfile } from "@/auth/use-profile";

const Login = () => {
  const router = useRouter();
  const { data: user } = useProfile();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [router, user]);

  return (
    <div className="flex flex-col items-stretch gap-8 py-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          로그인
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ArtScope에 오신 것을 환영합니다
        </p>
      </div>

      {/* Google OAuth */}
      <Button
        variant="outline"
        className="w-full rounded-full border-gray-300 py-6 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
        onClick={() =>
          router.push(NEXT_PUBLIC_API_URL + "/oauth2/authorization/google")
        }
      >
        <AiOutlineGoogle className="mr-2 h-5 w-5" />
        구글로 계속하기
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200 dark:border-gray-800"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-500 dark:bg-[#0A0A0A] dark:text-gray-400">
            또는
          </span>
        </div>
      </div>

      {/* Login Form */}
      <LoginForm redirect={redirect} />

      {/* Footer Links */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-6 dark:border-gray-900">
        <Link
          href="/user/signup"
          className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          회원가입
        </Link>
        <Link
          href="/user/find"
          className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          아이디 / 비밀번호 찾기
        </Link>
      </div>
    </div>
  );
};

export default Login;
