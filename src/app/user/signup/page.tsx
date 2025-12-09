"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

import SignupForm from "@/app/user/signup/SignupForm";
import { useProfile } from "@/auth/use-profile";

const SignupPage = () => {
  const router = useRouter();
  const { data: user } = useProfile();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [router, user]);

  return (
    <div className="flex flex-col items-stretch gap-8 py-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          회원가입
        </h1>
        <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          ArtScope의 모든 서비스를 무료로 이용하실 수 있습니다
        </p>
      </div>

      {/* Signup Form */}
      <SignupForm />

      {/* Footer Link */}
      <div className="border-t border-gray-100 pt-6 text-center dark:border-gray-900">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/user/login"
            className="font-medium text-gray-900 transition-colors hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
