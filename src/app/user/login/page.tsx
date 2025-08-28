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
    if (!!user) {
      router.push("/");
    }
  }, [router, user]);
  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <h1 className="w-full text-left text-2xl font-semibold tracking-tight">
        로그인
      </h1>
      <Button
        variant="outline"
        className="w-full"
        size="lg"
        onClick={() =>
          router.push(NEXT_PUBLIC_API_URL + "/oauth2/authorization/google")
        }
      >
        <AiOutlineGoogle className="mr-2 h-5 w-5" />
        구글로 계속하기
      </Button>

      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">또는</span>
        </div>
      </div>

      <LoginForm redirect={redirect} />

      <div className="mt-2 flex w-full justify-between text-sm text-muted-foreground">
        <Link href="/user/signup" className="hover:underline">
          회원가입
        </Link>
        <Link href="/user/find" className="hover:underline">
          아이디 / 비밀번호 찾기
        </Link>
      </div>
    </div>
  );
};

export default Login;
