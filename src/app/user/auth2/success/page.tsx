"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";
import { AiOutlineCoffee } from "react-icons/ai";
import { toast } from "react-toastify";

import Title from "@/components/Title";
import { Button } from "@/components/ui/button";

import { useProfile } from "@/auth/use-profile";
import jxios from "@/utils/jxios";

import { loginResponseType } from "@/types/auth";

const RedirectOAuth2 = () => {
  const router = useRouter();
  // TODO: 로그인 처리
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      jxios
        .post("/refresh", token as string, {
          headers: {
            "Content-Type": "text/plain",
          },
        })
        .then(async (ressponseRefreshToken) => {
          await onLogin(
            ressponseRefreshToken.data as loginResponseType,
            router,
            setUser
          );
        })
        .catch(() => {
          toast.error("로그인에 실패했습니다.");
          router.push("/");
        });
    } else {
      router.push("/");
    }
  }, [setUser, router, token, searchParams]);

  return (
    <>
      <Title title="로그인 성공" description="로그인이 완료되었습니다." />
      <AiOutlineCoffee size={60} className="drop-shadow-glow text-orange-800" />
      <Link className="my-8" href="/">
        <Button color="primary">홈으로 돌아가기</Button>
      </Link>
    </>
  );
};

export default RedirectOAuth2;
